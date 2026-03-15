import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Command, X, ArrowRight, Zap, Terminal } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

function GlobalSearch({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  
  const links = [
    { title: 'Home', path: '/', category: 'Page' },
    { title: 'Services', path: '/services', category: 'Page' },
    { title: 'Projects', path: '/projects', category: 'Page' },
    { title: 'Contact', path: '/contact', category: 'Page' },
    { title: 'About Us', path: '/about', category: 'Page' },
    { title: 'Careers', path: '/careers', category: 'Page' },
    { title: 'Full-Stack Dev', path: '/services/full-stack', category: 'Service' },
    { title: 'Mobile Systems', path: '/services/android-ios', category: 'Service' },
    { title: 'IoT Systems', path: '/services/iot', category: 'Service' },
    { title: 'AI & ML', path: '/services/ai-ml', category: 'Service' },
    { title: 'Web Development', path: '/services/web-development', category: 'Service' },
    { title: 'Cloud Infrastructure', path: '/services/domain-web-hosting', category: 'Service' },
    { title: 'Digital Marketing', path: '/services/digital-marketing', category: 'Service' },
    { title: 'Custom Software', path: '/services/custom-software', category: 'Service' },
  ];

  const filteredLinks = links.filter(link => 
    link.title.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-900/80 backdrop-blur-sm flex items-start justify-center pt-[15vh] px-4 animate-in fade-in duration-200">
      <div className={`w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-50 duration-200 border ${isDarkMode ? "bg-slate-900 border-white/10" : "bg-white border-slate-200"}`}>
        <div className={`relative border-b flex items-center px-4 py-4 ${isDarkMode ? "border-white/5" : "border-slate-100"}`}>
          <Search className="w-5 h-5 text-slate-400 mr-3" />
          <input
            autoFocus
            type="text"
            placeholder="Search documentation, projects, or pages..."
            className={`w-full bg-transparent text-lg font-medium placeholder-slate-500 focus:outline-none ${isDarkMode ? "text-white" : "text-slate-800"}`}
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <button onClick={onClose} className={`p-1 rounded-lg transition-colors ${isDarkMode ? "hover:bg-white/5" : "hover:bg-slate-100"}`}>
            <div className={`text-xs font-bold px-2 py-1 rounded border ${isDarkMode ? "text-slate-400 border-white/10 bg-white/5" : "text-slate-400 border-slate-200 bg-slate-50"}`}>ESC</div>
          </button>
        </div>
        
        <div className={`max-h-[60vh] overflow-y-auto p-2 ${isDarkMode ? "bg-slate-900/50" : "bg-slate-50/50"}`}>
           {query === '' && (
              <div className="p-4">
                 <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Suggested</h4>
                 <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => { navigate('/services'); onClose(); }} className={`flex items-center gap-3 p-3 rounded-xl border transition-all group text-left ${isDarkMode ? "bg-slate-800 border-white/10 hover:border-blue-500/50" : "bg-white border-slate-100 hover:border-blue-500/30"}`}>
                       <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors"><Zap size={16} /></div>
                       <div>
                          <p className={`text-sm font-bold group-hover:text-blue-600 transition-colors ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}>Services</p>
                          <p className="text-[10px] text-slate-500">View our tech stack</p>
                       </div>
                    </button>
                    <button onClick={() => { navigate('/projects'); onClose(); }} className={`flex items-center gap-3 p-3 rounded-xl border transition-all group text-left ${isDarkMode ? "bg-slate-800 border-white/10 hover:border-blue-500/50" : "bg-white border-slate-100 hover:border-blue-500/30"}`}>
                       <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors"><Terminal size={16} /></div>
                       <div>
                          <p className={`text-sm font-bold group-hover:text-blue-600 transition-colors ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}>Case Studies</p>
                          <p className="text-[10px] text-slate-500">See recent work</p>
                       </div>
                    </button>
                 </div>
              </div>
           )}

           {filteredLinks.length > 0 ? (
             <div className="space-y-1">
               {filteredLinks.map((link, i) => (
                 <button
                   key={i}
                   onClick={() => { navigate(link.path); onClose(); }}
                   className={`w-full flex items-center justify-between p-3 rounded-xl hover:bg-blue-600 hover:text-white group transition-colors text-left ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}
                 >
                   <div className="flex items-center gap-3">
                     <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${isDarkMode ? "bg-white/5 text-slate-400 group-hover:bg-white/20 group-hover:text-white" : "bg-slate-200 text-slate-600 group-hover:bg-white/20 group-hover:text-white"}`}>{link.category}</span>
                     <span className="font-medium group-hover:text-white transition-colors">{link.title}</span>
                   </div>
                   <ArrowRight size={16} className="text-slate-500 group-hover:text-white opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                 </button>
               ))}
             </div>
           ) : (
             <div className="p-8 text-center">
                <p className="text-slate-500">No results found for "{query}"</p>
             </div>
           )}
        </div>
        
        <div className={`border-t px-4 py-2 flex items-center justify-between text-[10px] font-medium ${isDarkMode ? "bg-slate-900 border-white/5 text-slate-500" : "bg-slate-50 border-slate-100 text-slate-400"}`}>
           <div className="flex items-center gap-4">
              <span className="flex items-center gap-1"><Command size={10} /> + K to open</span>
              <span className="flex items-center gap-1">ESC to close</span>
           </div>
           <div className="tracking-widest uppercase font-black">Architecture Lab_</div>
        </div>
      </div>
    </div>
  );
}

export default GlobalSearch;
