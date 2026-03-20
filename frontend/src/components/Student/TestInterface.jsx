import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Zap, Target, ChevronRight, KeyRound, Megaphone, X, ShieldAlert, Check } from 'lucide-react';
import Swal from 'sweetalert2';
import api from '../../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';
import { base_url, getSocketUrl } from '../../utils/info';


const TestInterface = () => {
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
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
    const [isSyncing, setIsSyncing] = useState(false);
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const timerRef = useRef(null);
    const saveLockRef = useRef(false);
    const videoRef = useRef(null);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const broadcastChannelRef = useRef(null);
    const blurTimeoutRef = useRef(null);
    const mouseLeaveTimeoutRef = useRef(null);
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
    // Risk Engine Heartbeat - Decoupled from countdown to avoid timer churn
    useEffect(() => {
        if (!isStarted || submitting) return;
        const interval = setInterval(() => {
            if (socketRef.current) {
                // Heartbeat to the server to maintain presence - throttled to 30s for performance
                socketRef.current.emit('heartbeat', { ts: Date.now() });
            }
        }, 30000); // 30s instead of 15s (Better for 200+ students)
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
        const startSonicProctor = async (stream) => {
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
                    requestAnimationFrame(checkNoise);
                };
                checkNoise();
            } catch (e) {
                console.error("Sonic Proctor Error:", e);
            }
        };
        const initCamera = async () => {
            try {
                // Request BOTH audio and video to enforce strict permission and deter cheating
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
                stream.getTracks().forEach(track => {
                    track.onended = () => {
                        handleViolation("Camera/Mic Access Terminated");
                    };
                });
                
                // --- ONCE CAMERA/MIC IS READY, START AUDIO ANALYSIS ---
                startSonicProctor(stream);

            } catch (err) {
                console.warn("Camera/Mic access denied or unavailable");
                // Mandatory enforcement: if they block camera, we violate them instantly
                handleViolation("Hardware Permissions Denied (Camera/Mic)");
                Swal.fire('Device Error', 'Camera/Mic permissions are MANDATORY for AI Proctoring.', 'error');
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
            if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
            blurTimeoutRef.current = setTimeout(() => {
                handleViolation("Prolonged Focus Loss (Desktop Notification or Switch)");
            }, 2000); 
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
            }, 2500); 
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
            if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
            if (mouseLeaveTimeoutRef.current) clearTimeout(mouseLeaveTimeoutRef.current);
            clearTimeout(resizeTimeout);
            clearTimeout(orientationViolationTimer);
            if (broadcastChannelRef.current) {
                broadcastChannelRef.current.close();
                broadcastChannelRef.current = null;
            }
            if (audioContextRef.current) {
                audioContextRef.current.close();
                audioContextRef.current = null;
            }
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("blur", handleBlur);
            window.removeEventListener("focus", handleFocus);
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("touchstart", handleTouchStart);
            window.removeEventListener("touchmove", () => {});
            window.removeEventListener("orientationchange", handleOrientationChange);
            document.removeEventListener("fullscreenchange", handleFullScreenChange);
            document.removeEventListener("copy", preventCopyPaste);
            document.removeEventListener("cut", preventCopyPaste);
            document.removeEventListener("paste", preventCopyPaste);
            document.removeEventListener("keydown", blockKeys);
            window.removeEventListener("mouseleave", () => {});
            window.removeEventListener("mouseenter", () => {});
            document.removeEventListener("keyup", () => {});
            document.removeEventListener("contextmenu", (e) => e.preventDefault());
        };
    }, [isStarted, submitting, navigate]);

    // FRAME-LAG ENGINE: Detects when the OS "freezes" the browser for a screenshot (Android/iOS pattern)
    useEffect(() => {
        if (!isStarted || submitting) return;
        let lastTime = performance.now();
        let frameHandle;

        const checkFrameLag = (now) => {
            if (submitting) return;
            const diff = now - lastTime;
            // Most OS screenshots cause a CPU stall of 350ms - 800ms
            if (diff > 850) {
                setIsFocused(false);
                setTimeout(() => setIsFocused(true), 1500); // Auto-recover after blackout
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

    // 5. Automatic Background Sync (High Frequency — every 15 Seconds)
    useEffect(() => {
        if (!isStarted || submitting) return;

        const autoSync = setInterval(() => {
            syncProgress(stateRef.current.answers, stateRef.current.timeLeft, true);
        }, 15000); // 15s stable sync

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
    const handleAnswerSelect = (questionId, option) => {
        const newAnswers = { ...answers, [questionId]: option };
        setAnswers(newAnswers);
        if (studentProfile && testInfo) {
            const localKey = `answers_${studentProfile.studentId}_${testInfo.id}`;
            localStorage.setItem(localKey, JSON.stringify(newAnswers));
        }
        if (socketRef.current) {
            socketRef.current.emit('progress_update', {
                attemptedCount: Object.keys(newAnswers).length,
                totalQuestions: questions.length,
                currentQuestion: currentQuestion + 1
            });
        }
    };
    const handleViolation = (type) => {
        if (!isStarted || submitting) return;
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
                api.post('/api/student-auth/log-violation', { type }).then(res => {
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
        try {
            await api.post('/api/student-auth/submit-test', { 
                testId: testInfo?.id,
                answers, 
                submissionType, 
                reason 
            });
            const localKey = `answers_${studentProfile?.studentId}_${testInfo?.id}`;
            localStorage.removeItem(localKey);
            Swal.fire({
                title: 'Test Submitted!',
                text: 'Taking you to feedback...',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false,
                willClose: () => {
                    navigate('/feedback');
                }
            });
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Submission failed. Please check internet and try again.';
            Swal.fire('Submission Error', errorMsg, 'error');
            setSubmitting(false);
            saveLockRef.current = false;
        }
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
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden font-sans">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px]"></div>
            </div>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/5 backdrop-blur-3xl border border-white/10 p-8 md:p-12 rounded-[2.5rem] shadow-2xl max-w-2xl w-full text-center relative z-10"
            >
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-blue-500/20">
                    <Zap size={40} className="text-white" />
                </div>
                <h1 className="text-3xl md:text-5xl font-black text-white mb-2 tracking-tighter uppercase italic">{testInfo?.title}</h1>
                <p className="text-slate-400 text-sm font-medium mb-8 uppercase tracking-widest">AI-Secure Assessment Protocol • {testInfo?.duration} Minutes</p>
                
                <div className="bg-slate-900/80 border border-white/10 rounded-[2.5rem] p-6 md:p-10 mb-8 text-left max-h-[500px] overflow-y-auto custom-scrollbar shadow-2xl">
                    <div className="flex items-center gap-4 mb-8 border-b border-white/5 pb-6">
                        <div className="p-3 bg-blue-600/20 rounded-2xl">
                             <ShieldAlert size={24} className="text-blue-500" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-white uppercase tracking-tighter leading-none">Security Rules & Guidelines</h3>
                            <p className="text-[10px] text-slate-500 font-bold uppercase mt-2 tracking-widest italic">परीक्षा के नियम और दिशा-निर्देश</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* ENGLISH SECTION */}
                        <div className="space-y-6">
                            <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                <span className="w-6 h-[1px] bg-blue-400"></span> English Instructions
                            </p>
                            <ul className="text-[11px] text-slate-300 space-y-4 list-none font-medium leading-relaxed">
                                <li className="flex gap-3">
                                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 shrink-0"></div>
                                    <span><b>Strict Proctoring:</b> Switching tabs, minimizing windows, or taking screenshots will trigger an <b>INSTANT TERMINATION</b> warning.</span>
                                </li>
                                <li className="flex gap-3">
                                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 shrink-0"></div>
                                    <span><b>Mobile DND:</b> Turn on "Do Not Disturb" (DND) to block calls/WhatsApp. Any popup will be logged as a violation.</span>
                                </li>
                                <li className="flex gap-3">
                                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 shrink-0"></div>
                                    <span><b>No Private Mode:</b> Do NOT use Incognito/Private browser mode. It disables the auto-save recovery engine.</span>
                                </li>
                                <li className="flex gap-3">
                                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 shrink-0"></div>
                                    <span><b>Environment:</b> Ensure constant face visibility and zero background noise. AI monitors your surroundings. No second person should be in the frame.</span>
                                </li>
                                <li className="flex gap-3">
                                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 shrink-0"></div>
                                    <span><b>No External Help:</b> Using books, notes, or receiving help from any person is strictly prohibited. AI detects physical objects & gaze movement.</span>
                                </li>
                                <li className="flex gap-3">
                                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 shrink-0"></div>
                                    <span><b>Stable Connection:</b> Ensure a solid internet connection and power. The auto-save system helps, but stability is your responsibility.</span>
                                </li>
                                <li className="flex gap-3 text-emerald-400 font-bold">
                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 shrink-0"></div>
                                    <span><b>Auto-Sync:</b> Progress is saved every 15 seconds. In case of crash, log in again immediately to resume.</span>
                                </li>
                            </ul>
                        </div>

                        {/* HINDI SECTION */}
                        <div className="space-y-6 border-t md:border-t-0 md:border-l border-white/5 pt-6 md:pt-0 md:pl-10">
                            <p className="text-[10px] font-black text-orange-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                <span className="w-6 h-[1px] bg-orange-400"></span> हिंदी निर्देश
                            </p>
                            <ul className="text-[12px] text-slate-300 space-y-4 list-none font-semibold leading-relaxed">
                                <li className="flex gap-3">
                                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 shrink-0"></div>
                                    <span><b>टैब लॉगिंग:</b> टेस्ट के दौरान टैब बदलना या स्क्रीनशॉट लेना सख्त मना है। <b>3 वार्निंग</b> के बाद टेस्ट रद्द कर दिया जाएगा।</span>
                                </li>
                                <li className="flex gap-3">
                                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 shrink-0"></div>
                                    <span><b>DND मोड:</b> फोन में <b>Do Not Disturb</b> ऑन रखें। कॉल या मैसेज आने से आपका टेस्ट रुक सकता है।</span>
                                </li>
                                <li className="flex gap-3">
                                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 shrink-0"></div>
                                    <span><b>प्राइवेट ब्राउज़िंग:</b> Incognito मोड का उपयोग न करें, अन्यथा क्रैश होने पर आपका डेटा वापस नहीं आएगा।</span>
                                </li>
                                <li className="flex gap-3">
                                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 shrink-0"></div>
                                    <span><b>कैमरा और आवाज़:</b> अपना चेहरा कैमरे के सामने रखें। बैकग्राउंड में शोर या किसी दूसरे व्यक्ति के आने को चीटिंग माना जाएगा।</span>
                                </li>
                                <li className="flex gap-3 text-red-400 bg-red-400/5 p-2 rounded-xl border border-red-400/10">
                                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 shrink-0"></div>
                                    <span><b>सीट न छोड़ें:</b> टेस्ट के दौरान अपनी सीट से उठना वर्जित है। आपकी हर हलचल AI द्वारा रिकॉर्ड की जा रही है।</span>
                                </li>
                                <li className="flex gap-3 text-amber-500">
                                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 shrink-0"></div>
                                    <span><b>फाइनल सबमिशन:</b> एक बार "Finish Exam" क्लिक करने के बाद उत्तर नहीं बदल पाएंगे। अंत में सावधानी से सबमिट करें।</span>
                                </li>
                                <li className="flex gap-3 text-emerald-400">
                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 shrink-0"></div>
                                    <span><b>ऑटो-सेव:</b> आपके उत्तर हर 15 सेकंड में सुरक्षित किए जाते हैं। क्रैश होने पर तुरंत लॉग-इन करें।</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleStartTest} className="space-y-6 max-w-md mx-auto">
                    {/* Access Key Input - Conditionally Rendered */}
                    {testInfo?.hasAccessKey && (
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">SECURE ACCESS KEY</label>
                            <div className="relative">
                                <KeyRound className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={24} />
                                <input
                                    type="text"
                                    value={accessKey}
                                    onChange={(e) => setAccessKey(e.target.value)}
                                    placeholder="ENTER 6-DIGIT KEY"
                                    className="w-full bg-slate-900/80 border-2 border-white/5 rounded-[2rem] pl-16 pr-6 py-6 text-center text-3xl font-black tracking-[0.4em] text-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all uppercase placeholder:text-slate-700 placeholder:tracking-normal placeholder:font-bold placeholder:text-base"
                                    maxLength={6}
                                    autoFocus
                                />
                            </div>
                        </div>
                    )}

                    <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex items-start gap-4 text-left group cursor-pointer hover:bg-white/10 transition-all mb-4" onClick={() => setAgreed(!agreed)}>
                        <div className={`w-6 h-6 rounded-lg border-2 flex-shrink-0 flex items-center justify-center transition-all ${agreed ? 'bg-blue-600 border-blue-600' : 'border-slate-600'}`}>
                            {agreed && <Check size={16} className="text-white" />}
                        </div>
                        <p className="text-[11px] text-slate-300 font-bold leading-relaxed uppercase tracking-widest select-none">
                            I have read all terms and conditions and I am ready to start the assessment. I agree to the AI monitoring.
                        </p>
                    </div>

                    <div className="">
                        <button
                            type="submit"
                            disabled={startingTest || (testInfo?.hasAccessKey && !accessKey) || !agreed}
                            className="w-full py-6 bg-white text-slate-900 rounded-[2rem] font-black text-base uppercase tracking-[0.2em] hover:bg-blue-50 transition-all shadow-xl hover:shadow-blue-500/20 hover:-translate-y-1 active:scale-95 disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-4 group"
                        >
                            {startingTest ? (
                                <div className="w-6 h-6 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>START SECURE ASSESSMENT <ChevronRight size={22} className="group-hover:translate-x-1 transition-transform" /></>
                            )}
                        </button>
                        <p className="text-[10px] text-slate-500 mt-6 font-bold uppercase tracking-widest leading-relaxed">
                            I understand and agree to the secure environment terms. <br /> My activity is being logged for forensic review.
                        </p>
                    </div>
                </form>
            </motion.div>
        </div>
    );
    return (
        <div
            className={`min-h-screen dark-mesh text-white p-3 md:p-6 lg:p-8 font-sans select-none relative overflow-hidden ${!isFocused ? 'blur-3xl grayscale brightness-0 pointer-events-none' : ''}`}
            onContextMenu={e => e.preventDefault()}
            style={{
                WebkitUserSelect: 'none',
                WebkitTouchCallout: 'none',
                userSelect: 'none',
                msUserSelect: 'none'
            }}
        >
            {(!isOnline || syncError) && (
                <div className="fixed top-0 left-0 right-0 z-[100001] bg-red-600 px-6 py-2.5 flex items-center justify-between text-white shadow-lg animate-in slide-in-from-top duration-500">
                    <div className="flex items-center gap-4">
                        <div className="w-2.5 h-2.5 bg-white rounded-full animate-ping"></div>
                        <span className="font-black text-[11px] uppercase tracking-[0.2em] italic">Internet / Sync Problem Detected</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <span className="text-[10px] font-bold text-white/90 uppercase tracking-widest hidden md:block">Saving to local cache...</span>
                        <button 
                            onClick={() => syncProgress(answers, timeLeft)}
                            className="bg-white text-red-600 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-neutral-100 transition-all shadow-lg active:scale-95"
                        >
                            Retry Sync Now
                        </button>
                    </div>
                </div>
            )}
            {screenshotFlash && (
                <div className="fixed inset-0 z-[1000000] bg-black flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-white text-7xl font-black uppercase italic tracking-tighter mb-4">CAPTURE BLOCKED</h1>
                        <p className="text-red-500 text-2xl font-black uppercase tracking-[0.3em]">CRITICAL VIOLATION LOGGED</p>
                    </div>
                </div>
            )}
            {!isFocused && (
                <div className="fixed inset-0 z-[99999] bg-black flex flex-col items-center justify-center text-center p-6">
                    <div className="w-24 h-24 bg-red-600/20 rounded-full flex items-center justify-center mb-8 border-4 border-red-600/50 animate-pulse">
                        <Lock size={48} className="text-red-600" />
                    </div>
                    <h2 className="text-4xl font-black text-white mb-4 uppercase tracking-[0.2em]">ACCESS RESTRICTED</h2>
                    <p className="text-red-500 text-lg max-w-md font-black uppercase italic animate-bounce">
                        SCREEN CAPTURE / FOCUS LOSS DETECTED
                    </p>
                    <div className="mt-8 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl">
                         <p className="text-slate-400 text-xs font-bold uppercase tracking-widest leading-loose">
                            CONTENT AUTOMATICALLY BLACKED OUT <br />
                            VIOLATION HAS BEEN LOGGED TO THE SERVER
                        </p>
                    </div>
                </div>
            )}
            <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
            <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>
            {studentProfile && (
                <>
                    <div className="fixed inset-0 pointer-events-none z-[50] overflow-hidden select-none opacity-[0.07]">
                        <motion.div 
                            animate={{ 
                                x: [0, -20, 0, 20, 0],
                                y: [0, 20, 0, -20, 0]
                            }}
                            transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
                            className="absolute inset-[-10%] flex flex-wrap content-start gap-y-16 gap-x-12 p-4"
                        >
                            {Array.from({ length: 60 }).map((_, i) => (
                                <div key={i} className="transform -rotate-[25deg] whitespace-nowrap select-none font-black text-[14px] uppercase tracking-widest text-white">
                                    {studentProfile.studentId} • {studentProfile.fullName}
                                </div>
                            ))}
                        </motion.div>
                    </div>
                    <motion.div 
                        animate={{ 
                            top: ['5%', '85%', '85%', '5%', '5%'],
                            left: ['5%', '5%', '85%', '85%', '5%']
                        }}
                        transition={{ repeat: Infinity, duration: 40, ease: "easeInOut" }}
                        className="fixed z-[9500] pointer-events-none"
                    >
                        <div className="flex items-center gap-2 bg-red-600/60 backdrop-blur-md border border-red-400/50 px-3 py-1.5 rounded-full shadow-xl">
                            <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></div>
                            <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">
                                ID: {studentProfile.studentId}
                            </span>
                        </div>
                    </motion.div>
                </>
            )}
            {isStarted && !submitting && !isOutOfSync && (
                <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 w-24 h-32 md:w-36 md:h-48 bg-slate-900 rounded-2xl border-4 border-green-500/30 overflow-hidden shadow-[0_0_30px_rgba(34,197,94,0.2)] z-[9000] pointer-events-none group">
                    <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover transform -scale-x-100 opacity-90"></video>
                    <div className="absolute inset-0 bg-gradient-to-t from-green-500/20 to-transparent mix-blend-overlay"></div>
                    <div className="absolute top-2 left-2 right-2 flex justify-between items-start">
                        <div className={`flex items-center gap-1.5 backdrop-blur-md px-2 py-1 rounded-full z-20 shadow-sm border ${syncError ? 'bg-red-600/50 border-white/20' : 'bg-black/70 border-white/10'}`}>
                             <div className={`w-1 h-1 rounded-full ${syncError ? 'bg-red-400 animate-pulse' : 'bg-emerald-400 animate-pulse'}`}></div>
                             <span className={`text-[6px] font-black uppercase tracking-widest ${syncError ? 'text-red-100' : 'text-emerald-400'}`}>
                                 {syncError ? 'SYNC FAIL' : 'CLOUD ON'}
                             </span>
                        </div>
                        <div className={`flex items-center gap-1.5 backdrop-blur-md px-2 py-1 rounded-full z-20 shadow-sm border ${noiseViolation ? 'bg-red-600/80 border-white animate-bounce' : 'bg-black/70 border-white/10'}`}>
                            {noiseViolation ? (
                                <div className="flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></div>
                                    <span className="text-[7px] font-black text-white uppercase tracking-widest leading-none">Noise Caught</span>
                                </div>
                            ) : (
                                <>
                                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.9)]"></div>
                                    <span className="text-[7px] font-black text-green-400 uppercase tracking-widest leading-none">AI Proctor</span>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="absolute bottom-2 left-2 right-2 h-1 bg-white/10 rounded-full overflow-hidden">
                         <div className={`h-full bg-green-500 transition-all duration-100 ${noiseViolation ? 'bg-red-500' : ''}`} style={{ width: '60%' }}></div>
                    </div>
                    <div className="absolute top-0 w-full h-1 bg-green-400/50 shadow-[0_0_15px_rgba(74,222,128,1)] animate-[pulse_2s_ease-in-out_infinite]" style={{ transform: 'translateY(50px)' }}></div>
                </div>
            )}
            <AnimatePresence>
                {isOutOfSync && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 z-[99999] bg-[#000] flex flex-col items-center justify-center p-8 text-center"
                    >
                        <div className="absolute inset-0 bg-red-600/10 animate-pulse pointer-events-none"></div>
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ repeat: Infinity, duration: 1 }}
                            className="w-32 h-32 bg-red-600 text-white rounded-[3rem] flex items-center justify-center mb-10 shadow-[0_0_80px_rgba(239,68,68,0.6)] border-4 border-white/20"
                        >
                            <Lock size={60} />
                        </motion.div>
                        <h2 className="text-5xl md:text-6xl font-black tracking-tighter italic uppercase mb-2 text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                            Security Alert
                        </h2>
                        <div className="h-1.5 w-32 bg-red-600 mb-8 rounded-full mx-auto shadow-[0_0_20px_rgba(239,68,68,0.5)]"></div>
                        <div className="space-y-4 mb-12">
                            <p className="text-white text-xl font-bold uppercase tracking-widest leading-relaxed">
                                PROCTORING VIOLATION RECORDED
                            </p>
                            <div className="px-6 py-3 bg-red-600/10 border border-red-500/20 rounded-2xl">
                                <p className="text-red-400 font-black text-2xl uppercase">
                                    Warning {violationCount} / 3
                                </p>
                            </div>
                            <p className="text-slate-500 max-w-lg mx-auto font-medium text-xs uppercase tracking-widest leading-loose">
                                Your ID <b>{studentProfile?.studentId}</b> has been flagged. <br />
                                Activity logged: Switching apps, screenshots, or exiting fullscreen is prohibited. <br />
                                One more violation may terminate your examination permanently.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={enterFullScreen}
                            className="group relative bg-white text-black px-16 py-6 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-2xl active:scale-95 overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center gap-3">
                                Re-Enter Secure Environment <ChevronRight size={20} />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-500 translate-y-full group-hover:translate-y-0 transition-transform"></div>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className={`max-w-7xl mx-auto flex flex-col gap-6 h-full min-h-[92vh] transition-all duration-700 ${isOutOfSync ? 'blur-2xl scale-95 opacity-30 grayscale' : ''}`}>

                {/* Global Notification Hub */}
                <AnimatePresence mode="wait">
                    {broadcastMessage && (
                        <motion.div
                            initial={{ height: 0, opacity: 0, y: -20 }}
                            animate={{ height: 'auto', opacity: 1, y: 0 }}
                            exit={{ height: 0, opacity: 0, y: -20 }}
                            className="w-full relative z-[100]"
                        >
                            <div className="bg-blue-600 border border-blue-400/50 rounded-2xl p-5 flex items-center gap-6 shadow-[0_10px_40px_rgba(37,99,235,0.3)]">
                                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 animate-bounce">
                                    <Megaphone size={20} className="text-white" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-100 mb-1">Message from Admin</h4>
                                    <p className="text-base font-bold text-white leading-tight">{broadcastMessage.message}</p>
                                </div>
                                <button type="button" onClick={() => setBroadcastMessage(null)} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all">
                                    <X size={20} className="text-white" />
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Header */}
                <header className="flex flex-col md:flex-row justify-between items-stretch bg-white/5 p-3 sm:p-5 md:p-6 lg:p-7 rounded-[2rem] md:rounded-[2.5rem] border border-white/10 shadow-2xl glass-dark gap-4 md:gap-6 relative overflow-hidden premium-border">
                    <div className="flex items-center gap-6 relative z-10">
                        <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-800 rounded-2xl md:rounded-[1.5rem] flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.3)] shrink-0 border border-white/20">
                            <Zap size={28} className="text-white" />
                        </div>
                        <div className="min-w-0">
                            <div className="flex items-center gap-3 mb-1">
                                <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest border transition-all ${isOnline ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20' : 'bg-red-500/20 text-red-400 border-red-500/20'}`}>
                                    {isOnline ? 'Online' : 'Offline'}
                                </span>
                                <span className={`px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-400 text-[8px] font-black uppercase tracking-widest border border-blue-500/20 transition-opacity ${isSyncing ? 'opacity-100' : 'opacity-0'}`}>
                                    Syncing...
                                </span>
                            </div>
                            <h2 className="font-black text-lg md:text-2xl lg:text-3xl tracking-tighter text-white leading-none truncate italic uppercase">{testInfo?.title}</h2>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 md:gap-8 bg-black/40 p-2 pr-4 md:pr-8 rounded-[2rem] border border-white/5">
                        <div className="hidden sm:flex flex-col items-end border-r border-white/10 pr-6">
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Completion</span>
                            <div className="flex items-center gap-2">
                                <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-600 transition-all duration-1000"
                                        style={{ width: `${(Object.keys(answers).length / questions.length) * 100}%` }}
                                    ></div>
                                </div>
                                <span className="text-xs font-black text-blue-400">{Math.round((Object.keys(answers).length / questions.length) * 100)}%</span>
                            </div>
                        </div>
                        <div className={`p-1 flex flex-col items-center justify-center min-w-[100px] md:min-w-[150px]`}>
                            <span className="text-[8px] md:text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Time Left</span>
                            <div className={`text-xl md:text-4xl font-black font-mono transition-all tabular-nums text-glow ${timeLeft < 300 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                                {mins}<span className="opacity-30 mx-1">:</span>{String(secs).padStart(2, '0')}
                            </div>
                        </div>
                    </div>
                </header>

                <div className="grid lg:grid-cols-4 gap-8 flex-1 items-start">
                    {/* Navigator - Redesigned Sidebar */}
                    <aside className="hidden lg:flex flex-col bg-white/5 p-7 rounded-[3rem] border border-white/10 h-[calc(100vh-240px)] sticky top-8 glass-dark">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-1">Questions</h3>
                                <p className="text-xs font-bold text-white uppercase italic">Question Map</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400">
                                <Target size={20} />
                            </div>
                        </div>

                        <div className="grid grid-cols-4 gap-3 overflow-y-auto pr-4 custom-scrollbar flex-1 content-start py-2">
                            {questions.map((_, i) => {
                                const isAnswered = !!answers[questions[i]._id];
                                const isActive = currentQuestion === i;
                                return (
                                    <button
                                        type="button"
                                        key={i}
                                        disabled={submitting || timeLeft <= 0}
                                        onClick={() => setCurrentQuestion(i)}
                                        className={`aspect-square rounded-2xl text-[11px] font-black transition-all flex items-center justify-center border-2 ${isActive
                                            ? 'bg-blue-600 border-white/30 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] scale-110 z-10'
                                            : isAnswered
                                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                                : 'bg-white/5 border-transparent text-slate-600 hover:border-white/20 hover:text-white'
                                            }`}
                                    >
                                        {i + 1}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="mt-8 pt-6 border-t border-white/10 space-y-3">
                            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest opacity-40">
                                <span>Answered</span>
                                <span className="text-emerald-400">{Object.keys(answers).length}</span>
                            </div>
                            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest opacity-40">
                                <span>Remaining</span>
                                <span className="text-blue-400">{questions.length - Object.keys(answers).length}</span>
                            </div>
                        </div>
                    </aside>

                    {/* Question Hub */}
                    <main className="lg:col-span-3 flex flex-col gap-8">
                        <motion.div
                            key={currentQuestion}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white/5 p-6 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] border border-white/10 flex-1 relative overflow-hidden min-h-[400px] md:min-h-[480px] glass-dark shadow-2xl"
                        >
                            {/* Decorative glow inside card */}
                            <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none"></div>

                            <div className="relative z-10 h-full flex flex-col">
                                <div className="flex items-center gap-4 mb-10">
                                    <span className="w-12 h-1 bg-blue-600 rounded-full"></span>
                                    <span className="text-xs font-black text-blue-400 uppercase tracking-[0.3em]">Question {currentQuestion + 1} of {questions.length}</span>
                                </div>

                                <h3 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-black mb-8 lg:mb-16 leading-[1.2] text-white tracking-tight">
                                    {questions[currentQuestion]?.questionText}
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-auto">
                                    {questions[currentQuestion]?.options.map((opt, i) => {
                                        const isSelected = answers[questions[currentQuestion]._id] === opt;
                                        return (
                                            <button
                                                type="button"
                                                key={i}
                                                disabled={submitting || timeLeft <= 0}
                                                onClick={() => handleAnswerSelect(questions[currentQuestion]._id, opt)}
                                                className={`group relative text-left p-5 sm:p-6 rounded-[2rem] border-2 transition-all flex items-center gap-5 disabled:opacity-50 disabled:cursor-not-allowed group shadow-sm ${isSelected
                                                    ? 'border-blue-500 bg-blue-600/20 shadow-[0_0_40px_rgba(37,99,235,0.15)]'
                                                    : 'border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10'
                                                    }`}
                                            >
                                                {isSelected && (
                                                    <motion.div layoutId="selection" className="absolute inset-0 bg-blue-600/10 rounded-[2rem] pointer-events-none" />
                                                )}
                                                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center font-black text-lg transition-all shrink-0 ${isSelected
                                                    ? 'bg-blue-600 text-white shadow-lg'
                                                    : 'bg-white/10 text-slate-600 group-hover:bg-white/20 group-hover:text-white'
                                                    }`}>
                                                    {String.fromCharCode(65 + i)}
                                                </div>
                                                <span className={`font-bold text-base sm:text-lg md:text-xl transition-colors leading-snug flex-1 ${isSelected ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                                                    }`}>
                                                    {opt}
                                                </span>
                                                {isSelected && (
                                                    <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,1)]"></div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </motion.div>

                        {/* Control Interface */}
                        <div className="flex flex-col sm:flex-row justify-between items-center p-3 bg-white/5 rounded-[2.5rem] border border-white/10 glass-dark backdrop-blur-3xl gap-4 shadow-2xl">
                            <div className="flex gap-4 w-full sm:w-auto">
                                <button
                                    type="button"
                                    disabled={submitting || timeLeft <= 0 || currentQuestion === 0}
                                    onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                                    className="px-6 py-5 rounded-2xl text-slate-500 font-black hover:text-white hover:bg-white/5 transition-all disabled:opacity-5 disabled:cursor-not-allowed text-[10px] uppercase tracking-[0.2em] italic"
                                >
                                    [ Back ]
                                </button>
                            </div>

                            <div className="hidden sm:flex gap-2">
                                {Array.from({ length: Math.min(5, questions.length) }).map((_, idx) => (
                                    <div key={idx} className={`w-1.5 h-1.5 rounded-full ${idx === currentQuestion % 5 ? 'bg-blue-600 scale-125' : 'bg-white/10'}`}></div>
                                ))}
                            </div>

                            {currentQuestion === questions.length - 1 ?
                                <button
                                    type="button"
                                    disabled={submitting}
                                    onClick={() => handleSubmitTest(false, 'normal', 'Manual Submit')}
                                    className="w-full sm:w-auto bg-emerald-600 px-12 py-5 rounded-2xl font-black text-xs uppercase italic tracking-[0.2em] shadow-[0_0_40px_rgba(16,185,129,0.3)] hover:bg-emerald-500 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-white flex items-center justify-center gap-3"
                                >
                                    {submitting ? 'Saving...' : 'Finish Exam'} <ChevronRight size={18} />
                                </button> :
                                <button
                                    type="button"
                                    disabled={submitting || timeLeft <= 0}
                                    onClick={() => setCurrentQuestion(currentQuestion + 1)}
                                    className="w-full sm:w-auto bg-blue-600 px-12 py-5 rounded-2xl font-black text-xs uppercase italic tracking-[0.2em] shadow-[0_0_40px_rgba(37,99,235,0.3)] hover:bg-blue-500 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center gap-3 text-white"
                                >
                                    Next Question <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            }
                        </div>
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
