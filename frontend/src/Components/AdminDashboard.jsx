import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ADMIN_PATH } from "../utils/info";
import BackButton from "./BackButton";
import { LayoutDashboard, FileText, Settings, LogOut, ShieldCheck, UserPlus, Database, Menu, X, Trophy, Activity, BarChart, Bell } from "lucide-react";

function AdminDashboard({children}) {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin-login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin-login');
  };

  return (
    <div className="w-screen h-screen bg-slate-50 flex overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SideBar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col shadow-2xl lg:shadow-sm transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Logo */}
        <div className="p-6 flex items-center justify-between border-b border-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
               <ShieldCheck className="text-white w-6 h-6" />
            </div>
            <span className="font-black text-xl text-slate-900 tracking-tighter">
              ADMIN <span className="text-blue-600">PANEL</span>
            </span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Menu */}
        <div className="flex-grow p-4 space-y-2 overflow-y-auto">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-2">Navigation</p>
          
          <Link to="/admin-dashboard" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-4 p-3.5 rounded-2xl hover:bg-slate-50 transition-all text-slate-600 hover:text-blue-600 group">
            <LayoutDashboard className="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-sm">Dashboard</span>
          </Link>

          <Link to="/admin-tests" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-4 p-3.5 rounded-2xl hover:bg-slate-50 transition-all text-slate-600 hover:text-blue-600 group">
            <Settings className="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-sm">Test Config</span>
          </Link>

          <Link to="/admin-content" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-4 p-3.5 rounded-2xl hover:bg-slate-50 transition-all text-slate-600 hover:text-blue-600 group">
            <Bell className="w-6 h-6 group-hover:scale-110 transition-transform text-amber-500" />
            <span className="font-bold text-sm">Content Manager</span>
          </Link>

            <Link to="/admin-results" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-4 p-3.5 rounded-2xl hover:bg-slate-50 transition-all text-slate-600 hover:text-blue-600 group">
            <Trophy className="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-sm">Performance Leaderboards</span>
          </Link>

          <Link to="/admin-monitor" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-4 p-3.5 rounded-2xl hover:bg-slate-50 transition-all text-slate-600 hover:text-blue-600 group">
             <Activity className="w-6 h-6 group-hover:scale-110 transition-transform text-red-500" />
             <span className="font-bold text-sm">Live Risk Feed</span>
          </Link>

          <Link to="/admin-certificates" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-4 p-3.5 rounded-2xl hover:bg-slate-50 transition-all text-slate-600 hover:text-blue-600 group">
             <ShieldCheck className="w-6 h-6 group-hover:scale-110 transition-transform" />
             <span className="font-bold text-sm">Certificate Manager</span>
          </Link>

          <Link to="/admin-data" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-4 p-3.5 rounded-2xl hover:bg-slate-50 transition-all text-slate-600 hover:text-blue-600 group">
             <Database className="w-6 h-6 group-hover:scale-110 transition-transform" />
             <span className="font-bold text-sm">Data Archives</span>
          </Link>

          <Link to="/admin-analytics" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-4 p-3.5 rounded-2xl hover:bg-slate-50 transition-all text-slate-600 hover:text-blue-600 group">
             <BarChart className="w-6 h-6 group-hover:scale-110 transition-transform text-purple-500" />
             <span className="font-bold text-sm">Deep Analytics</span>
          </Link>

          <Link to={ADMIN_PATH} onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-4 p-3.5 rounded-2xl hover:bg-slate-50 transition-all text-slate-600 hover:text-blue-600 group">
             <UserPlus className="w-6 h-6 group-hover:scale-110 transition-transform" />
             <span className="font-bold text-sm">Add Students</span>
          </Link>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-slate-50">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 p-3.5 rounded-2xl hover:bg-red-50 text-slate-400 hover:text-red-600 transition-all group"
          >
            <LogOut className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold text-sm">Logout System</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow relative h-full flex flex-col overflow-hidden w-full">
         <div className="h-16 md:h-20 bg-white border-b border-slate-100 flex items-center px-4 md:px-10 justify-between shrink-0">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 -ml-2 text-slate-500 hover:text-blue-600 transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
              <BackButton />
            </div>
            
            <div className="flex items-center gap-3">
               <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest hidden md:inline-block">System Online</span>
               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
         </div>
         <div className="flex-grow overflow-y-auto bg-[#fafbfc] p-4 md:p-6 lg:p-10">
            {children}
         </div>
      </div>
    </div>
  );
}

export default AdminDashboard;