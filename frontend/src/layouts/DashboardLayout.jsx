import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useStudentAuth } from '../context/StudentAuth';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, BookOpen, User, LogOut, Menu, X,
    Award, FileText, Bell, Search, ChevronRight, Zap
} from 'lucide-react';
import SEO from '../components/SEO';

const DashboardLayout = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const { student, logout } = useStudentAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/student-login', { replace: true });
    };

    const navItems = [
        { title: 'Overview', path: '/student-dashboard', icon: <LayoutDashboard size={18} /> },
        { title: 'Online Exams', path: '/student-dashboard/exams', icon: <BookOpen size={18} /> },
        { title: 'Resources', path: '/student-dashboard/resources', icon: <FileText size={18} /> },
        { title: 'Certificates', path: '/student-dashboard/certificates', icon: <Award size={18} /> },
        { title: 'My Profile', path: '/student-dashboard/profile', icon: <User size={18} /> },
    ];

    const activeItem = navItems.find(item => location.pathname === item.path) || navItems[0];

    return (
        <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-sans antialiased text-slate-900 selection:bg-blue-600 selection:text-white">
            <SEO title={`${activeItem?.title} | Student Terminal`} />

            {/* Futuristic Background Elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/5 rounded-full blur-[120px] animate-pulse delay-700"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02]"></div>
            </div>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] bg-slate-900/60 lg:hidden backdrop-blur-md"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Unique Floating Sidebar */}
            <aside className={`fixed inset-y-4 left-4 z-[70] w-72 transform transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1) lg:relative lg:inset-y-0 lg:left-0 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-[calc(100%+2rem)]'}`}>
                <div className="h-full bg-slate-900/95 backdrop-blur-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.3)] lg:shadow-none flex flex-col relative overflow-hidden rounded-[2.5rem] lg:rounded-none">
                    {/* Sidebar Header Glow */}
                    <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-blue-600/10 to-transparent pointer-events-none"></div>

                    <div className="flex items-center h-24 lg:h-28 px-10 relative z-10">
                        <motion.div 
                            whileHover={{ rotate: 180, scale: 1.1 }}
                            className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)] cursor-pointer group"
                        >
                            <Zap size={20} className="text-white fill-white group-hover:scale-125 transition-transform" />
                        </motion.div>
                        <div className="ml-4 lg:ml-5">
                            <h1 className="text-xl lg:text-2xl font-black italic tracking-tighter text-white leading-none">
                                PIEDOCX<span className="text-blue-500">.</span>
                            </h1>
                            <p className="text-[7px] font-black text-blue-400 uppercase tracking-[0.4em] mt-1 opacity-80">Core Terminal v3.0</p>
                        </div>
                    </div>

                    <nav className="flex-1 px-4 lg:px-6 space-y-1.5 overflow-y-auto py-4 lg:py-6 relative z-10 custom-scrollbar-hidden">
                        <p className="px-6 mb-4 lg:mb-6 text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] italic opacity-50">Main Frequency</p>
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`flex items-center px-6 py-3.5 lg:py-4.5 rounded-2xl transition-all duration-500 group relative overflow-hidden ${isActive
                                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/20 translate-x-2'
                                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    {isActive && (
                                        <motion.div layoutId="nav-glow-box" className="absolute inset-0 bg-white/10 pointer-events-none" />
                                    )}
                                    <span className={`mr-4 transition-all duration-500 ${isActive ? 'scale-110 text-white' : 'group-hover:text-blue-400 group-hover:scale-110'}`}>
                                        {item.icon}
                                    </span>
                                    <span className={`text-[10px] lg:text-[11px] font-black tracking-widest italic uppercase transition-all duration-300 ${isActive ? 'translate-x-1' : 'group-hover:translate-x-1'}`}>
                                        {item.title}
                                    </span>
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="p-6 lg:p-8 relative z-10 mt-auto">
                        <div className="bg-white/5 backdrop-blur-md rounded-3xl p-5 lg:p-6 mb-6 lg:mb-8 border border-white/5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
                            <div className="flex justify-between items-center mb-3 lg:mb-4">
                                <p className="text-[8px] font-black text-blue-400 uppercase tracking-widest italic">Node Status</p>
                                <div className="flex gap-1">
                                    <span className="w-1 h-1 bg-emerald-500 rounded-full animate-ping"></span>
                                    <span className="w-1 h-1 bg-emerald-500 rounded-full"></span>
                                </div>
                            </div>
                            <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden mb-2">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "88%" }}
                                    transition={{ duration: 2, ease: "easeOut" }}
                                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 shadow-[0_0_15px_rgba(37,99,235,0.5)]"
                                />
                            </div>
                            <p className="text-[9px] font-bold text-white uppercase italic opacity-40">Sync Optimized</p>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="w-full h-12 lg:h-14 flex items-center justify-center px-4 text-slate-500 rounded-2xl hover:bg-red-600 hover:text-white transition-all duration-500 group border border-white/5 hover:border-red-500/50"
                        >
                            <LogOut size={16} className="mr-3 group-hover:-translate-x-1 transition-transform" />
                            <span className="text-[9px] lg:text-[10px] font-black tracking-[0.2em] italic uppercase">Terminate Session</span>
                        </button>
                    </div>

                    {/* Sidebar Footer Pattern */}
                    <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-blue-600/5 to-transparent pointer-events-none"></div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 relative z-10">
                <header className="h-20 lg:h-28 flex items-center justify-between px-6 md:px-10 lg:px-14 shrink-0 transition-all duration-500 backdrop-blur-sm lg:backdrop-blur-none bg-[#f8fafc]/80 lg:bg-transparent">
                    <div className="flex items-center gap-4 lg:gap-8">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden w-11 h-11 flex items-center justify-center bg-white shadow-xl rounded-xl text-slate-900 border border-slate-100 active:scale-95 transition-all"
                        >
                            <Menu size={20} />
                        </button>
                        <div className="relative">
                            <p className="text-[7px] md:text-[9px] font-black text-slate-400 uppercase tracking-[0.5em] mb-0.5 lg:mb-1 opacity-60 flex items-center gap-1.5">
                                <span className="hidden sm:inline-block w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse shadow-[0_0_10px_rgba(37,99,235,0.5)]"></span>
                                Sector Navigation
                            </p>
                            <h2 className="text-lg md:text-2xl lg:text-3xl font-black text-slate-900 uppercase italic tracking-tighter transition-all truncate max-w-[150px] sm:max-w-none">
                                {activeItem?.title}<span className="text-blue-600 animate-pulse">_</span>
                            </h2>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 md:gap-10">
                        <div className="hidden xl:flex items-center bg-white rounded-[1.5rem] px-5 py-3 border border-slate-200 shadow-[0_10px_40px_rgba(0,0,0,0.02)] focus-within:shadow-[0_20px_60px_rgba(0,0,0,0.06)] focus-within:border-blue-600/20 focus-within:-translate-y-1 transition-all w-[300px] xl:w-[400px] group">
                            <Search size={16} className="text-slate-400 mr-3 group-focus-within:text-blue-600 transition-colors" />
                            <input 
                                type="text" 
                                placeholder="Universal Identity Search..." 
                                className="bg-transparent border-0 outline-none text-[10px] w-full font-black uppercase italic tracking-widest placeholder:text-slate-300" 
                            />
                        </div>

                        <div className="flex items-center gap-3 md:gap-6">
                            <button className="relative w-11 h-11 lg:w-14 lg:h-14 flex items-center justify-center bg-white rounded-xl lg:rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-blue-100 transition-all text-slate-500 hover:text-blue-600 group overflow-hidden">
                                <span className="absolute top-2 right-2 lg:top-3 lg:right-3 w-1.5 h-1.5 lg:w-2 lg:h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                                <Bell size={18} lg:size={22} className="group-hover:rotate-12 transition-transform" />
                                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 translate-y-full group-hover:translate-y-0 transition-transform"></div>
                            </button>
                            
                            <div className="flex items-center gap-3 lg:gap-4 bg-slate-900 px-3 lg:px-5 py-2 lg:py-3 rounded-xl lg:rounded-[1.5rem] border border-slate-800 shadow-2xl hover:scale-105 active:scale-95 transition-all group cursor-pointer relative overflow-hidden h-11 lg:h-16">
                                <div className="absolute inset-0 bg-blue-600/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
                                <div className="h-7 w-7 md:h-9 md:w-9 lg:h-10 lg:w-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-lg lg:rounded-xl flex items-center justify-center text-white shadow-lg overflow-hidden border border-white/20 ring-1 lg:ring-2 ring-slate-800 group-hover:ring-blue-600 transition-all shrink-0">
                                    {student?.profilePicture ? (
                                        <img src={student.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={14} lg:size={18} className="text-white" />
                                    )}
                                </div>
                                <div className="text-left hidden sm:block relative z-10">
                                    <p className="text-[8px] lg:text-[10px] font-black text-white uppercase italic tracking-widest leading-none mb-0.5 lg:mb-1 truncate max-w-[80px] lg:max-w-none">{student?.fullName}</p>
                                    <div className="flex items-center gap-1 lg:gap-1.5 opacity-50">
                                        <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                                        <p className="text-[7px] lg:text-[8px] font-black text-blue-400 uppercase tracking-[0.2em]">{student?.studentId}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-14 relative flex flex-col custom-scrollbar">
                    <div className="max-w-[1400px] mx-auto w-full flex-1 h-full">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
