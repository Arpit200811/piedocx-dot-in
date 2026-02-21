import React, { Suspense, useEffect, useState } from "react";
import { HashRouter } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import "./App.css";

// Context
import { StudentAuthProvider } from "./context/StudentAuthContext";

// components
import GlobalSearch from "./components/GlobalSearch";
import ErrorBoundary from "./components/ErrorBoundary";
import SEO from "./components/SEO";
import MainRouter from "./routes/MainRouter";

// Loading Component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-slate-50 relative overflow-hidden">
    {/* Animated Background Gradients */}
    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[100px] opacity-60 animate-pulse"></div>
    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-[100px] opacity-60 animate-pulse" style={{ animationDelay: '1s' }}></div>

    <div className="flex flex-col items-center gap-8 relative z-10">
      <div className="relative">
        <div className="w-24 h-24 rounded-full border-4 border-blue-600/10 border-t-blue-600 animate-spin transition-all duration-700"></div>
        <div className="absolute top-2 left-2 w-20 h-20 rounded-full border-4 border-indigo-600/10 border-b-indigo-600 animate-spin-reverse transition-all duration-700"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-blue-600 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.6)] animate-pulse"></div>
      </div>

      <div className="flex flex-col items-center">
        <h2 className="text-2xl font-black tracking-tighter text-slate-900 mb-1">
          PIEDOCX<span className="text-blue-600">.</span>
        </h2>
        <div className="flex items-center gap-2">
          <span className="h-1 w-1 bg-blue-600 rounded-full animate-bounce"></span>
          <span className="h-1 w-1 bg-blue-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
          <span className="h-1 w-1 bg-blue-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 ml-1">Architecting Innovation</p>
        </div>
      </div>
    </div>

    <style>{`
      @keyframes spin-reverse {
        from { transform: rotate(0deg); }
        to { transform: rotate(-360deg); }
      }
      .animate-spin-reverse {
        animation: spin-reverse 1.5s linear infinite;
      }
    `}</style>
  </div>
);

function App() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      easing: "ease-out-cubic",
      mirror: false,
    });
  }, []);

  return (
    <StudentAuthProvider>
      <HashRouter>
        <SEO />
        <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        <div className="overflow-x-hidden min-h-screen flex flex-col">
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <MainRouter />
            </Suspense>
          </ErrorBoundary>
        </div>
      </HashRouter>
    </StudentAuthProvider>
  );
}

export default App;

