import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Home, Terminal, AlertTriangle, Cpu, Command } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import SEO from "./SEO";

const NotFound = () => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`relative min-h-screen flex flex-col items-center justify-center overflow-hidden font-sans selection:bg-blue-600 selection:text-white transition-colors duration-500 ${isDarkMode ? "bg-slate-950" : "bg-slate-50"}`}>
      <SEO title="404 - Node Disconnected" description="The architectural node you're looking for does not exist in our core matrix." />
      
      {/* Background Matrix Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
         <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.1]"></div>
      </div>

      <div className="relative z-10 text-center px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative mb-8 md:mb-12 inline-block"
        >
           <h1 className={`text-[12rem] md:text-[20rem] font-black leading-none select-none tracking-tighter ${isDarkMode ? "text-white/5 shadow-white/5" : "text-slate-900/5"}`}>
             404
           </h1>
           <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                 <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -inset-10 border border-dashed border-blue-600/30 rounded-full"
                 ></motion.div>
                 <motion.div 
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute -inset-16 border border-dashed border-slate-500/20 rounded-full"
                 ></motion.div>
                 <div className="p-8 md:p-12 bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl border border-blue-600/10 backdrop-blur-xl relative z-10">
                    <AlertTriangle size={64} className="text-blue-600 animate-pulse mx-auto mb-4" />
                    <p className={`text-xl md:text-2xl font-black uppercase tracking-[0.3em] ${isDarkMode ? "text-white" : "text-slate-900"}`}>Node Offline</p>
                 </div>
              </div>
           </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-xl mx-auto"
        >
           <h2 className={`text-3xl md:text-5xl font-black tracking-tighter uppercase italic leading-none mb-6 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
             Something went <span className="text-blue-600 underline decoration-blue-600/10 decoration-8 underline-offset-8">OBSOLETE.</span>
           </h2>
           
           <p className="text-slate-500 dark:text-slate-400 text-lg mb-12 font-medium italic border-l-4 border-blue-600 pl-8 inline-block text-left">
             The architectural node you are attempting to reach is currently offline or has been purged from our core laboratory. Re-initiate your session from the home node.
           </p>
           
           <div className="flex flex-col sm:flex-row justify-center gap-6">
             <Link 
               to="/" 
               className="group relative px-10 py-5 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/30 flex items-center justify-center gap-4"
             >
                <Home size={18} />
                Return to Core Hub
                <div className="absolute inset-0 rounded-2xl ring-2 ring-white/20 group-hover:ring-white/40 transition-all scale-x-105 scale-y-110 opacity-0 group-hover:opacity-100"></div>
             </Link>
             <button
               onClick={() => window.history.back()}
               className={`px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-4 border ${isDarkMode ? "bg-white/5 border-white/10 text-white hover:bg-white/10" : "bg-white border-slate-200 text-slate-800 hover:bg-slate-50"}`}
             >
                <Terminal size={18} />
                Back to Terminal
             </button>
           </div>
        </motion.div>
      </div>

      {/* Decorative Matrix Logs */}
      <div className="absolute bottom-12 left-12 text-[10px] font-mono text-slate-700 dark:text-slate-500 hidden lg:block select-none opacity-40">
         <div className="flex gap-4 items-center mb-2">
            <Cpu size={14} className="text-blue-600" />
            <span className="uppercase tracking-[0.2em] font-black">System Logs</span>
         </div>
         <p>{`> Error: [CONNECTION_REFUSED]`}</p>
         <p>{`> Node: [UNRESOLVED_PATH]`}</p>
         <p>{`> Status: [LOST_IN_MATRIX]`}</p>
         <p>{`> Directive: [RE_INITIATE_CORE_PROTOCOL]`}</p>
      </div>

      <div className="absolute top-12 right-12 text-[10px] font-mono text-slate-700 dark:text-slate-500 hidden lg:block select-none opacity-40">
         <Command size={14} className="mb-2 text-blue-600 animate-spin-slow" />
         <p className="uppercase tracking-[0.2em] font-black">Architecture Lab v2.0</p>
      </div>

      <style>{`
        .animate-spin-slow { animation: spin 4s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default NotFound;

