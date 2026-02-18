import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../utils/api';
import Swal from 'sweetalert2';
import Typewriter from 'typewriter-effect';
import { ShieldCheck, GraduationCap } from 'lucide-react';
import { useStudentAuth } from '../context/StudentAuthContext';

const StudentLogin = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useStudentAuth();
    const [loading, setLoading] = useState(false);

    const handleSuccess = async (response) => {
        setLoading(true);
        try {
            const data = await api.post('/api/student-auth/login', {
                token: response.credential
            });

            // Use context login
            login(data.student, data.token);

            Swal.fire({
                icon: 'success',
                title: 'Access Granted',
                text: 'Initializing dashboard session...',
                timer: 1500,
                showConfirmButton: false,
                background: '#ffffff',
                color: '#0f172a',
                customClass: { popup: 'rounded-[1.5rem] border border-slate-100 shadow-2xl' }
            });

            // Redirect to intended page or dashboard
            const from = location.state?.from?.pathname || '/student-dashboard';
            setTimeout(() => navigate(from, { replace: true }), 1500);
        } catch (err) {

            Swal.fire({
                icon: 'error',
                title: 'Access Denied',
                text: err.response?.data?.message || 'Identity verification failed.'
            });
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] relative overflow-hidden font-sans pt-20 pb-10 px-4 md:px-0">
            {/* Premium Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100/30 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-100/30 rounded-full blur-[120px]"></div>
                <div className="absolute inset-0 opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            </div>

            <div className="bg-white p-8 md:p-16 rounded-[2rem] md:rounded-[3rem] shadow-2xl w-full max-w-lg relative z-10 border border-slate-200">
                <div className="text-center mb-8 md:mb-12">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-900 rounded-[1.25rem] md:rounded-[1.5rem] mx-auto mb-6 flex items-center justify-center shadow-2xl shadow-slate-900/20 group hover:bg-blue-600 transition-colors duration-500">
                        <GraduationCap className="h-8 w-8 md:h-10 md:w-10 text-white" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2 uppercase italic tracking-tight">Student Portal</h2>
                    <div className="text-[10px] md:text-xs font-black text-blue-600 uppercase tracking-[0.3em] h-6 flex items-center justify-center gap-2">
                        <ShieldCheck size={14} />
                        <Typewriter
                            options={{
                                strings: ['Secure Login', 'Academic Node', 'Direct Access'],
                                autoStart: true,
                                loop: true,
                                delay: 50,
                            }}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-6">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-slate-100 rounded-full"></div>
                            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0"></div>
                        </div>
                        <p className="text-slate-500 font-black uppercase tracking-widest text-[10px] animate-pulse">Synchronizing Node...</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6 md:gap-8">
                        <div className="flex justify-center transform transition-all hover:scale-105 active:scale-95 shadow-xl shadow-blue-500/10 rounded-full overflow-hidden max-w-full">
                            <GoogleLogin
                                onSuccess={handleSuccess}
                                onError={() => Swal.fire('Error', 'Google Handshake Failed', 'error')}
                                useOneTap
                                theme="filled_blue"
                                size="large"
                                shape="pill"
                                width="300"
                            />
                        </div>
                        <div className="space-y-4">
                            <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] px-4 md:px-6 leading-relaxed">
                                Session Authorization Required
                            </p>
                            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
                            <p className="text-center text-[9px] text-slate-400 font-medium px-4 md:px-8">
                                By accessing the portal, you agree to the institution's digital conduct protocols and security policies.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            <footer className="absolute bottom-4 w-full text-center">
                <p className="text-[9px] md:text-[10px] text-slate-400 font-black uppercase tracking-[0.3em]">© 2026 Piedocx Core Node</p>
            </footer>
        </div>
    );
};

export default StudentLogin;
