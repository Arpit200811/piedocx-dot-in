import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Zap, Target, ChevronRight, KeyRound, Megaphone, X, ShieldAlert, Check, Languages } from 'lucide-react';
import { localDB } from '../../utils/localDB';
import { translateText } from '../../utils/translation';
import Swal from 'sweetalert2';
import api from '../../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';
import { base_url, getSocketUrl } from '../../utils/info';

// Sub-components
import TestHeader from './TestInterface/TestHeader';
import QuestionNavigator from './TestInterface/QuestionNavigator';
import QuestionCard from './TestInterface/QuestionCard';
import SecurityAlert from './TestInterface/SecurityAlert';
import InstructionScreen from './TestInterface/InstructionScreen';
import TestControls from './TestInterface/TestControls';
import BroadcastMessage from './TestInterface/BroadcastMessage';
import { 
    InternetSyncNotice, 
    ScreenshotBlocker, 
    FocusRestrictionLayer, 
    SecurityWatermark, 
    BackgroundEffects,
    LiveProctorFeed
} from './TestInterface/SecurityLayer';

const ConfettiLayer = () => {
    return (
        <div className="fixed inset-0 pointer-events-none z-[100000] overflow-hidden">
            {Array.from({ length: 50 }).map((_, i) => (
                <motion.div
                    key={i}
                    initial={{
                        opacity: 1,
                        y: -20,
                        x: Math.random() * window.innerWidth,
                        rotate: 0,
                        scale: Math.random() * 0.5 + 0.5
                    }}
                    animate={{
                        opacity: 0,
                        y: window.innerHeight,
                        x: (Math.random() - 0.5) * 200 + (Math.random() * window.innerWidth),
                        rotate: 360,
                        scale: 0.2
                    }}
                    transition={{
                        duration: Math.random() * 2 + 1,
                        ease: "easeOut",
                        delay: Math.random() * 0.5
                    }}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                        backgroundColor: ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'][Math.floor(Math.random() * 5)],
                    }}
                />
            ))}
        </div>
    );
};

const TestInterface = () => {
    // Spatial Sound & Haptic Engine
    const playSound = (type) => {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);

            if (type === 'click') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(800, ctx.currentTime);
                gain.gain.setValueAtTime(0.1, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
                osc.start(); osc.stop(ctx.currentTime + 0.1);
                if (navigator.vibrate) navigator.vibrate(10);
            } else if (type === 'warn') {
                osc.type = 'square';
                osc.frequency.setValueAtTime(100, ctx.currentTime);
                gain.gain.setValueAtTime(0.2, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
                osc.start(); osc.stop(ctx.currentTime + 0.5);
                if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
            } else if (type === 'success') {
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
                osc.frequency.exponentialRampToValueAtTime(1046.5, ctx.currentTime + 0.5); // C6
                gain.gain.setValueAtTime(0.1, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
                osc.start(); osc.stop(ctx.currentTime + 0.8);
                if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
            }
        } catch (e) { console.warn('Audio bypass:', e); }
    };

    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [flagged, setFlagged] = useState({});
    const [timeLeft, setTimeLeft] = useState(0);
    const hasAutoStarted = useRef(false);
    const [testInfo, setTestInfo] = useState(null);

    // Loading States
    const [initialLoading, setInitialLoading] = useState(true);
    const [startingTest, setStartingTest] = useState(false);

    // Flow States
    const [isStarted, setIsStarted] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Security States
    const [isOutOfSync, setIsOutOfSync] = useState(false);
    const [violationCount, setViolationCount] = useState(0);
    const [accessKey, setAccessKey] = useState('');
    const [agreed, setAgreed] = useState(false);
    const [studentProfile, setStudentProfile] = useState(null);

    const [broadcastMessage, setBroadcastMessage] = useState(null);
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [language, setLanguage] = useState('en'); // 'en' or 'hi'
    const [theme, setTheme] = useState('dark'); // 'dark' or 'light'
    const [isSyncing, setIsSyncing] = useState(false);
    const [celebrate, setCelebrate] = useState(false);
    const timerRef = useRef(null);
    const saveLockRef = useRef(false);
    const videoRef = useRef(null);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const broadcastChannelRef = useRef(null);
    const blurTimeoutRef = useRef(null);
    const mouseLeaveTimeoutRef = useRef(null);
    const noiseTimerRef = useRef(null); // TRACK NOISE REQUEST ANIMATION FRAME
    const cameraStreamRef = useRef(null); // TRACK CAMERA STREAM
    const stateRef = useRef({ answers, timeLeft });

    useEffect(() => {
        stateRef.current = { answers, timeLeft };
    }, [answers, timeLeft]);

    useEffect(() => {
        const setOnline = () => setIsOnline(true);
        const setOffline = () => setIsOnline(false);
        window.addEventListener('online', setOnline);
        window.addEventListener('offline', setOffline);

        const fetchInitialData = async () => {
            const token = localStorage.getItem('studentToken');
            if (!token) {
                navigate('/student-login');
                return;
            }

            try {
                const [profileData, infoData] = await Promise.all([
                    api.get('/api/student-auth/profile'),
                    api.get('/api/student-auth/test-info')
                ]);

                setStudentProfile(profileData);

                // CRITICAL: Prevent re-entry if already attempted
                if (profileData.testAttempted) {
                    Swal.fire({
                        title: 'Exam Already Attempted',
                        text: 'You have already submitted this assessment. You cannot enter twice.',
                        icon: 'info',
                        confirmButtonColor: '#2563eb'
                    }).then(() => navigate('/student-dashboard'));
                    return;
                }

                if (!infoData) {
                    Swal.fire('Error', 'No active test found.', 'error').then(() => navigate('/student-dashboard'));
                    return;
                }
                setTestInfo(infoData);
                setInitialLoading(false);
            } catch (err) {
                const status = err.response?.status;
                if (status === 403 || status === 404) {
                    navigate('/student-dashboard');
                } else {
                    setInitialLoading(false);
                }
            }
        };

        fetchInitialData();

        return () => {
            window.removeEventListener('online', setOnline);
            window.removeEventListener('offline', setOffline);
        };
    }, [navigate]);

    useEffect(() => {
        if (!initialLoading && !isStarted && !hasAutoStarted.current && testInfo) {
            const state = window.history.state?.usr;
            if (state?.agreed) {
                console.log("Auto-starting test with state:", state);
                hasAutoStarted.current = true;
                if (state.accessKey) setAccessKey(state.accessKey);
                handleStartTest(null, state.accessKey);
            }
        }
    }, [initialLoading, isStarted, testInfo]);

    // Dynamic Translation Pulse: On-demand translation for Hindi students
    useEffect(() => {
        if (language === 'hi' && isStarted && questions.length > 0) {
            const currentQ = questions[currentQuestion];
            const needsTranslation = !currentQ.questionTextHindi || !currentQ.optionsHindi || currentQ.optionsHindi.length === 0;

            if (needsTranslation) {
                const performTranslation = async () => {
                    try {
                        console.log(`[Dynamic Translation] Translating Q${currentQuestion + 1}...`);
                        const translatedText = currentQ.questionTextHindi || await translateText(currentQ.questionText, 'hi');

                        const translatedOptions = [];
                        for (let i = 0; i < currentQ.options.length; i++) {
                            const optH = currentQ.optionsHindi?.[i] || await translateText(currentQ.options[i], 'hi');
                            translatedOptions.push(optH);
                        }

                        setQuestions(prev => {
                            const newQs = [...prev];
                            newQs[currentQuestion] = {
                                ...newQs[currentQuestion],
                                questionTextHindi: translatedText,
                                optionsHindi: translatedOptions
                            };
                            return newQs;
                        });
                    } catch (e) {
                        console.error("Translation Pulse Error:", e);
                    }
                };
                performTranslation();
            }
        }
    }, [language, currentQuestion, isStarted]);


    // 2. Start Test Function
    const handleStartTest = async (e = null, manualAccessKey = null) => {
        if (e) e.preventDefault();

        // Input Validation
        const keyToUse = manualAccessKey || accessKey || '';
        if (testInfo?.hasAccessKey && !keyToUse.trim()) {
            Swal.fire('Key Required', 'Please enter the access key to start.', 'warning');
            return;
        }

        // Fullscreen Gesture (Must be first)
        enterFullScreen();
        setStartingTest(true);

        try {
            // Fetch Questions - Bind to specific Test ID for security key integrity
            const qData = await api.post('/api/student-auth/questions', {
                accessKey: keyToUse,
                testId: testInfo.id
            });

            // Try to recover from localStorage first (for this specific specific student + test)
            const localKey = `answers_${studentProfile?.studentId}_${testInfo?.id}`;
            const localAnswers = JSON.parse(localStorage.getItem(localKey) || "{}");

            // FEATURE #2: Backup to IndexedDB for "Unbreakable" Offline Support
            if (qData.questions?.length > 0) {
                await localDB.save('questions', {
                    id: `${studentProfile?.studentId}_${testInfo?.id}`,
                    data: qData.questions,
                    timestamp: Date.now()
                });
            }

            // Merge server saved answers with local cache (server wins if conflict)
            const combinedAnswers = { ...localAnswers, ...(qData.savedAnswers || {}) };

            // --- SEEDED SHUFFLE: Consistent randomized order for this student/test session ---
            const seedShuffle = (array, seedString) => {
                let seedVal = 0;
                for (let i = 0; i < seedString.length; i++) seedVal += seedString.charCodeAt(i);

                const shuffled = [...array];
                let m = shuffled.length, t, i;
                while (m) {
                    i = Math.floor((Math.abs(Math.sin(seedVal++) * 10000)) % m--);
                    t = shuffled[m];
                    shuffled[m] = shuffled[i];
                    shuffled[i] = t;
                }
                return shuffled;
            };

            const mySeed = `${studentProfile?.studentId}_${testInfo?.id}`;
            const randomizedQuestions = seedShuffle(qData.questions, mySeed).map(q => ({
                ...q,
                options: seedShuffle(q.options, q._id)
            }));

            setQuestions(randomizedQuestions);
            setAnswers(combinedAnswers);

            if (typeof qData.remainingSeconds === 'number') {
                setTimeLeft(qData.remainingSeconds);
            } else {
                const elapsed = qData.elapsedTime || 0;
                const totalDuration = qData.duration * 60;
                setTimeLeft(Math.max(0, totalDuration - elapsed));
            }

            // Welcome Voice
            if (window.speechSynthesis) {
                const msg = new SpeechSynthesisUtterance(`Assessment started. Good luck ${studentProfile?.fullName?.split(' ')[0]}. Monitoring is active.`);
                msg.rate = 1.0;
                window.speechSynthesis.speak(msg);
            }

            setIsStarted(true);
            setStartingTest(false);

        } catch (err) {
            setStartingTest(false);
            hasAutoStarted.current = false; // RESET THE AUTO-START LOADER ON FAILURE
            const errorMsg = err.response?.data?.message || 'Could not start test. Please check internet and try again.';
            if (err.response?.status === 401 && err.response.data.requiresKey) {
                Swal.fire('Wrong Key', 'Incorrect key. Please try again.', 'error');
            } else if (err.response?.status === 403) {
                Swal.fire('Access Denied', errorMsg, 'error');
            } else {
                Swal.fire('Error', errorMsg, 'error');
            }
        }
    };





    const socketRef = useRef(null);

    useEffect(() => {
        if (isStarted && !socketRef.current && testInfo) {
            const token = localStorage.getItem('studentToken');
            const socketUrl = getSocketUrl();

            const newSocket = io(socketUrl, {
                auth: { token },
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000
            });

            newSocket.on('connect', () => {
                setIsOnline(true);
                newSocket.emit('join_exam', {
                    testId: testInfo.id,
                    deviceInfo: {
                        userAgent: navigator.userAgent,
                        resolution: `${window.screen.width}x${window.screen.height}`
                    }
                });
            });

            newSocket.on('disconnect', () => {
                setIsOnline(false);
            });

            newSocket.on('force_terminate', (data) => {
                Swal.fire('Terminated', data.reason, 'error').then(() => {
                    handleSubmitTest(true);
                });
            });

            newSocket.on('broadcast_notice', (data) => {
                setBroadcastMessage(data);
                // Auto-clear after 15 seconds or keep until dismissed? 
                // Let's keep it for 20 seconds for high visibility
                setTimeout(() => setBroadcastMessage(null), 20000);

                // Audio cue if possible, or just a toast
                Swal.fire({
                    title: 'ADMIN MESSAGE',
                    text: data.message,
                    icon: 'info',
                    toast: true,
                    position: 'top',
                    timer: 10000,
                    showConfirmButton: false,
                    background: '#1e293b',
                    color: '#fff'
                });
            });

            newSocket.on('admin_warning', (data) => {
                Swal.fire({
                    title: '🚨 OFFICIAL WARNING 🚨',
                    text: data.message,
                    icon: 'warning',
                    confirmButtonText: 'I Understand',
                    confirmButtonColor: '#2563eb',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    background: '#1e293b',
                    color: '#fff'
                });
            });

            socketRef.current = newSocket;

            return () => {
                if (socketRef.current) {
                    socketRef.current.disconnect();
                    socketRef.current = null;
                }
            };
        }
    }, [isStarted]); // Minimal dependency array to avoid reconnection loops

    // Risk Engine Hook
    const reportViolationSocket = (type) => {
        if (socketRef.current) socketRef.current.emit('violation', { type });
    };
    useEffect(() => {
        if (!isStarted || submitting) return;
        const interval = setInterval(() => {
            if (socketRef.current) {
                // Heartbeat to the server to maintain presence - throttled to 60s for high concurrency
                socketRef.current.emit('heartbeat', { ts: Date.now() });
            }
        }, 60000);
        return () => clearInterval(interval);
    }, [isStarted, submitting]);
    const [isFocused, setIsFocused] = useState(true);
    const [screenshotFlash, setScreenshotFlash] = useState(false);
    const [noiseViolation, setNoiseViolation] = useState(false);
    const [syncError, setSyncError] = useState(false);
    const lastApiViolationTime = useRef(0);
    const API_COOLDOWN_MS = 3000;
    const lastHiddenTime = useRef(0);
    useEffect(() => {
        if (!isStarted || submitting) return;
        const channelName = `test_session_${studentProfile?.studentId}_${testInfo?.id}`;
        broadcastChannelRef.current = new BroadcastChannel(channelName);
        broadcastChannelRef.current.postMessage({ type: 'NEW_TAB_OPENED', time: Date.now() });

        broadcastChannelRef.current.onmessage = (event) => {
            if (event.data?.type === 'NEW_TAB_OPENED') {
                handleViolation("Multi-Tab Access Detected (Forbidden Action)");
                setIsOutOfSync(true);
            }
        };
        /* const startSonicProctor = async (stream) => {
            try {
                if (!stream || stream.getAudioTracks().length === 0) return;

                audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
                const source = audioContextRef.current.createMediaStreamSource(stream);
                analyserRef.current = audioContextRef.current.createAnalyser();
                analyserRef.current.fftSize = 256;
                source.connect(analyserRef.current);
                const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
                let noiseCounter = 0;

                const checkNoise = () => {
                    if (submitting) return;
                    analyserRef.current.getByteFrequencyData(dataArray);
                    let peak = 0;
                    for (let i = 0; i < dataArray.length; i++) {
                        if (dataArray[i] > peak) peak = dataArray[i];
                    }
                    if (peak > 155) {
                        noiseCounter++;
                        if (noiseCounter > 30) {
                            handleViolation("Excessive Ambient Noise / Speech Detected");
                            noiseCounter = 0;
                            setNoiseViolation(true);
                            setTimeout(() => setNoiseViolation(false), 3000);
                        }
                    } else {
                        noiseCounter = Math.max(0, noiseCounter - 1);
                    }
                    noiseTimerRef.current = requestAnimationFrame(checkNoise);
                };
                noiseTimerRef.current = requestAnimationFrame(checkNoise);
            } catch (e) {
                console.error("Sonic Proctor Error:", e);
            }
        }; */

        const initCamera = async () => {
            try {
                // Request BOTH audio and video to enforce strict permission and deter cheating
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                cameraStreamRef.current = stream; 
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
                stream.getTracks().forEach(track => {
                    track.onended = () => {
                        handleViolation("Camera/Mic Access Terminated");
                    };
                });
                
                // --- ONCE CAMERA/MIC IS READY, START AUDIO ANALYSIS ---
                // startSonicProctor(stream);

            } catch (err) {
                console.warn("Camera/Mic access denied or unavailable");
                // Mandatory enforcement: if they block camera, we violate them instantly
                handleViolation("Hardware Permissions Denied (Camera/Mic)");
                Swal.fire({
                    title: 'Security Requirement',
                    text: 'Camera & Microphone access is mandatory for this AI-Proctored exam. Please enable permissions and refresh.',
                    icon: 'error',
                    confirmButtonColor: '#2563eb'
                });
            }
        };
        initCamera();
        const detectScreenCapture = async () => {
            try {
                // Modern Chrome/Edge expose a list of active capture sessions
                if (navigator.mediaDevices && 'getDisplayMedia' in navigator.mediaDevices) {
                    const _orig = navigator.mediaDevices.getDisplayMedia.bind(navigator.mediaDevices);
                    navigator.mediaDevices.getDisplayMedia = async (...args) => {
                        handleViolation('Screen Recording / Share Attempt Detected');
                        try {
                            const stream = await _orig(...args);
                            stream.getTracks().forEach(t => t.stop());
                            return stream;
                        } catch (e) { throw e; }
                    };
                }
            } catch (e) { }
        };
        detectScreenCapture();

        // --- PRIMARY: visibilitychange — works on BOTH desktop & mobile ---
        // iOS BONUS: On iPhone, taking a screenshot causes a ~100ms visibility flicker.
        // We detect that pattern: hidden→visible in under 300ms = screensho
        const handleVisibilityChange = () => {
            if (document.hidden) {
                lastHiddenTime.current = Date.now();
                // INSTANT blackout
                setIsFocused(false);
                handleViolation("App/Tab/Screen Switch Detected");
            } else {
                const hiddenDuration = Date.now() - lastHiddenTime.current;
                // iOS/Android screenshot: page goes hidden and comes back in < 350ms
                if (lastHiddenTime.current > 0 && hiddenDuration < 350) {
                    triggerScreenshotFlash('System Screenshot Detected');
                }
                setIsFocused(true);
                if (!document.fullscreenElement) {
                    setTimeout(enterFullScreen, 200);
                }
            }
        };

        const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
        const handleBlur = () => {
            if (isMobile) return;
            setIsFocused(false);
            // Instant violation on blur for desktop (prevents sniping tool delay)
            handleViolation("Prolonged Focus Loss (Desktop Notification or Switch)");
        };

        const handleFocus = () => {
            if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
            setIsFocused(true);
            if (!document.fullscreenElement) {
                setTimeout(enterFullScreen, 100);
            }
        };

        // Fullscreen exit — only for browsers that support it (desktop mostly)
        const handleFullScreenChange = () => {
            if (!document.fullscreenElement && isStarted && !submitting) {
                handleViolation("Exited Full Screen");
            }
        };

        // Fires when the page unloads / goes into BFCache
        const handlePageHide = () => {
            // Don't call triggerViolation — just sync answers to server passively
            // Real cheating is caught by visibilitychange above. pagehide is too noisy.
        };

        // --- SPLIT SCREEN: Safe ratio-based detection ---
        // Only fires if viewport shrinks to < 55% of physical screen (true split-screen)
        // This does NOT fire on Android URL bar hide/show (which is < 10% change)
        let resizeTimeout;
        const handleResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                const screenH = window.screen.height;
                const screenW = window.screen.width;
                const heightRatio = window.innerHeight / screenH;
                const widthRatio = window.innerWidth / screenW;
                if (heightRatio < 0.50 || widthRatio < 0.50) {
                    handleViolation("Split Screen / Floating App Detected");
                    setTimeout(enterFullScreen, 100);
                }
            }, 800);
        };

        // --- COPY/PASTE Prevention ---
        const preventCopyPaste = (e) => {
            e.preventDefault();
            handleViolation("Copy/Paste Attempt");
            Swal.fire({ toast: true, position: 'top-end', icon: 'warning', title: 'Action Prohibited', showConfirmButton: false, timer: 1500 });
        };

        // --- KEYBOARD Shortcuts (Desktop DevTools) ---
        const blockKeys = (e) => {
            // F12
            if (e.keyCode === 123) { e.preventDefault(); handleViolation("DevTools F12"); return false; }
            // Ctrl+Shift+I, J, C
            if (e.ctrlKey && e.shiftKey && [73, 74, 67].includes(e.keyCode)) { e.preventDefault(); handleViolation("DevTools Keyboard Shortcut"); return false; }
            // Ctrl+U
            if (e.ctrlKey && e.keyCode === 85) { e.preventDefault(); handleViolation("View Source Attempt"); return false; }
            // PrintScreen (Keycode 44)
            if (e.keyCode === 44 || e.key === 'PrintScreen') {
                e.preventDefault();
                triggerScreenshotFlash("PrintScreen Key Pressed");
                return false;
            }
            // Win+Shift+S (S is 83)
            if (e.metaKey && e.shiftKey && e.keyCode === 83) {
                e.preventDefault();
                triggerScreenshotFlash("Snipping Tool Shortcut");
                return false;
            }
            // Ctrl+P (Print)
            if (e.ctrlKey && e.keyCode === 80) {
                e.preventDefault();
                handleViolation("Print Attempt Prohibited");
                return false;
            }
        };

        // --- ORIENTATION (Mobile): WARN only — don't violate (they may just be sitting down) ---
        // Only mark as violation if it stays flipped for > 3 seconds (deliberate rotation for screenshot)
        let orientationViolationTimer;
        const handleOrientationChange = () => {
            clearTimeout(orientationViolationTimer);
            Swal.fire({ toast: true, position: 'top-end', icon: 'warning', title: '⚠️ Rotate back to portrait!', showConfirmButton: false, timer: 3000 });
            orientationViolationTimer = setTimeout(() => {
                if (window.screen.orientation?.type?.includes('landscape')) {
                    // Landscape stayed for 3s = deliberate (screenshot attempt)
                    handleViolation("Deliberate Landscape Rotation (Screenshot Attempt)");
                }
            }, 3000);
        };
        const handleTouchStart = (e) => {
            if (e.touches && e.touches.length >= 3) {
                triggerScreenshotFlash("Multi-finger Screenshot Gesture");
                e.preventDefault();
            }
        };
        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("blur", handleBlur);
        window.addEventListener("focus", handleFocus);
        window.addEventListener("resize", handleResize);
        const checkDevToolsDetail = () => {
            const widthDiff = window.outerWidth - window.innerWidth;
            const heightDiff = window.outerHeight - window.innerHeight;
            if (widthDiff > 200 || heightDiff > 200) {
                if (!isMobile) handleViolation("Developer Tools Opened");
            }
        };
        const dtInterval = setInterval(checkDevToolsDetail, 2000);

        // Multi-touch detection for screenshots on mobile
        window.addEventListener("touchstart", handleTouchStart, { passive: false });
        window.addEventListener("touchmove", (e) => {
            if (e.touches && e.touches.length >= 3) {
                e.preventDefault(); // Block 3+ finger gestures (screenshot gestures)
            }
        }, { passive: false });

        window.addEventListener("orientationchange", handleOrientationChange);
        document.addEventListener("fullscreenchange", handleFullScreenChange);
        document.addEventListener("copy", preventCopyPaste);
        document.addEventListener("cut", preventCopyPaste);
        document.addEventListener("paste", preventCopyPaste);
        document.addEventListener("keydown", blockKeys);

        window.addEventListener("mouseleave", () => {
            if (isMobile) return;
            setIsFocused(false);
            if (mouseLeaveTimeoutRef.current) clearTimeout(mouseLeaveTimeoutRef.current);
            mouseLeaveTimeoutRef.current = setTimeout(() => {
                handleViolation("Prolonged Mouse Exit (Desktop)");
            }, 800);
        });

        window.addEventListener("mouseenter", () => {
            if (mouseLeaveTimeoutRef.current) clearTimeout(mouseLeaveTimeoutRef.current);
            setIsFocused(true);
        });

        document.addEventListener("keyup", (e) => {
            if (e.key === 'PrintScreen') {
                triggerScreenshotFlash("PrintScreen Released");
            }
        });
        document.addEventListener("contextmenu", (e) => e.preventDefault());

        return () => {
            clearInterval(dtInterval);
            if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
            if (mouseLeaveTimeoutRef.current) clearTimeout(mouseLeaveTimeoutRef.current);
            clearTimeout(resizeTimeout);
            if (broadcastChannelRef.current) {
                broadcastChannelRef.current.close();
                broadcastChannelRef.current = null;
            }
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("blur", handleBlur);
            window.removeEventListener("focus", handleFocus);
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("touchstart", handleTouchStart);
            window.removeEventListener("orientationchange", handleOrientationChange);
            document.removeEventListener("fullscreenchange", handleFullScreenChange);
            document.removeEventListener("copy", preventCopyPaste);
            document.removeEventListener("cut", preventCopyPaste);
            document.removeEventListener("paste", preventCopyPaste);
            document.removeEventListener("keydown", blockKeys);
            window.removeEventListener("mouseleave", () => { });
            window.removeEventListener("mouseenter", () => { });
            document.removeEventListener("contextmenu", (e) => e.preventDefault());
        };
    }, [isStarted, submitting, navigate]);

    // FRAME-LAG ENGINE
    useEffect(() => {
        if (!isStarted || submitting) return;
        let lastTime = performance.now();
        let frameHandle;

        const checkFrameLag = (now) => {
            if (submitting) return;
            const diff = now - lastTime;
            if (diff > 850) {
                setIsFocused(false);
                setTimeout(() => setIsFocused(true), 1500);
            }
            lastTime = now;
            frameHandle = requestAnimationFrame(checkFrameLag);
        };
        frameHandle = requestAnimationFrame(checkFrameLag);
        return () => cancelAnimationFrame(frameHandle);
    }, [isStarted, submitting]);


    // 4. Manual Progress Sync (Triggered by Button or Interval)
    const syncProgress = async (currentAnswers, currentTimer, isQuiet = false) => {
        if (saveLockRef.current || !isOnline) return;
        saveLockRef.current = true;
        if (!isQuiet) setIsSyncing(true);

        try {
            const res = await api.post('/api/student-auth/sync-progress', {
                testId: testInfo?.id,
                answers: currentAnswers,
                timeLeft: currentTimer
            });

            // Update real-time score via socket
            if (socketRef.current && res.currentScore !== undefined) {
                socketRef.current.emit('progress_update', {
                    attemptedCount: Object.keys(currentAnswers).length,
                    totalQuestions: questions.length,
                    currentQuestion: currentQuestion + 1,
                    score: res.currentScore
                });
            }

            setSyncError(false); // Clear any previous error indicator

            if (!isQuiet) {
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: 'Cloud Sync Successful',
                    showConfirmButton: false,
                    timer: 1500,
                    background: '#1e293b',
                    color: '#fff'
                });
            }
        } catch (err) {
            setSyncError(true); // TRIGGER THE RED BANNER UI
            // Only alert with modal if manual button was clicked.
            if (!isQuiet) {
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'error',
                    title: 'Sync Failed - Check Internet',
                    showConfirmButton: false,
                    timer: 3000
                });
            }
        } finally {
            saveLockRef.current = false;
            setIsSyncing(false);
        }
    };

    // 4. Timer Logic Only
    useEffect(() => {
        if (!isStarted || submitting || timeLeft <= 0) return;

        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    handleSubmitTest(true, 'normal', 'Time Out'); // Auto submit
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timerRef.current);
    }, [isStarted, submitting, timeLeft]);

    const lastSyncedAnswersRef = useRef('{}');
    useEffect(() => {
        if (!isStarted || submitting) return;

        // --- WORLD-CLASS SCALING: Adaptive Sync & Jitter ---
        // Stagger sync requests (0-30s delay) and increase interval to 120s for 300+ users
        const syncJitter = Math.floor(Math.random() * 30000);
        const autoSync = setInterval(() => {
            const currentAnswersStr = JSON.stringify(stateRef.current.answers);
            if (currentAnswersStr !== lastSyncedAnswersRef.current) {
                console.log("[Sync Engine] Change detected. Syncing progress...");
                syncProgress(stateRef.current.answers, stateRef.current.timeLeft, true);
                lastSyncedAnswersRef.current = currentAnswersStr;
            } else {
                console.log("[Sync Engine] No changes since last sync. Skipping to save bandwidth.");
            }
        }, 120000 + syncJitter);

        const handleBeforeUnload = (e) => {
            if (isStarted && !submitting) {
                syncProgress(stateRef.current.answers, stateRef.current.timeLeft, true);
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            clearInterval(autoSync);
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [isStarted, submitting]);

    const lastSocketUpdate = useRef(0);
    const syncProgressToServer = (newAnswers) => {
        if (studentProfile && testInfo) {
            const localKey = `answers_${studentProfile.studentId}_${testInfo.id}`;
            localStorage.setItem(localKey, JSON.stringify(newAnswers));
        }

        // DEBOUNCED SOCKET EMIT: Throttle to once every 5 seconds per student to scale
        const now = Date.now();
        if (socketRef.current && (now - lastSocketUpdate.current > 5000)) {
            lastSocketUpdate.current = now;
            socketRef.current.emit('progress_update', {
                attemptedCount: Object.keys(newAnswers).length,
                totalQuestions: questions.length,
                currentQuestion: currentQuestion + 1
            });
        }
    };

    const handleAnswerSelect = (questionId, option) => {
        if (!isStarted || submitting || isOutOfSync || timeLeft <= 0) return;
        setAnswers(prev => {
            const newAnswers = { ...prev, [questionId]: option };
            syncProgressToServer(newAnswers);

            // FEATURE #2: Immediate local persistence in IndexedDB
            localDB.updateAnswers(studentProfile.studentId, testInfo.id, newAnswers, timeLeft)
                .catch(err => console.error("Local Save Error:", err));

            return newAnswers;
        });
    };

    const toggleFlag = (questionId) => {
        setFlagged(prev => ({
            ...prev,
            [questionId]: !prev[questionId]
        }));
    };

    const handleViolation = (type) => {
        if (!isStarted || submitting) return;
        playSound('warn');
        setViolationCount(prev => prev + 1);
        setIsOutOfSync(true);
        setIsFocused(false);
        if (navigator.vibrate) {
            navigator.vibrate([100, 50, 100, 50, 200]);
        }
        reportViolationSocket(type);
        if (window.speechSynthesis && !submitting) {
            const warningMsgs = [
                "Violation detected.",
                "Focus on your test.",
                "Movement recorded.",
                "Cheating attempt logged."
            ];
            const randomMsg = warningMsgs[Math.floor(Math.random() * warningMsgs.length)];
            const utterance = new SpeechSynthesisUtterance(randomMsg);
            utterance.volume = 0.5;
            window.speechSynthesis.speak(utterance);
        }
        const now = Date.now();
        if (now - lastApiViolationTime.current >= API_COOLDOWN_MS) {
            lastApiViolationTime.current = now;
            const token = localStorage.getItem('studentToken');
            if (token) {
                api.post('/api/student-auth/log-violation', { reason: type }).then(res => {
                    if (res && res.shouldTerminate) {
                        Swal.fire({
                            title: 'TEST TERMINATED',
                            text: 'Multiple critical violations recorded. Examination terminated.',
                            icon: 'error',
                            confirmButtonText: 'Exit Secure Environment',
                            confirmButtonColor: '#ef4444',
                            allowOutsideClick: false
                        }).then(() => {
                            handleSubmitTest(true, 'terminated', type || 'Multiple Violations');
                        });
                    }
                }).catch(() => { });
            }
        }
    };
    const triggerScreenshotFlash = (reason) => {
        setScreenshotFlash(true);
        setTimeout(() => setScreenshotFlash(false), 600);
        handleViolation(reason);
    };
    useEffect(() => {
        if (isStarted && !submitting && timeLeft === 0) {
            handleSubmitTest(true, 'normal', 'Time Out');
        }
    }, [isStarted, timeLeft])
    const enterFullScreen = () => {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
            elem.requestFullscreen().catch(err => { });
        }
        setIsOutOfSync(false);
    };
    const handleSubmitTest = async (autoSubmit = false, submissionType = 'normal', reason = 'Manual Submit') => {
        if (submitting) return;

        // --- SCALING FIX: Add 0-10s Jitter for Auto-Submissions ---
        // Prevents 200+ clients hitting the server at the exact same millisecond when timer hits 0
        if (autoSubmit) {
            const jitterMs = Math.floor(Math.random() * 10000);
            console.log(`[High-Concurrency] Staggering auto-submit by ${jitterMs}ms...`);
            await new Promise(r => setTimeout(r, jitterMs));
        }

        if (!autoSubmit) {
            const result = await Swal.fire({
                title: 'Submit Assessment?',
                text: "You won't be able to change your answers after submission.",
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#2563eb',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, Submit Now'
            });
            if (!result.isConfirmed) return;
        }

        if (saveLockRef.current) return;
        saveLockRef.current = true;
        setSubmitting(true);

        // --- RELIABILITY ENGINE: Recursive Retry with Exponential Backoff ---
        const attemptSubmit = async (attempt = 1) => {
            try {
                const res = await api.post('/api/student-auth/submit-test', {
                    testId: testInfo?.id,
                    answers,
                    submissionType,
                    reason
                }, { timeout: 45000 }); // Robust 45s timeout for high-load handling

                const localKey = `answers_${studentProfile?.studentId}_${testInfo?.id}`;
                localStorage.removeItem(localKey);
                setCelebrate(true);
                playSound('success');

                const isAsync = res.status === 'processing' || res.message?.includes('received');
                
                Swal.fire({
                    title: isAsync ? 'Submission Received!' : 'Test Submitted!',
                    text: isAsync ? 'Securely saved to cloud. Redirecting...' : 'Redirecting to feedback...',
                    icon: 'success',
                    timer: 3000,
                    showConfirmButton: false,
                    willClose: () => navigate('/feedback')
                });
            } catch (err) {
                console.error(`Submission Attempt #${attempt} Failed:`, err);
                if (attempt < 5) { // Try up to 5 times (1s, 2s, 4s, 8s, 16s)
                    const backoffMs = Math.pow(2, attempt) * 1000;
                    console.warn(`[Network Resilience] Retrying in ${backoffMs}ms...`);
                    await new Promise(r => setTimeout(r, backoffMs));
                    return attemptSubmit(attempt + 1);
                }

                const errorMsg = err.response?.data?.message || 'Heavy server load. Please dont close windows. Retrying failed.';
                Swal.fire('Extreme Sync Delay', errorMsg, 'error');
                setSubmitting(false);
                saveLockRef.current = false;
            }
        };

        await attemptSubmit();
    };
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    if (initialLoading || (hasAutoStarted.current && !isStarted)) return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4 text-center">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-blue-400 font-bold tracking-widest uppercase text-xs animate-pulse">
                    {hasAutoStarted.current ? "Launching Your Secure Assessment..." : "Establishing Connection..."}
                </p>
                {hasAutoStarted.current && <p className="text-slate-500 text-[9px] uppercase font-bold tracking-widest">Applying proctoring protocols</p>}
            </div>
        </div>
    );

    if (!isStarted) return (
        <InstructionScreen 
            testInfo={testInfo}
            studentProfile={studentProfile}
            agreed={agreed}
            setAgreed={setAgreed}
            accessKey={accessKey}
            setAccessKey={setAccessKey}
            onStart={handleStartTest}
            theme={theme}
        />
    );

    return (
        <div
            className={`min-h-screen transition-colors duration-700 ${theme === 'dark' ? 'dark-mesh text-white' : 'bg-[#f8fafc] text-slate-900'} p-3 md:p-6 lg:p-8 font-sans select-none relative overflow-hidden ${!isFocused ? 'blur-3xl grayscale brightness-0 pointer-events-none' : ''}`}
            onContextMenu={e => e.preventDefault()}
            style={{
                WebkitUserSelect: 'none',
                WebkitTouchCallout: 'none',
                userSelect: 'none',
                msUserSelect: 'none'
            }}
        >
            {/* Theme Toggle Floating Button */}
            <div className="fixed top-24 right-4 z-[9000] flex flex-col gap-3">
                <button
                    onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-2xl border transition-all ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-800'}`}
                >
                    {theme === 'dark' ? '☀️' : '🌙'}
                </button>
            </div>

            <InternetSyncNotice isOnline={isOnline} syncError={syncError} onSync={() => syncProgress(answers, timeLeft)} />
            <ScreenshotBlocker active={screenshotFlash} />
            <FocusRestrictionLayer isFocused={isFocused} />
            <BackgroundEffects />
            <SecurityWatermark studentProfile={studentProfile} />
            <LiveProctorFeed videoRef={videoRef} noiseViolation={noiseViolation} />
            <AnimatePresence>
                <SecurityAlert 
                    isOutOfSync={isOutOfSync} 
                    violationCount={violationCount} 
                    studentId={studentProfile?.studentId} 
                    onReEnter={enterFullScreen} 
                />
            </AnimatePresence>

            {celebrate && <ConfettiLayer />}

            <div className={`max-w-7xl mx-auto flex flex-col gap-6 h-full min-h-[92vh] transition-all duration-300 ${isOutOfSync || !isFocused ? 'blur-[80px] scale-95 opacity-20 grayscale pointer-events-none' : ''}`}>

                <BroadcastMessage message={broadcastMessage} onClose={() => setBroadcastMessage(null)} />

                {/* Header */}
                <TestHeader 
                    testTitle={testInfo?.title}
                    isOnline={isOnline}
                    isSyncing={isSyncing}
                    completedPercentage={(Object.keys(answers).length / questions.length) * 100}
                    timeLeft={timeLeft}
                    theme={theme}
                />

                <div className="grid lg:grid-cols-4 gap-8 flex-1 items-start">
                    {/* Navigator */}
                    <QuestionNavigator 
                        questions={questions}
                        answers={answers}
                        flagged={flagged}
                        currentQuestion={currentQuestion}
                        onNavigate={setCurrentQuestion}
                        theme={theme}
                        submitting={submitting}
                        timeLeft={timeLeft}
                    />

                    {/* Question Hub */}
                    <main className="lg:col-span-3 flex flex-col gap-8">
                        <QuestionCard 
                            question={questions[currentQuestion]}
                            index={currentQuestion}
                            totalQuestions={questions.length}
                            answers={answers}
                            language={language}
                            onLanguageToggle={() => setLanguage(l => l === 'en' ? 'hi' : 'en')}
                            onAnswerSelect={(id, opt) => {
                                playSound('click');
                                handleAnswerSelect(id, opt);
                            }}
                            theme={theme}
                            submitting={submitting}
                            timeLeft={timeLeft}
                        />

                        <TestControls 
                            theme={theme}
                            submitting={submitting}
                            timeLeft={timeLeft}
                            currentQuestion={currentQuestion}
                            questions={questions}
                            flagged={flagged}
                            onPrev={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                            onNext={() => setCurrentQuestion(currentQuestion + 1)}
                            onToggleFlag={() => toggleFlag(questions[currentQuestion]?._id)}
                            onSubmit={() => handleSubmitTest(false, 'normal', 'Manual Submit')}
                            playSound={playSound}
                        />
                    </main>
                </div>
            </div>

            {/* Global Style Injector */}
            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.2); }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(37, 99, 235, 0.5); }
                body { background-color: #030712; }
            `}</style>
        </div>
    );
};

export default TestInterface;
