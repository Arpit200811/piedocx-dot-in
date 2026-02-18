import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Zap, BookOpen, CheckCircle, Target, ChevronRight, KeyRound, Megaphone, X } from 'lucide-react';
import Swal from 'sweetalert2';
import api from '../../utils/api';

const TestInterface = () => {
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(0);
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
    const [studentProfile, setStudentProfile] = useState(null);

    const [statusMessage, setStatusMessage] = useState(null);
    const [broadcastMessage, setBroadcastMessage] = useState(null);
    const timerRef = useRef(null);
    const saveLockRef = useRef(false); // Concurrency Lock for Safari/Rapid Clicks

    // 1. Initial Fetch (Profile & Test Info)
    useEffect(() => {
        const fetchInitialData = async () => {
            const token = localStorage.getItem('studentToken');
            if (!token) {
                navigate('/student-login');
                return;
            }

            try {
                // Fetch Profile & Test Info in Parallel for performance
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
                console.error("Initialization Failed", err);
                const status = err.response?.status;
                if (status === 403 || status === 404) {
                    navigate('/student-dashboard');
                }
            }
        };

        fetchInitialData();
    }, [navigate]);


    // 2. Start Test Function
    const handleStartTest = async (e) => {
        e.preventDefault();

        // Input Validation
        if (testInfo?.hasAccessKey && !accessKey.trim()) {
            Swal.fire('Key Required', 'Please enter the access key to start.', 'warning');
            return;
        }

        // Fullscreen Gesture (Must be first)
        enterFullScreen();
        setStartingTest(true);

        try {
            // Fetch Questions - Bind to specific Test ID for security key integrity
            const qData = await api.post('/api/student-auth/questions', {
                accessKey: accessKey,
                testId: testInfo._id
            });

            setQuestions(qData.questions);
            setAnswers(qData.savedAnswers || {});

            if (typeof qData.remainingSeconds === 'number') {
                setTimeLeft(qData.remainingSeconds);
            } else {
                const elapsed = qData.elapsedTime || 0;
                const totalDuration = qData.duration * 60;
                setTimeLeft(Math.max(0, totalDuration - elapsed));
            }

            setIsStarted(true);
            setStartingTest(false);

        } catch (err) {
            setStartingTest(false);
            console.error("❌ START TEST FAILED:", err);
            console.error("Response:", err.response);

            if (err.response?.status === 401 && err.response.data.requiresKey) {
                Swal.fire('Wrong Key', 'Incorrect key. Please try again.', 'error');
            } else if (err.response?.status === 403) {
                Swal.fire('Access Denied', err.response.data.message, 'error');
            } else {
                Swal.fire('Error', 'Could not start test. Check console for details.', 'error');
            }
        }
    };





    const socketRef = useRef(null);

    useEffect(() => {
        if (isStarted && !socketRef.current && testInfo) {
            const token = localStorage.getItem('studentToken');
            // Use URL constructor for safer parsing
            let socketUrl = base_url;
            try {
                const url = new URL(base_url);
                socketUrl = url.origin;
            } catch (e) {
                socketUrl = base_url.replace('/api', '');
            }

            const newSocket = io(socketUrl, {
                auth: { token },
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000
            });

            newSocket.on('connect', () => {
                console.log("🔌 Socket Connected");
                newSocket.emit('join_exam', {
                    testId: testInfo._id,
                    deviceInfo: {
                        userAgent: navigator.userAgent,
                        resolution: `${window.screen.width}x${window.screen.height}`
                    }
                });
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

    // Heartbeat
    useEffect(() => {
        const interval = setInterval(() => {
            if (socketRef.current) {
                socketRef.current.emit('heartbeat', { timeLeft });
            }
        }, 15000);
        return () => clearInterval(interval);
    }, [timeLeft]);

    // Focus State for CSS Blur Protection
    const [isFocused, setIsFocused] = useState(true);

    // 3. Anti-Cheat & Security Logic (Active only when started)
    useEffect(() => {
        if (!isStarted || submitting) return;

        const handleVisibilityChange = () => {
            if (document.hidden) {
                handleViolation("Tab Switch / Hidden");
                setIsFocused(false);
            } else {
                setIsFocused(true);
            }
        };

        const handleBlur = () => {
            setIsFocused(false);
            handleViolation("Focus Lost / App Switch");
        };

        const handleFocus = () => {
            setIsFocused(true);
        };

        const handleFullScreenChange = () => {
            if (!document.fullscreenElement) {
                handleViolation("Exited Full Screen");
            }
        };

        const handlePageHide = () => {
            handleViolation("Page Hidden/Suspended");
        };

        const handleResize = () => {
            // Significant resize usually happens during split-screen or keyboard/screenshot editor launch
            if (window.innerWidth < 300 || window.innerHeight < 300) {
                handleViolation("Window Minimized / Resize Detected");
            }
        };

        const preventCopyPaste = (e) => {
            e.preventDefault();
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'warning',
                title: 'Action Prohibited',
                showConfirmButton: false,
                timer: 1500
            });
            handleViolation("Copy/Paste Attempt");
        };

        const blockKeys = (e) => {
            // Block F12
            if (e.keyCode === 123) {
                e.preventDefault();
                handleViolation("Attempted to open DevTools (F12)");
                return false;
            }
            // Block Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
            if (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) {
                e.preventDefault();
                handleViolation("Attempted to open DevTools (Shortcut)");
                return false;
            }
            // Block Ctrl+U (View Source)
            if (e.ctrlKey && e.keyCode === 85) {
                e.preventDefault();
                handleViolation("Attempted to View Source");
                return false;
            }
        };

        // DevTools detection trick
        let devtoolsOpen = false;
        const threshold = 160;
        const checkDevTools = () => {
            if (window.outerWidth - window.innerWidth > threshold ||
                window.outerHeight - window.innerHeight > threshold) {
                if (!devtoolsOpen) {
                    handleViolation("Developer Tools Detected");
                    devtoolsOpen = true;
                }
            } else {
                devtoolsOpen = false;
            }
        };

        const handleOrientationChange = () => {
            handleViolation("Orientation Change Detected (Mobile Security)");
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'info',
                title: 'Keep device stable',
                showConfirmButton: false,
                timer: 2000
            });
        };

        const handleTouchStart = (e) => {
            if (e.touches && e.touches.length > 2) {
                handleViolation("Multi-touch / Screenshot Gesture Detected");
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'error',
                    title: 'Multi-finger gestures blocked',
                    showConfirmButton: false,
                    timer: 2000
                });
            }
        };

        const dtInterval = setInterval(checkDevTools, 1000);

        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("blur", handleBlur);
        window.addEventListener("focus", handleFocus);
        window.addEventListener("pagehide", handlePageHide);
        window.addEventListener("resize", handleResize);
        window.addEventListener("touchstart", handleTouchStart, { passive: false });
        window.addEventListener("orientationchange", handleOrientationChange);
        document.addEventListener("fullscreenchange", handleFullScreenChange);
        document.addEventListener("copy", preventCopyPaste);
        document.addEventListener("cut", preventCopyPaste);
        document.addEventListener("paste", preventCopyPaste);
        document.addEventListener("keydown", blockKeys);
        document.addEventListener("contextmenu", (e) => e.preventDefault());

        return () => {
            clearInterval(dtInterval);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("blur", handleBlur);
            window.removeEventListener("focus", handleFocus);
            window.removeEventListener("pagehide", handlePageHide);
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("touchstart", handleTouchStart);
            window.removeEventListener("orientationchange", handleOrientationChange);
            document.removeEventListener("fullscreenchange", handleFullScreenChange);
            document.removeEventListener("copy", preventCopyPaste);
            document.removeEventListener("cut", preventCopyPaste);
            document.removeEventListener("paste", preventCopyPaste);
            document.removeEventListener("keydown", blockKeys);
            document.removeEventListener("contextmenu", (e) => e.preventDefault());
        };
    }, [isStarted, submitting, navigate]);


    // 4. Manual Progress Sync (Triggered only by Button)
    const syncProgress = async (currentAnswers, currentTimer) => {
        if (saveLockRef.current) return;
        saveLockRef.current = true;

        try {
            await api.post('/api/student-auth/sync-progress', {
                answers: currentAnswers,
                timeLeft: currentTimer
            });

            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'Progress Saved',
                showConfirmButton: false,
                timer: 1500
            });
        } catch (err) {
            console.error("Sync failed", err);
        } finally {
            saveLockRef.current = false;
        }
    };

    // 4. Timer Logic Only
    useEffect(() => {
        if (!isStarted || submitting || timeLeft <= 0) return;

        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    handleSubmitTest(true); // Auto submit
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timerRef.current);
    }, [isStarted, submitting, timeLeft]);

    // 5. Answer Selection with Real-time Sync
    const handleAnswerSelect = (questionId, option) => {
        const newAnswers = { ...answers, [questionId]: option };
        setAnswers(newAnswers);

        // REMOVED: Immediate syncProgress call. 
        // This was causing excessive API calls and "auto-save" behavior.

        // Emit via Socket for Real-time Admin Monitor (Low overhead)
        if (socketRef.current) {
            socketRef.current.emit('progress_update', {
                attemptedCount: Object.keys(newAnswers).length,
                totalQuestions: questions.length,
                currentQuestion: currentQuestion + 1
            });
        }
    };


    // 6. Utility Functions
    const handleViolation = (type) => {
        if (!isStarted || submitting) return;

        setViolationCount(prev => prev + 1);
        setIsOutOfSync(true);

        // Socket Report
        reportViolationSocket(type);

        const token = localStorage.getItem('studentToken');
        if (token) {
            api.post('/api/student-auth/log-violation', { type }).then(res => {
                if (res.shouldTerminate) {
                    Swal.fire({
                        title: 'Test Terminated',
                        text: 'Multiple violations detected. Your test is being auto-submitted.',
                        icon: 'error',
                        timer: 3000,
                        showConfirmButton: false
                    }).then(() => {
                        handleSubmitTest(true);
                    });
                }
            }).catch(err => console.error("Logged violation locally"));
        }
    };

    // Auto-submit on load if time is up
    useEffect(() => {
        if (isStarted && !submitting && timeLeft === 0) {
            console.log("Time expired on load. Auto-submitting...");
            handleSubmitTest(true);
        }
    }, [isStarted, timeLeft]);

    const enterFullScreen = () => {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
            elem.requestFullscreen().catch(err => console.log(err));
        }
        setIsOutOfSync(false);
    };

    const handleSubmitTest = async (autoSubmit = false) => {
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
            await api.post('/api/student-auth/submit-test', { answers });

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


    // --- RENDER ---

    // 1. Initial Loading
    if (initialLoading) return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-blue-400 font-bold tracking-widest uppercase text-xs animate-pulse">Establishing Connection...</p>
            </div>
        </div>
    );

    // 2. Start Screen (Unified Gate)
    if (!isStarted) return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden font-sans">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px]"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-[2.5rem] shadow-2xl max-w-lg w-full text-center relative z-10"
            >
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-blue-500/20">
                    <Zap size={40} className="text-white" />
                </div>

                <h1 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tighter uppercase italic">{testInfo?.title}</h1>
                <p className="text-slate-400 text-sm font-medium mb-8">Secure Test Environment • {testInfo?.duration} Minutes</p>

                <form onSubmit={handleStartTest} className="space-y-6">
                    {/* Access Key Input - Conditionally Rendered */}
                    {testInfo?.hasAccessKey && (
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Access Key</label>
                            <div className="relative">
                                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type="text"
                                    value={accessKey}
                                    onChange={(e) => setAccessKey(e.target.value)}
                                    placeholder="ENTER 6-DIGIT KEY"
                                    className="w-full bg-slate-900/50 border-2 border-slate-700/50 rounded-2xl pl-12 pr-4 py-4 text-center text-xl font-bold tracking-[0.2em] text-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all uppercase placeholder:text-slate-600 placeholder:tracking-normal"
                                    maxLength={6}
                                    autoFocus
                                />
                            </div>
                        </div>
                    )}

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={startingTest || (testInfo?.hasAccessKey && !accessKey)}
                            className="w-full py-5 bg-white text-slate-900 rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-blue-50 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
                        >
                            {startingTest ? (
                                <>Loading...</>
                            ) : (
                                <>Start Test <ChevronRight size={18} /></>
                            )}
                        </button>
                        <p className="text-[10px] text-slate-500 mt-4 font-medium">
                            By clicking start, you agree to enter full-screen mode. <br /> Exiting full-screen will be recorded as a violation.
                        </p>
                    </div>
                </form>
            </motion.div>
        </div>
    );

    // 3. Main Test Interface (When Started)
    return (
        <div
            className={`min-h-screen dark-mesh text-white p-3 md:p-6 lg:p-8 font-sans select-none relative overflow-hidden transition-all duration-300 ${!isFocused ? 'blur-2xl grayscale brightness-50 pointer-events-none' : ''}`}
            onContextMenu={e => e.preventDefault()}
            style={{
                WebkitUserSelect: 'none',
                WebkitTouchCallout: 'none',
                userSelect: 'none',
                msUserSelect: 'none'
            }}
        >
            {/* Security Shield Overlay (Mobile Screenshot/Blur Protection) */}
            {!isFocused && (
                <div className="fixed inset-0 z-[99999] bg-slate-900/80 backdrop-blur-3xl flex flex-col items-center justify-center text-center p-6 animate-in fade-in zoom-in duration-300">
                    <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mb-6 border border-red-500/50">
                        <Lock size={40} className="text-red-500" />
                    </div>
                    <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">Security Shield Active</h2>
                    <p className="text-slate-400 text-sm max-w-xs font-medium">Test content is hidden because focus was lost. Return to the app immediately to resume.</p>
                </div>
            )}

            {/* Ambient background glows */}
            <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
            <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>

            {/* Watermark Overlay */}
            {studentProfile && (
                <div className="fixed inset-0 pointer-events-none z-[50] opacity-[0.02] flex flex-wrap content-center justify-center gap-24 overflow-hidden select-none">
                    {Array.from({ length: 24 }).map((_, i) => (
                        <div key={i} className="transform -rotate-45 text-2xl font-black text-white whitespace-nowrap tracking-widest uppercase">
                            {studentProfile.studentId} • {studentProfile.email}
                        </div>
                    ))}
                </div>
            )}

            <AnimatePresence>
                {/* Security Lockdown Modal */}
                {isOutOfSync && (
                    <motion.div
                        initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                        animate={{ opacity: 1, backdropFilter: 'blur(20px)' }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] bg-[#030712]/90 flex flex-col items-center justify-center p-8 text-center"
                    >
                        <motion.div
                            initial={{ scale: 0.8, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="w-24 h-24 bg-red-600/20 text-red-500 rounded-[2.5rem] flex items-center justify-center mb-8 border border-red-500/30 shadow-[0_0_50px_rgba(239,68,68,0.3)] animate-float"
                        >
                            <Lock size={48} />
                        </motion.div>
                        <h2 className="text-4xl font-black tracking-tighter italic uppercase mb-2 text-white">Security Alert</h2>
                        <div className="h-1 w-20 bg-red-600 mb-6 rounded-full mx-auto"></div>
                        <p className="text-slate-400 max-w-md font-medium leading-relaxed mb-10">
                            Strict proctoring is active. Switching tabs or minimizing is prohibited.
                            <br /><span className="text-red-400 font-bold block mt-4 text-xl">Warning {violationCount} / 3</span>
                        </p>
                        <button
                            type="button"
                            onClick={enterFullScreen}
                            className="bg-blue-600 text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-500 transition-all shadow-[0_0_30px_rgba(37,99,235,0.4)] active:scale-95"
                        >
                            Resume Assessment
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
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-100 mb-1">Official Test Broadcast</h4>
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
                <header className="flex flex-col md:flex-row justify-between items-stretch bg-white/5 p-4 sm:p-5 md:p-6 lg:p-7 rounded-[2.5rem] border border-white/10 shadow-2xl glass-dark gap-6 relative overflow-hidden premium-border">
                    <div className="flex items-center gap-6 relative z-10">
                        <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-800 rounded-2xl md:rounded-[1.5rem] flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.3)] shrink-0 border border-white/20">
                            <Zap size={28} className="text-white" />
                        </div>
                        <div className="min-w-0">
                            <div className="flex items-center gap-3 mb-1">
                                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[8px] font-black uppercase tracking-widest border border-emerald-500/20">Live Secure</span>
                                <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-400 text-[8px] font-black uppercase tracking-widest border border-blue-500/20">Syncing...</span>
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
                        <div className={`p-1 flex flex-col items-center justify-center min-w-[120px] md:min-w-[150px]`}>
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Ends In</span>
                            <div className={`text-2xl md:text-4xl font-black font-mono transition-all tabular-nums text-glow ${timeLeft < 300 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
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
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-1">The Board</h3>
                                <p className="text-xs font-bold text-white uppercase italic">Assessment Map</p>
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
                            className="bg-white/5 p-8 md:p-12 rounded-[3.5rem] border border-white/10 flex-1 relative overflow-hidden min-h-[480px] glass-dark shadow-2xl"
                        >
                            {/* Decorative glow inside card */}
                            <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none"></div>

                            <div className="relative z-10 h-full flex flex-col">
                                <div className="flex items-center gap-4 mb-10">
                                    <span className="w-12 h-1 bg-blue-600 rounded-full"></span>
                                    <span className="text-xs font-black text-blue-400 uppercase tracking-[0.3em]">Sector {currentQuestion + 1} of {questions.length}</span>
                                </div>

                                <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black mb-12 lg:mb-16 leading-[1.2] text-white tracking-tight">
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

                                <button
                                    type="button"
                                    disabled={submitting || timeLeft <= 0}
                                    onClick={() => syncProgress(answers, timeLeft)}
                                    className="px-6 py-5 rounded-2xl text-blue-400 font-black border border-blue-500/30 hover:bg-blue-500/10 transition-all text-[10px] uppercase tracking-[0.2em]"
                                >
                                    Save Progress
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
                                    onClick={() => handleSubmitTest(false)}
                                    className="w-full sm:w-auto bg-emerald-600 px-12 py-5 rounded-2xl font-black text-xs uppercase italic tracking-[0.2em] shadow-[0_0_40px_rgba(16,185,129,0.3)] hover:bg-emerald-500 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-white flex items-center justify-center gap-3"
                                >
                                    {submitting ? 'Encrypting...' : 'Final Submission'} <ChevronRight size={18} />
                                </button> :
                                <button
                                    type="button"
                                    disabled={submitting || timeLeft <= 0}
                                    onClick={() => setCurrentQuestion(currentQuestion + 1)}
                                    className="w-full sm:w-auto bg-blue-600 px-12 py-5 rounded-2xl font-black text-xs uppercase italic tracking-[0.2em] shadow-[0_0_40px_rgba(37,99,235,0.3)] hover:bg-blue-500 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center gap-3 text-white"
                                >
                                    Proceed Next <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
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
