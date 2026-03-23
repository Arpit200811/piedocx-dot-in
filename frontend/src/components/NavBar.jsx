import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { useTheme } from "../context/ThemeContext";
import { Sun, Moon, Search, LogOut, ChevronDown, Monitor, Smartphone, Globe, Palette, Server, Layout } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NavBar = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const [showNav, setShowNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [hasBeenHidden, setHasBeenHidden] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [studentUser, setStudentUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const data = localStorage.getItem('studentData');
    if (data) {
      setStudentUser(JSON.parse(data));
    } else {
      setStudentUser(null);
    }
  }, [location]);

  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You will be logged out of your session.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Logout'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('studentToken');
        localStorage.removeItem('studentData');
        setStudentUser(null);
        Swal.fire({
          title: 'Logged Out!',
          text: 'You have been successfully logged out.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          navigate('/student-login');
        });
      }
    });
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services", hasMega: true },
    { name: "Projects", path: "/projects" },
    { name: "Our Team", path: "/team" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const serviceNodes = [
    { name: "Full-Stack Dev", path: "/services/full-stack", icon: <Layout className="w-5 h-5" />, desc: "High-fidelity MERN applications." },
    { name: "Mobile Systems", path: "/services/android-ios", icon: <Smartphone className="w-5 h-5" />, desc: "Native iOS & Android hubs." },
    { name: "Cloud Labs", path: "/services/domain-web-hosting", icon: <Server className="w-5 h-5" />, desc: "Scalable infrastructure." },
    { name: "Visual Identity", path: "/services/graphic-design", icon: <Palette className="w-5 h-5" />, desc: "Strategic design nodes." },
    { name: "SEO Protocols", path: "/services/digital-marketing", icon: <Globe className="w-5 h-5" />, desc: "Digital growth logic." },
    { name: "Web Genesis", path: "/services/web-development", icon: <Monitor className="w-5 h-5" />, desc: "Performant web artifacts." },
  ];

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (isLocked) {
        setLastScrollY(currentScrollY);
        return;
      }
      const scrollDiff = currentScrollY - lastScrollY;

      if (currentScrollY <= 5) {
        setShowNav(true);
        setHasBeenHidden(false);
      } else if (scrollDiff > 15 && currentScrollY > 5 && !isOpen) {
        setShowNav(false);
        setHasBeenHidden(true);
        setIsOpen(false); 
      } else if (scrollDiff < -15 && currentScrollY >= 40 && hasBeenHidden) {
        setShowNav(true);
        setIsLocked(true);
      }
      setLastScrollY(currentScrollY);
    };
    
    // Increased tolerance to 50px to prevent accidental closures on mobile touch movements
    const handleMenuCloseOnScroll = () => { 
      if (isOpen && Math.abs(window.scrollY - lastScrollY) > 50) {
        setIsOpen(false); 
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("scroll", handleMenuCloseOnScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scroll", handleMenuCloseOnScroll);
    };
  }, [lastScrollY, isLocked, hasBeenHidden, isOpen]);

  useEffect(() => { setIsOpen(false); setIsMegaMenuOpen(false); }, [location.pathname]);

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-[100] border-b transition-all duration-500 ease-in-out ${
          isDarkMode 
            ? "bg-slate-900/80 border-white/10" 
            : "bg-white/80 border-gray-200"
        } backdrop-blur-xl ${showNav ? "translate-y-0" : "-translate-y-full"}`}
      >
        <div className="max-w-screen-2xl mx-auto px-4 md:px-8 h-14 md:h-20 flex items-center justify-between font-sans relative">
          <Link to="/" className="flex items-center gap-2 flex-shrink-0 group">
            <div className="relative">
               <div className="absolute inset-0 bg-blue-600/20 blur-xl rounded-full scale-0 group-hover:scale-150 transition-transform"></div>
               <img src="/pie_logo.png" alt="Logo" className={`h-10 sm:h-12 md:h-16 lg:h-20 w-auto object-contain relative z-10 ${isDarkMode ? "brightness-110 contrast-125" : "mix-blend-multiply"}`} />
            </div>
           
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden lg:flex gap-8 items-center justify-center flex-1 px-8">
            {navLinks.map(({ name, path, hasMega }) => (
              <li 
                key={path} 
                className="relative group py-6"
                onMouseEnter={() => hasMega && setIsMegaMenuOpen(true)}
                onMouseLeave={() => hasMega && setIsMegaMenuOpen(false)}
              >
                <Link
                  to={path}
                  className={`text-sm font-black uppercase tracking-widest transition-all ${
                    isActive(path) 
                      ? "text-blue-600" 
                      : isDarkMode ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-blue-600"
                  } flex items-center gap-1.5`}
                >
                  {name}
                  {hasMega && <ChevronDown size={14} className={`transition-transform duration-300 ${isMegaMenuOpen ? "rotate-180" : ""}`} />}
                </Link>
                <span className={`absolute left-0 bottom-6 h-0.5 bg-blue-600 transition-all duration-300 ${isActive(path) ? "w-full" : "w-0 group-hover:w-full"}`}></span>
                
                {/* Mega Menu Portal */}
                {hasMega && (
                  <AnimatePresence>
                    {isMegaMenuOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className={`absolute top-full left-1/2 -translate-x-1/2 w-[600px] p-8 rounded-[2.5rem] shadow-2xl border ${
                          isDarkMode ? "bg-slate-900 border-white/10" : "bg-white border-slate-100"
                        }`}
                      >
                         <div className="grid grid-cols-2 gap-4">
                            {serviceNodes.map((node, i) => (
                              <Link 
                                key={i} 
                                to={node.path} 
                                className={`p-4 rounded-3xl flex items-start gap-4 transition-all ${
                                  isDarkMode ? "hover:bg-white/5" : "hover:bg-blue-50"
                                } group/node`}
                              >
                                 <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                                    isDarkMode ? "bg-slate-800 text-blue-400 group-hover/node:bg-blue-600 group-hover/node:text-white" : "bg-blue-50 text-blue-600 group-hover/node:bg-blue-600 group-hover/node:text-white"
                                 }`}>
                                    {node.icon}
                                 </div>
                                 <div>
                                    <h4 className={`text-xs font-black uppercase tracking-widest mb-1 ${isDarkMode ? "text-white" : "text-slate-900"}`}>{node.name}</h4>
                                    <p className="text-[10px] font-medium text-slate-500">{node.desc}</p>
                                 </div>
                              </Link>
                            ))}
                         </div>
                         <div className={`mt-6 pt-6 border-t ${isDarkMode ? "border-white/5" : "border-slate-50"} flex justify-between items-center`}>
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 italic">Ready to scale your architecture?</p>
                            <Link to="/contact" className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:underline">Consult an Architect →</Link>
                         </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all border ${
                  isDarkMode 
                  ? "bg-slate-800 border-white/10 text-yellow-500 hover:bg-slate-700" 
                  : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Search */}
            <button
              onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))}
              className={`hidden sm:flex items-center gap-2 px-4 h-10 rounded-full border transition-all text-sm font-black uppercase tracking-widest ${
                  isDarkMode 
                  ? "bg-slate-800 border-white/10 text-slate-400 hover:text-white" 
                  : "bg-slate-50 border-slate-200 text-slate-500 hover:text-blue-600"
              }`}
            >
              <Search size={16} /> <span className="text-[10px]">Matrix Search</span>
            </button>

            {studentUser ? (
              <div className={`flex items-center gap-3 p-1 rounded-full border ${isDarkMode ? "bg-slate-800 border-white/10" : "bg-blue-50 border-blue-100"}`}>
                <Link to="/student-dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-black text-xs shadow-lg shadow-blue-600/20">
                    {studentUser.firstName?.[0] || 'S'}
                  </div>
                  <span className={`hidden md:block text-[10px] font-black uppercase tracking-widest ${isDarkMode ? "text-white" : "text-slate-700"}`}>
                    {studentUser.firstName}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-red-500 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link
                  to="/student-login"
                  className={`px-6 h-10 flex items-center rounded-full border text-[10px] font-black uppercase tracking-widest transition-all ${
                      isDarkMode 
                      ? "border-white/10 text-white hover:bg-white/5" 
                      : "border-blue-600 text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  Access Hub
                </Link>
                <Link
                  to="/student-registration"
                  className="px-6 h-10 flex items-center rounded-full bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-0.5 transition-all"
                >
                  Register Node
                </Link>
              </div>
            )}

            {/* Hamburger Mobile */}
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className={`lg:hidden w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full transition-colors ${
                isOpen 
                  ? "bg-red-500/10 text-red-500" 
                  : isDarkMode ? "text-white hover:bg-white/5" : "text-slate-900 hover:bg-slate-100"
              }`}
              aria-label="Toggle Menu"
            >
              {isOpen ? (
                <motion.div
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  className="relative z-50"
                >
                  <LogOut className="rotate-45" size={24} />
                </motion.div>
              ) : (
                <div className="space-y-1.5 relative z-50">
                  <div className="w-6 h-0.5 bg-current transition-all"></div>
                  <div className="w-4 h-0.5 bg-current ml-auto transition-all"></div>
                </div>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Nav Overlay moved outside nav but inside fragment to avoid filter conflicts */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={`lg:hidden fixed inset-0 top-14 z-[1000] overflow-y-auto ${isDarkMode ? "bg-slate-950/98" : "bg-white/98"} backdrop-blur-xl border-t ${isDarkMode ? "border-white/10" : "border-slate-100"}`}
          >
             <div className="p-6 space-y-4">
                {navLinks.map(({ name, path }) => (
                  <Link 
                    key={path} 
                    to={path} 
                    className={`block py-3 px-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] ${
                        isActive(path) 
                        ? "bg-blue-600 text-white" 
                        : isDarkMode ? "text-slate-400 hover:bg-white/5" : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {name}
                  </Link>
                ))}
                
                {!studentUser && (
                   <div className="grid grid-cols-2 gap-4 pt-4">
                      <Link to="/student-login" className={`h-12 flex items-center justify-center rounded-2xl border text-[10px] font-black uppercase tracking-widest ${isDarkMode ? "border-white/10 text-white" : "border-blue-600 text-blue-600"}`}>Log In</Link>
                      <Link to="/student-registration" className="h-12 flex items-center justify-center rounded-2xl bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-600/20">Register</Link>
                   </div>
                )}
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavBar;

