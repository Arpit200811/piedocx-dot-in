import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useStudentAuth } from '../context/StudentAuthContext';
import { 
    LayoutDashboard, BookOpen, User, LogOut, Menu, X, 
    Award, FileText, Bell, Search, ChevronRight
} from 'lucide-react';

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
        { title: 'Overview', path: '/student-dashboard', icon: <LayoutDashboard size={18}/> },
        { title: 'Online Exams', path: '/student-dashboard/exams', icon: <BookOpen size={18}/> },
        { title: 'Resources', path: '/student-dashboard/resources', icon: <FileText size={18}/> },
        { title: 'Certificates', path: '/student-dashboard/certificates', icon: <Award size={18}/> },
        { title: 'My Profile', path: '/student-dashboard/profile', icon: <User size={18}/> },
    ];

    const activeItem = navItems.find(item => location.pathname === item.path) || navItems[0];

    return (
        <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-sans antialiased text-slate-900">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-slate-900/40 lg:hidden backdrop-blur-sm transition-opacity duration-300" 
                    onClick={() => setSidebarOpen(false)} 
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center h-20 px-8 border-b border-slate-100">
                    <img src="/pie_logo.png" alt="Piedocx" className="h-10 w-auto mix-blend-multiply" />
                    <span className="ml-3 text-xl font-black italic tracking-tighter text-slate-900">PIEDOCX<span className="text-blue-600">.</span></span>
                </div>
                
                <nav className="flex-1 p-6 space-y-1.5 overflow-y-auto">
                    <p className="px-4 mb-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Menu</p>
                    {navItems.map((item) => (
                        <Link 
                            key={item.path} 
                            to={item.path} 
                            onClick={() => setSidebarOpen(false)} 
                            className={`flex items-center px-4 py-3.5 rounded-2xl transition-all duration-200 group ${
                                location.pathname === item.path 
                                ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20 active:scale-95' 
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                        >
                            <span className={`mr-3 transition-colors ${location.pathname === item.path ? 'text-white' : 'text-slate-400 group-hover:text-blue-600'}`}>
                                {item.icon}
                            </span>
                            <span className="text-sm font-bold tracking-tight italic uppercase">{item.title}</span>
                            {location.pathname === item.path && (
                                <ChevronRight size={14} className="ml-auto opacity-60" />
                            )}
                        </Link>
                    ))}
                </nav>

                <div className="p-6 border-t border-slate-100 bg-slate-50/50">
                    <button 
                        onClick={handleLogout} 
                        className="w-full flex items-center px-4 py-3.5 text-red-500 rounded-2xl hover:bg-red-50 transition-all duration-200 group"
                    >
                        <LogOut size={18} className="mr-3 group-hover:rotate-12 transition-transform"/>
                        <span className="text-sm font-bold tracking-tight italic uppercase text-red-600/80">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 md:px-10 shrink-0 sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-slate-500 hover:bg-slate-50 rounded-xl transition-colors">
                            <Menu size={24}/>
                        </button>
                        <h2 className="text-base md:text-lg font-black text-slate-900 uppercase italic tracking-tighter">
                            {activeItem?.title}
                        </h2>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex items-center bg-slate-100 rounded-2xl px-4 py-2 border border-slate-200/50 focus-within:ring-2 focus-within:ring-blue-600/20 focus-within:bg-white transition-all w-64 lg:w-80">
                            <Search size={16} className="text-slate-400 mr-2" />
                            <input type="text" placeholder="Search resources..." className="bg-transparent border-0 outline-none text-xs w-full font-medium" />
                        </div>
                        
                        <div className="flex items-center pl-6 border-l border-slate-200 gap-4">
                            <div className="text-right hidden sm:block">
                                <p className="text-xs font-black text-slate-900 uppercase italic tracking-tight mb-0.5">{student?.fullName}</p>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{student?.studentId}</p>
                            </div>
                            <div className="h-10 w-10 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 ring-2 ring-slate-100 overflow-hidden shadow-sm border border-white">
                                {student?.profilePicture ? (
                                    <img src={student.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="font-black italic uppercase">{student?.fullName?.[0]}</span>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6 md:p-10">
                    <div className="max-w-7xl mx-auto min-h-full">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
