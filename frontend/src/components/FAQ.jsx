import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Search, HelpCircle, MessageSquare, Zap, Cpu, ShieldCheck } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import SEO from "./SEO";

const FAQ = () => {
  const { isDarkMode } = useTheme();
  const [openIndex, setOpenIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const faqs = [
    {
      q: "What architectural services does Piedocx provide?",
      a: "We specialize in end-to-end digital architecture: full-stack MERN development, native mobile systems, high-performance UI/UX, and mission-critical cloud infrastructure.",
      icon: <Cpu className="text-blue-600" />
    },
    {
      q: "Are the industrial training nodes for students?",
      a: "Yes. Our Innovation Lab offers deep-dive industrial training focused on real-world artifacts. Students master MERN, Python, and Java through hands-on deployment.",
      icon: <Zap className="text-blue-500" />
    },
    {
      q: "Is cloud infrastructure secure and scalable?",
      a: "Security is our default DNA. We provide military-grade cloud hosting with 99.9% uptime, quantum-resilient SSL, and 24/7 terminal support.",
      icon: <ShieldCheck className="text-blue-600" />
    },
    {
      q: "What is your project deployment timeline?",
      a: "Timelines depend on complexity. Fast-track web artifacts take 1-2 weeks, while complex enterprise DASHBOARDS take 4-12 weeks under our agile orchestration.",
      icon: <HelpCircle className="text-blue-600" />
    }
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
    faq.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`min-h-screen pt-24 pb-20 px-6 transition-colors duration-500 ${isDarkMode ? "bg-dark-mesh text-white" : "bg-slate-50 text-slate-900"}`}>
      <SEO title="FAQ | Piedocx Architecture Lab" description="Find technical clarity in our architectural archive." />
      
      {/* Background Accents */}
      <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/10 text-blue-600 mb-6 text-[10px] font-black uppercase tracking-[0.4em]"
          >
            Terminal Access 2025
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-none mb-6"
          >
            Digital <span className="text-blue-600 underline decoration-blue-500/10 decoration-8 underline-offset-8">Clarity.</span>
          </motion.h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 font-medium italic border-l-4 border-blue-600 pl-8 max-w-2xl mx-auto">
            Find technical specifications and operational insights within our curated knowledge nodes.
          </p>
        </div>

        {/* Search Matrix */}
        <div className="relative mb-16">
          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-600">
             <Search size={24} />
          </div>
          <input 
            type="text" 
            placeholder="Search knowledge logs..." 
            className={`w-full pl-16 pr-6 py-6 rounded-[2rem] border-2 outline-none transition-all font-bold text-lg shadow-xl ${
                isDarkMode 
                ? "bg-slate-900 border-white/5 focus:border-blue-600/50 text-white" 
                : "bg-white border-blue-50 focus:border-blue-600/20 text-slate-900"
            }`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Knowledge Nodes */}
        <div className="space-y-6">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`rounded-[2.5rem] border overflow-hidden transition-all duration-300 ${
                    openIndex === i 
                    ? (isDarkMode ? 'bg-white/5 border-blue-600/50 shadow-[0_0_30px_rgba(37,99,235,0.1)]' : 'bg-white border-blue-600/50 shadow-2xl shadow-blue-600/5')
                    : (isDarkMode ? 'bg-slate-900/50 border-white/5 hover:border-blue-600/30' : 'bg-white border-slate-100 hover:border-blue-200')
                }`}
              >
                <button 
                  className="w-full px-8 py-7 flex items-center justify-between text-left"
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                >
                  <div className="flex items-center gap-6">
                     <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-50 dark:bg-white/5 shadow-inner`}>
                        {faq.icon}
                     </div>
                     <span className={`font-black text-lg uppercase italic tracking-tighter ${openIndex === i ? 'text-blue-600' : (isDarkMode ? 'text-white' : 'text-slate-800')}`}>
                       {faq.q}
                     </span>
                  </div>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${openIndex === i ? 'bg-blue-600 text-white rotate-180' : (isDarkMode ? 'bg-white/5 text-slate-500' : 'bg-slate-50 text-slate-400')}`}>
                     {openIndex === i ? <Minus size={18} /> : <Plus size={18} />}
                  </div>
                </button>
                
                <AnimatePresence>
                   {openIndex === i && (
                     <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-8 pb-8 text-slate-500 dark:text-slate-400 font-medium text-base leading-relaxed italic border-t border-blue-600/10 pt-6"
                     >
                       <p className="max-w-3xl">
                          {faq.a}
                       </p>
                     </motion.div>
                   )}
                </AnimatePresence>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-20 bg-slate-900/10 rounded-[3rem] border border-dashed border-slate-700">
               <HelpCircle size={48} className="mx-auto text-slate-700 mb-4 animate-pulse" />
               <p className="text-slate-500 font-black uppercase tracking-widest italic">No Knowledge Nodes Found</p>
            </div>
          )}
        </div>

        {/* Global Support Dispatch */}
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className={`mt-24 p-10 md:p-16 rounded-[4rem] flex flex-col items-center text-center relative overflow-hidden ${isDarkMode ? "bg-slate-900 border border-white/5 shadow-2xl shadow-blue-600/5" : "bg-white border border-slate-100 shadow-2xl shadow-black/5"}`}
        >
          <div className="absolute top-0 right-0 p-10 text-blue-600/5 rotate-12">
             <MessageSquare size={120} />
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4 uppercase italic tracking-tighter">Still Stuck in the <span className="text-blue-600">void?</span></h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium italic mb-10 max-w-md">Our lead architects are ready to assist you. Re-initiate connection via our terminal lines.</p>
          <a 
            href="mailto:info@piedocx.com" 
            className="group px-12 py-5 bg-blue-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/30 flex items-center gap-3"
          >
            Push Dispatch
            <Zap size={18} className="group-hover:scale-110 transition-transform" />
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQ;

