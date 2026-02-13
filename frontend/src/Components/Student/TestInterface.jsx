import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Zap, BookOpen, CheckCircle, Target, ChevronRight, KeyRound } from 'lucide-react';
import Swal from 'sweetalert2';
import { base_url } from '../../utils/info';

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
    
    const timerRef = useRef(null);

    // 1. Initial Fetch (Profile & Test Info)
    useEffect(() => {
        const fetchInitialData = async () => {
            const token = localStorage.getItem('studentToken');
            if (!token) {
                navigate('/student-login');
                return;
            }

            try {
                // Fetch Profile
                const profileRes = await axios.get(`${base_url}/api/student-auth/profile`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStudentProfile(profileRes.data);

                // Fetch Test Info
                const infoRes = await axios.get(`${base_url}/api/student-auth/test-info`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                if (!infoRes.data) {
                    Swal.fire('Error', 'No active test found.', 'error').then(() => navigate('/student-dashboard'));
                    return;
                }
                setTestInfo(infoRes.data);
                
                // We DO NOT fetch questions here. We wait for user to start.
                setInitialLoading(false);

            } catch (err) {
                console.error(err);
                if (err.response?.status === 403) {
                     Swal.fire('Access Denied', err.response.data.message, 'warning').then(() => navigate('/student-dashboard'));
                } else {
                     Swal.fire('Error', 'Could not load test info. Please try again.', 'error').then(() => navigate('/student-dashboard'));
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
            const token = localStorage.getItem('studentToken');
            
            // Fetch Questions
            const qRes = await axios.post(`${base_url}/api/student-auth/questions`, { accessKey: accessKey }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Success
            setQuestions(qRes.data.questions);
            setAnswers(qRes.data.savedAnswers || {});
            
            // Timer Calculation
            // Backend provides 'remainingSeconds' directly based on testEndTime
            if (typeof qRes.data.remainingSeconds === 'number') {
                setTimeLeft(qRes.data.remainingSeconds);
            } else {
                // Fallback for safety
                const elapsed = qRes.data.elapsedTime || 0;
                const totalDuration = qRes.data.duration * 60;
                setTimeLeft(Math.max(0, totalDuration - elapsed));
            }
            
            setIsStarted(true);
            setStartingTest(false);

        } catch (err) {
            setStartingTest(false);
            console.error(err);
            if (err.response?.status === 401 && err.response.data.requiresKey) {
                Swal.fire('Wrong Key', 'Incorrect key. Please try again.', 'error');
            } else if (err.response?.status === 403) {
                 Swal.fire('Access Denied', err.response.data.message, 'error');
            } else {
                Swal.fire('Error', 'Could not start test. Check your internet.', 'error');
            }
        }
    };





    const [socket, setSocket] = useState(null);

    useEffect(() => {
        if (isStarted && !socket && testInfo) {
            const token = localStorage.getItem('studentToken');
            // Assuming base_url is something like http://localhost:5000/api
            // We need the root URL for socket.io, so we replace '/api'
            const socketUrl = base_url.replace('/api', ''); 
            const newSocket = io(socketUrl, {
                auth: { token }
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

            setSocket(newSocket);

            return () => newSocket.disconnect();
        }
    }, [isStarted, testInfo]);

    // Risk Engine Hook
    const reportViolationSocket = (type) => {
        if (socket) socket.emit('violation', { type });
    };

    // Heartbeat
    useEffect(() => {
        if (!socket) return;
        const interval = setInterval(() => {
            socket.emit('heartbeat', { timeLeft });
        }, 15000);
        return () => clearInterval(interval);
    }, [socket, timeLeft]);

    // 3. Anti-Cheat & Security Logic (Active only when started)
    useEffect(() => {
        if (!isStarted || submitting) return;

        const handleVisibilityChange = () => {
            if (document.hidden) handleViolation("Tab Switch / Hidden");
        };

        const handleBlur = () => {
            handleViolation("Focus Lost / Minimized");
        };

        const handleFullScreenChange = () => {
            if (!document.fullscreenElement) {
                handleViolation("Exited Full Screen");
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

        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("blur", handleBlur);
        document.addEventListener("fullscreenchange", handleFullScreenChange);
        document.addEventListener("copy", preventCopyPaste);
        document.addEventListener("cut", preventCopyPaste);
        document.addEventListener("paste", preventCopyPaste);
        document.addEventListener("contextmenu", (e) => e.preventDefault());

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("blur", handleBlur);
            document.removeEventListener("fullscreenchange", handleFullScreenChange);
            document.removeEventListener("copy", preventCopyPaste);
            document.removeEventListener("cut", preventCopyPaste);
            document.removeEventListener("paste", preventCopyPaste);
            document.removeEventListener("contextmenu", (e) => e.preventDefault());
        };
    }, [isStarted, submitting, navigate]);


    // 4. Timer & Sync Logic
    const syncProgress = async (currentAnswers, currentTimer) => {
        try {
            const token = localStorage.getItem('studentToken');
            await axios.post(`${base_url}/api/student-auth/sync-progress`, {
                answers: currentAnswers,
                timeLeft: currentTimer
            }, { headers: { Authorization: `Bearer ${token}` } });
        } catch (err) {
            console.error("Sync failed", err);
        }
    };

    useEffect(() => {
        if (!isStarted || submitting || timeLeft <= 0) return;

        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    handleSubmitTest(true); // Auto submit
                    return 0;
                }
                if (prev % 60 === 0) syncProgress(answers, prev); 
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timerRef.current);
    }, [isStarted, submitting, timeLeft, answers]);


    // 5. Utility Functions
    const handleViolation = (type) => {
        if (!isStarted || submitting) return;

        setViolationCount(prev => prev + 1);
        setIsOutOfSync(true); 
        
        // Socket Report
        reportViolationSocket(type);

        const token = localStorage.getItem('studentToken');
        if (token) {
             axios.post(`${base_url}/api/student-auth/log-violation`, { type }, {
                headers: { Authorization: `Bearer ${token}` }
            }).then(res => {
                if (res.data.shouldTerminate) {
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

        setSubmitting(true);
        try {
            const token = localStorage.getItem('studentToken');
            await axios.post(`${base_url}/api/student-auth/submit-test`, { answers }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
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
        }
    };

    const handleAnswer = (questionId, option) => {
        const newAnswers = { ...answers, [questionId]: option };
        setAnswers(newAnswers);
        if (Object.keys(newAnswers).length % 5 === 0) syncProgress(newAnswers, timeLeft);
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
                                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20}/>
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
                            By clicking start, you agree to enter full-screen mode. <br/> Exiting full-screen will be recorded as a violation.
                        </p>
                    </div>
                </form>
            </motion.div>
        </div>
    );

    // 3. Main Test Interface (When Started)
    return (
        <div className="min-h-screen bg-slate-900 text-white p-4 md:p-8 font-sans select-none relative overflow-hidden" onContextMenu={e => e.preventDefault()}>
            

            
            {/* Watermark Overlay */}
            {studentProfile && (
                <div className="fixed inset-0 pointer-events-none z-[50] opacity-[0.03] flex flex-wrap content-center justify-center gap-24 overflow-hidden select-none">
                    {Array.from({ length: 20 }).map((_, i) => (
                        <div key={i} className="transform -rotate-45 text-4xl font-black text-white whitespace-nowrap">
                            {studentProfile.studentId} • {studentProfile.email} • {studentProfile.college || 'PIEDOCX'}
                        </div>
                    ))}
                </div>
            )}

            <AnimatePresence>
                {/* Security Lockdown Modal */}
                {isOutOfSync && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }} 
                        className="fixed inset-0 z-[9999] bg-slate-900/95 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center"
                    >
                        <div className="w-24 h-24 bg-red-500/10 text-red-500 rounded-[2rem] flex items-center justify-center mb-8 border border-red-500/20 shadow-2xl shadow-red-500/20 animate-pulse">
                            <Lock size={48} />
                        </div>
                        <h2 className="text-4xl font-black tracking-tighter italic uppercase mb-4 text-white">Security Alert</h2>
                        <p className="text-slate-400 max-w-md font-medium leading-relaxed mb-10">
                            You are not allowed to switch tabs or minimize the window. 
                            <br/><span className="text-red-400 font-bold block mt-2">Warning Count: {violationCount}</span>
                        </p>
                        <button 
                            onClick={enterFullScreen}
                            className="bg-white text-slate-900 px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-2xl active:scale-95"
                        >
                            Resume Test
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className={`max-w-6xl mx-auto flex flex-col gap-6 h-full min-h-[90vh] transition-all duration-500 ${isOutOfSync ? 'blur-md scale-95 opacity-50' : ''}`}>
                {/* Header */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white/5 p-3 sm:p-4 md:p-6 rounded-2xl md:rounded-[2rem] border border-white/10 shadow-2xl backdrop-blur-md gap-3 md:gap-4 relative overflow-hidden">
                    <div className="absolute inset-0 bg-blue-600/5 pointer-events-none"></div>
                    <div className="flex items-center gap-5 relative z-10 w-full md:w-auto">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
                            <Zap size={20} className="text-white sm:w-6 sm:h-6 md:w-7 md:h-7"/>
                        </div>
                        <div className="min-w-0 flex-1">
                            <h2 className="font-black text-base sm:text-lg md:text-xl lg:text-2xl tracking-tighter text-white leading-none mb-1 sm:mb-1.5 truncate">{testInfo?.title}</h2>
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400">
                                <span className="flex items-center gap-1"><BookOpen size={10} className="sm:w-3 sm:h-3"/> {questions.length} Items</span>
                                <span className="flex items-center gap-1 text-green-400"><CheckCircle size={10} className="sm:w-3 sm:h-3"/> {Object.keys(answers).length} Saved</span>
                                <span className="hidden sm:flex items-center gap-1 text-amber-400"><Target size={10} className="sm:w-3 sm:h-3"/> {questions.length - Object.keys(answers).length} Pending</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className={`relative z-10 w-full md:w-auto flex justify-end`}>
                        <div className={`px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 rounded-xl md:rounded-2xl border font-mono text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black shadow-inner tracking-tight transition-all tabular-nums ${timeLeft < 300 ? 'text-red-500 border-red-500/30 bg-red-500/10 animate-pulse' : 'text-blue-400 border-blue-400/20 bg-blue-400/5'}`}>
                            {mins}:{String(secs).padStart(2, '0')}
                        </div>
                    </div>
                </header>

                <div className="grid lg:grid-cols-4 gap-6 flex-1 items-start">
                    {/* Navigator */}
                    <div className="hidden lg:flex flex-col bg-white/5 p-6 rounded-[2rem] border border-white/10 h-[calc(100vh-200px)] sticky top-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Question Navigator</h3>
                            <span className="text-[10px] text-slate-600 font-bold">{Math.round((Object.keys(answers).length / questions.length) * 100)}%</span>
                        </div>
                        <div className="grid grid-cols-4 gap-3 overflow-y-auto pr-2 custom-scrollbar flex-1 content-start">
                            {questions.map((_, i) => (
                                <button 
                                    key={i} 
                                    disabled={submitting || timeLeft <= 0}
                                    onClick={() => setCurrentQuestion(i)} 
                                    className={`aspect-square rounded-xl text-xs font-bold transition-all flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed border-2 ${
                                        currentQuestion === i 
                                        ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20 scale-105 z-10' 
                                        : answers[questions[i]._id] 
                                            ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                                            : 'bg-white/5 border-transparent text-slate-500 hover:bg-white/10 hover:border-white/10'
                                    }`}
                                >
                                    {i+1}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Question Area */}
                    <div className="lg:col-span-3 flex flex-col gap-6">
                        <motion.div 
                            key={currentQuestion} 
                            initial={{ opacity: 0, y: 10 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            className="bg-white/5 p-6 md:p-10 rounded-[2.5rem] border border-white/10 flex-1 relative overflow-hidden min-h-[400px]"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] pointer-events-none"></div>
                            
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-6">
                                    <span className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black text-blue-400 uppercase tracking-widest">
                                        Question {currentQuestion + 1}
                                    </span>
                                </div>
                                
                                <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-6 sm:mb-8 md:mb-10 leading-snug text-slate-100 max-w-3xl">
                                    {questions[currentQuestion]?.questionText}
                                </h3>
                                
                                <div className="grid gap-3 sm:gap-4 max-w-3xl">
                                    {questions[currentQuestion]?.options.map((opt, i) => (
                                        <button 
                                            key={i} 
                                            disabled={submitting || timeLeft <= 0}
                                            onClick={() => handleAnswer(questions[currentQuestion]._id, opt)}
                                            className={`group w-full text-left p-3 sm:p-4 md:p-5 rounded-xl sm:rounded-2xl border-2 transition-all flex items-center gap-3 sm:gap-4 md:gap-5 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden min-h-[48px] sm:min-h-[56px] ${
                                                answers[questions[currentQuestion]._id] === opt 
                                                ? 'border-blue-500 bg-blue-600/10 shadow-lg shadow-blue-900/20' 
                                                : 'border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10 text-slate-400'
                                            }`}
                                        >
                                            <div className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg sm:rounded-xl flex items-center justify-center font-black text-xs sm:text-sm transition-colors shrink-0 ${
                                                answers[questions[currentQuestion]._id] === opt 
                                                ? 'bg-blue-600 text-white shadow-md' 
                                                : 'bg-white/10 text-slate-500 group-hover:bg-white/20 group-hover:text-white'
                                            }`}>
                                                {String.fromCharCode(65+i)}
                                            </div>
                                            <span className={`font-medium text-sm sm:text-base md:text-lg transition-colors leading-relaxed ${
                                                answers[questions[currentQuestion]._id] === opt ? 'text-white' : 'group-hover:text-slate-200'
                                            }`}>
                                                {opt}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                        
                        {/* Control Bar */}
                        <div className="flex justify-between items-center p-2 sm:p-3 bg-white/5 rounded-xl sm:rounded-[1.5rem] border border-white/10 backdrop-blur-md gap-2">
                            <button 
                                disabled={submitting || timeLeft <= 0 || currentQuestion === 0}
                                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))} 
                                className="px-4 sm:px-6 py-3 sm:py-4 rounded-lg sm:rounded-xl text-slate-400 font-bold hover:text-white hover:bg-white/5 transition-all disabled:opacity-20 disabled:cursor-not-allowed text-xs sm:text-sm uppercase tracking-widest min-h-[44px]"
                            >
                                <span className="hidden sm:inline">Previous</span>
                                <span className="sm:hidden">Prev</span>
                            </button>
                                
                                {currentQuestion === questions.length - 1 ? 
                                    <button 
                                        disabled={submitting}
                                        onClick={() => handleSubmitTest(false)} 
                                        className="bg-green-600 px-6 sm:px-10 py-3 sm:py-4 rounded-lg sm:rounded-xl font-black text-xs sm:text-sm uppercase tracking-widest shadow-xl shadow-green-600/20 hover:bg-green-500 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-h-[44px]"
                                    >
                                        {submitting ? 'Submitting...' : 'Submit Answers'}
                                    </button> :
                                    <button 
                                        disabled={submitting || timeLeft <= 0}
                                        onClick={() => setCurrentQuestion(currentQuestion+1)} 
                                        className="bg-blue-600 px-6 sm:px-10 py-3 sm:py-4 rounded-lg sm:rounded-xl font-black text-xs sm:text-sm uppercase tracking-widest shadow-xl shadow-blue-600/20 hover:bg-blue-500 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 group min-h-[44px]"
                                    >
                                        Next <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform sm:w-4 sm:h-4"/>
                                    </button>
                            }
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Global Styles for Scrollbar */}
            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.02); 
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1); 
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2); 
                }
            `}</style>
        </div>
    );
};

export default TestInterface;
