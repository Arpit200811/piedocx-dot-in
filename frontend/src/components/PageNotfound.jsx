import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import SEO from "./SEO";

const NotFound = () => {
  useEffect(() => {
    // Optional: Add simple particle animation logic here if desired
  }, []);

  return (
    <div className="relative min-h-screen bg-slate-950 flex flex-col items-center justify-center overflow-hidden font-sans selection:bg-blue-500 selection:text-white">
      <SEO title="404 - Page Not Found" description="The page you are looking for does not exist." />
      {/* Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none"></div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.05] pointer-events-none"></div>

      <div className="relative z-10 text-center px-6">
        <div className="inline-block relative mb-4">
           <h1 className="text-[12rem] md:text-[16rem] font-black text-transparent bg-clip-text bg-gradient-to-b from-slate-700 to-slate-900 leading-none select-none">
             404
           </h1>
           <div className="absolute inset-0 flex items-center justify-center">
             <span className="text-2xl md:text-3xl font-black uppercase tracking-[0.5em] text-blue-500 animate-pulse">Page Not Found</span>
           </div>
        </div>
        
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Something went wrong
        </h2>
        
        <p className="max-w-md mx-auto text-slate-400 text-lg mb-10 leading-relaxed">
          We couldn't find the page you were looking for. Let's get you back on track.
        </p>
        
        <div className="flex justify-center gap-6">
          <Link 
            to="/" 
            className="group relative px-8 py-4 bg-white text-slate-950 rounded-xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] flex items-center gap-3"
          >
             <Home size={18} className="text-blue-600" />
             Back to Home
             <div className="absolute inset-0 rounded-xl ring-2 ring-white/20 group-hover:ring-white/50 transition-all"></div>
          </Link>
        </div>
      </div>

      {/* Decorative Code Elements */}
      <div className="absolute bottom-10 left-10 text-[10px] font-mono text-slate-700 hidden md:block select-none">
         <p>{`> Error: 404`}</p>
         <p>{`> Status: Not Found`}</p>
         <p>{`> Action: Go Home`}</p>
      </div>
    </div>
  );
};

export default NotFound;
