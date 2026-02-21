import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { base_url } from "../utils/info";
import { 
  Facebook, 
  Linkedin, 
  Instagram, 
  Twitter, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowRight, 
  ShieldCheck, 
  Globe2, 
  Send
} from "lucide-react";

const Footer = () => {
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    if (clickCount >= 15) {
      setClickCount(0);
      window.open("/developer", "_blank");
    }
  }, [clickCount]);

  const handleSecretClick = () => {
    setClickCount((prev) => prev + 1);
  };

  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    try {
      await axios.post(`${base_url}/api/users/user`, { email, source: 'newsletter' });
      setStatus("Subscribed!");
      setEmail("");
    } catch (err) {
      setStatus("Error.");
    } finally {
      setSubmitting(false);
      setTimeout(() => setStatus(""), 3000);
    }
  };

  const footerLinks = {
    company: [
      { name: 'About Us', link: '/about' },
      { name: 'Our Team', link: '/team' },
      { name: 'Key Projects', link: '/projects' },
      { name: 'Contact Center', link: '/contact' },
      { name: 'Knowledge Base', link: '/faq' }
    ],
    specialties: [
      { name: 'Full-Stack Dev', link: '/services/full-stack' },
      { name: 'Mobile Systems', link: '/services/android-ios' },
      { name: 'Digital Growth', link: '/services/digital-marketing' },
      { name: 'Visual Design', link: '/services/graphic-design' },
      { name: 'Cloud Infrastructure', link: '/services/domain-web-hosting' }
    ],
    technologies: [
      { name: 'MERN Stack', link: '/aboutus1/mern' },
      { name: 'Python & AI', link: '/aboutus1/python' },
      { name: 'Laravel / PHP', link: '/aboutus1/php-core' },
      { name: 'Flutter Native', link: '/aboutus1/flutter-kotlin' },
      { name: 'Advance Java', link: '/aboutus1/advance-java' }
    ]
  };

  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-20 pb-8 overflow-hidden font-sans">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
      </div>

      <div className="mx-auto max-w-7xl px-6 md:px-8 relative z-10">
        
        {/* Top Grid: Brand & Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-white/10">
          
          {/* Brand Column - Enhanced */}
          <div className="lg:col-span-4 pr-0 lg:pr-8">
            <Link to="/" className="inline-flex items-center gap-3 mb-8 group">
               <div className="relative">
                  <div className="absolute inset-0 bg-blue-600/20 rounded-2xl blur-xl group-hover:bg-blue-600/30 transition-all"></div>
                  <img src="/pie_logo.png" alt="Piedocx Logo" className="relative w-14 h-14 object-contain" />
               </div>
               <div>
                  <h2 className="text-2xl font-black tracking-tighter text-white">
                    PIEDOCX<span className="text-blue-400">.</span>
                  </h2>
                  <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-slate-500">TECHNOLOGIES PVT LTD</p>
               </div>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-8 font-medium">
              Engineering the future through elite tech stacks, visionary design, and mission-critical digital infrastructure.
            </p>
            
            {/* Newsletter - Dark Premium */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5">
               <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center">
                     <Send size={14} className="text-blue-400" />
                  </div>
                  <p className="text-xs font-black uppercase tracking-widest text-white">Stay Updated</p>
               </div>
               <form onSubmit={handleSubscribe} className="relative group">
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={status || "Enter your email"} 
                    className="w-full bg-white/10 border border-white/20 rounded-xl py-3 px-4 pr-12 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-white placeholder:text-slate-500"
                    required
                  />
                  <button type="submit" disabled={submitting} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 disabled:bg-slate-600 flex items-center justify-center">
                     <ArrowRight size={14} />
                  </button>
               </form>
            </div>
          </div>

          {/* Links Column 1 */}
          <div className="lg:col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
               <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
               <h4 className="text-xs font-black uppercase tracking-widest text-white">Quick Links</h4>
            </div>
            <ul className="space-y-3">
              {footerLinks.company.map((item) => (
                <li key={item.name}>
                  <Link to={item.link} className="text-slate-400 hover:text-blue-400 transition-colors text-sm font-semibold flex items-center group">
                    <ArrowRight size={12} className="mr-2 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all text-blue-400" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links Column 2 */}
          <div className="lg:col-span-3 md:col-span-1">
             <div className="flex items-center gap-2 mb-6">
                <div className="w-1 h-4 bg-purple-600 rounded-full"></div>
                <h4 className="text-xs font-black uppercase tracking-widest text-white">Our Services</h4>
             </div>
             <ul className="space-y-3">
               {footerLinks.specialties.map((item) => (
                 <li key={item.name}>
                   <Link to={item.link} className="text-slate-400 hover:text-purple-400 transition-colors text-sm font-semibold flex items-center group">
                     <ArrowRight size={12} className="mr-2 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all text-purple-400" />
                     {item.name}
                   </Link>
                 </li>
               ))}
             </ul>
          </div>

          {/* Contact Column - Enhanced */}
          <div className="lg:col-span-3">
            <div className="flex items-center gap-2 mb-6">
               <div className="w-1 h-4 bg-emerald-600 rounded-full"></div>
               <h4 className="text-xs font-black uppercase tracking-widest text-white">Contact Us</h4>
            </div>
            <div className="space-y-4">
                <div className="flex items-start gap-3 group">
                   <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 group-hover:bg-blue-600/20 group-hover:border-blue-500/30 group-hover:text-blue-400 transition-all">
                      <Phone size={16} />
                   </div>
                   <div>
                      <p className="text-[9px] font-bold uppercase text-slate-500 tracking-widest mb-1">Phone</p>
                      <div className="flex flex-col gap-1">
                        <Link to="tel:+916307503700" className="text-sm font-bold text-slate-300 hover:text-blue-400 transition-colors">+91 6307503700</Link>
                        <Link to="tel:+918114247881" className="text-sm font-bold text-slate-300 hover:text-blue-400 transition-colors">+91 8114247881</Link>
                      </div>
                   </div>
                </div>

                <div className="flex items-start gap-3 group">
                   <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 group-hover:bg-purple-600/20 group-hover:border-purple-500/30 group-hover:text-purple-400 transition-all">
                      <Mail size={16} />
                   </div>
                   <div>
                      <p className="text-[9px] font-bold uppercase text-slate-500 tracking-widest mb-1">Email</p>
                      <Link to="mailto:info@piedocx.com" className="text-sm font-bold text-slate-300 hover:text-purple-400 transition-colors">info@piedocx.com</Link>
                   </div>
                </div>

                <div className="flex items-start gap-3 group">
                   <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 group-hover:bg-emerald-600/20 group-hover:border-emerald-500/30 group-hover:text-emerald-400 transition-all">
                      <MapPin size={16} />
                   </div>
                   <div>
                      <p className="text-[9px] font-bold uppercase text-slate-500 tracking-widest mb-1">Address</p>
                      <p className="text-xs font-bold text-slate-400 leading-relaxed max-w-[220px]">Plot No. 5 Sector New E Aliganj, Chandralok Colony Near Purania Chauraha, Lucknow-226024</p>
                   </div>
                </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar - Enhanced */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
             <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-blue-400" />
                <p className="text-slate-500 text-xs font-bold">© 2025 Piedocx Technologies.</p>
             </div>
             <div className="flex gap-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
                <Link to="/privacy-policy" className="hover:text-blue-400 transition-colors flex items-center gap-1">
                   <span className="w-1 h-1 rounded-full bg-blue-400"></span>
                   Privacy
                </Link>
                <Link to="/terms-conditions" className="hover:text-purple-400 transition-colors flex items-center gap-1">
                   <span className="w-1 h-1 rounded-full bg-purple-400"></span>
                   Terms
                </Link>
                <Link to="/refund-policy" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                   <span className="w-1 h-1 rounded-full bg-emerald-400"></span>
                   Refunds
                </Link>
             </div>
          </div>

          <div className="flex gap-3">
             {[
               { icon: <Linkedin size={16} />, link: "https://www.linkedin.com/company/piedocx", color: "blue" },
               { icon: <Instagram size={16} />, link: "https://www.instagram.com/piedocx", color: "pink" },
               { icon: <Twitter size={16} />, link: "https://www.twitter.com/piedocx", color: "sky" },
               { icon: <Youtube size={16} />, link: "https://www.youtube.com/@piedocx", color: "red" }
             ].map((social, i) => (
               <Link 
                 key={i} 
                 to={social.link} 
                 target="_blank" 
                 className={`w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:bg-${social.color}-600/20 hover:border-${social.color}-500/30 hover:text-${social.color}-400 hover:shadow-lg hover:shadow-${social.color}-600/20 transition-all hover:scale-110`}
               >
                 {social.icon}
               </Link>
             ))}
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
