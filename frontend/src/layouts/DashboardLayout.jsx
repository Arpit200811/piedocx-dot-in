import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useStudentAuth } from '../context/StudentAuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    LayoutDashboard, BookOpen, User, LogOut, Menu, X, 
    Award, FileText, Bell, Search, ChevronRight, Zap
} from 'lucide-react';
import SEO from '../Components/SEO';

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
        { title: 'Overview', path: '/student-dashboard', icon: <LayoutDashboard size={20}/> },
        { title: 'Online Exams', path: '/student-dashboard/exams', icon: <BookOpen size={20}/> },
        { title: 'Resources', path: '/student-dashboard/resources', icon: <FileText size={20}/> },
        { title: 'Certificates', path: '/student-dashboard/certificates', icon: <Award size={20}/> },
        { title: 'My Profile', path: '/student-dashboard/profile', icon: <User size={20}/> },
    ];

    const activeItem = navItems.find(item => location.pathname === item.path) || navItems[0];

    return (
        <div className="flex h-screen light-mesh overflow-hidden font-sans antialiased text-slate-900 font-medium">
            <SEO title={`${activeItem?.title} | Student Terminal`} />

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] bg-slate-900/40 lg:hidden backdrop-blur-md" 
                        onClick={() => setSidebarOpen(false)} 
                    />
                )}
            </AnimatePresence>

            {/* Sidebar Container */}
            <aside className={`fixed inset-y-4 left-4 z-[70] w-72 transform transition-all duration-500 ease-in-out lg:relative lg:translate-x-0 lg:inset-y-0 lg:left-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-[calc(100%+2rem)]'}`}>
                <div className="h-full bg-white/80 backdrop-blur-3xl border border-white/20 shadow-2xl rounded-[2.5rem] lg:rounded-none lg:border-r lg:border-y-0 lg:border-l-0 lg:shadow-none flex flex-col relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
                    
                    <div className="flex items-center h-24 px-10">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20 rotate-3 group-hover:rotate-0 transition-transform">
                            <Zap size={22} className="text-white fill-white"/>
                        </div>
                        <span className="ml-4 text-2xl font-black italic tracking-tighter text-slate-900">
                            PIEDOCX<span className="text-blue-600">.</span>
                        </span>
                    </div>
                    
                    <nav className="flex-1 px-6 space-y-2 overflow-y-auto py-4">
                        <p className="px-6 mb-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic opacity-60">Control Matrix</p>
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link 
                                    key={item.path} 
                                    to={item.path} 
                                    onClick={() => setSidebarOpen(false)} 
                                    className={`flex items-center px-6 py-4 rounded-[1.5rem] transition-all duration-300 group relative ${
                                        isActive 
                                        ? 'bg-blue-600 text-white shadow-2xl shadow-blue-600/20 translate-x-2' 
                                        : 'text-slate-500 hover:bg-white hover:shadow-xl hover:text-slate-900'
                                    }`}
                                >
                                    <span className={`mr-4 transition-transform group-hover:scale-110 ${isActive ? 'text-blue-400' : 'text-slate-400'}`}>
                                        {item.icon}
                                    </span>
                                    <span className="text-sm font-black tracking-tight italic uppercase">{item.title}</span>
                                    {isActive && (
                                        <motion.div layoutId="nav-glow" className="absolute -left-1 w-1.5 h-8 bg-blue-600 rounded-full" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="p-8 border-t border-slate-100">
                        <div className="bg-slate-50 rounded-3xl p-5 mb-6 border border-slate-100 relative overflow-hidden group">
                            <div className="absolute -top-4 -right-4 w-12 h-12 bg-blue-600/5 rounded-full blur-xl group-hover:scale-150 transition-transform"></div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 italic">Node Sync</p>
                            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: "65%" }}
                                    className="h-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.4)]" 
                                />
                            </div>
                        </div>
                        <button 
                            onClick={handleLogout} 
                            className="w-full h-14 flex items-center justify-center px-6 text-red-500 rounded-2xl hover:bg-red-50 transition-all duration-300 group border border-transparent hover:border-red-100"
                        >
                            <LogOut size={20} className="mr-3 group-hover:-translate-x-1 transition-transform"/>
                            <span className="text-sm font-black tracking-widest italic uppercase">Terminate Session</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 relative">
                <header className="h-24 bg-white/50 backdrop-blur-2xl border-b border-white/20 flex items-center justify-between px-6 md:px-12 shrink-0 sticky top-0 z-40">
                    <div className="flex items-center gap-6">
                        <button 
                            onClick={() => setSidebarOpen(true)} 
                            className="lg:hidden w-12 h-12 flex items-center justify-center bg-white shadow-lg rounded-2xl text-slate-900 hover:scale-105 active:scale-95 transition-all"
                        >
                            <Menu size={22}/>
                        </button>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-0.5 opacity-60">System Navigator</p>
                            <h2 className="text-xl md:text-2xl font-black text-slate-900 uppercase italic tracking-tighter">
                                {activeItem?.title}<span className="text-blue-600">_</span>
                            </h2>
                        </div>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="hidden lg:flex items-center bg-white/80 backdrop-blur-md rounded-2xl px-5 py-3 border border-white/50 shadow-sm focus-within:shadow-xl focus-within:ring-4 focus-within:ring-blue-600/5 transition-all w-96 group">
                            <Search size={18} className="text-slate-400 mr-3 group-focus-within:text-blue-600 transition-colors" />
                            <input type="text" placeholder="Search Matrix Assets..." className="bg-transparent border-0 outline-none text-xs w-full font-bold uppercase italic tracking-tight placeholder:opacity-30" />
                        </div>
                        
                        <div className="flex items-center gap-5 pl-8 border-l border-slate-200">
                             <button className="relative w-12 h-12 flex items-center justify-center bg-white rounded-2xl shadow-sm hover:shadow-md transition-all text-slate-400 hover:text-blue-600 group">
                                <Bell size={20} className="group-hover:animate-swing" />
                                <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white shadow-[0_0_10px_rgba(239,68,68,0.5)]"></span>
                             </button>
                            <div className="flex items-center gap-4 bg-white/80 backdrop-blur-md p-1.5 pr-5 rounded-2.5xl border border-white/50 shadow-sm hover:shadow-xl transition-all group cursor-pointer">
                                <div className="h-11 w-11 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg overflow-hidden border-2 border-white ring-4 ring-slate-100 group-hover:ring-blue-100 transition-all">
                                    {student?.profilePicture ? (
                                        <img src={student.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="font-black italic uppercase text-lg text-blue-500">{student?.fullName?.[0]}</span>
                                    )}
                                </div>
                                <div className="text-left hidden sm:block">
                                    <p className="text-xs font-black text-slate-900 uppercase italic tracking-tight leading-none mb-1 group-hover:text-blue-600 transition-colors">{student?.fullName}</p>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] italic">{student?.studentId}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6 md:p-12 relative flex flex-col">
                    <div className="max-w-7xl mx-auto w-full flex-1">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
