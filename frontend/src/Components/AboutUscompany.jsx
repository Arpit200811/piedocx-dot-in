import React, { useEffect } from "react"; // Ensure React is imported if missing in original which seems to be the case based on typical patterns, though previous view showed just useEffect
import SEO from "./SEO";
import AOS from "aos";
import "aos/dist/aos.css";
import { Link } from "react-router-dom";
import CountUp from "react-countup";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { 
  Users, 
  Rocket, 
  ShieldCheck, 
  Globe, 
  Cpu, 
  MessageSquareQuote,
  Sparkles,
  Search,
  PenTool,
  Terminal,
  Award,
  Trophy,
  Activity,
  Code2,
  Workflow,
  CheckCircle2,
  Layers,
  Zap,
  Boxes,
  Settings,
  Eye,
  Target,
  Heart,
  History
} from "lucide-react";

const AboutUsCompany = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const stats = [
    { label: "Elite Projects", value: 25, icon: <CheckCircle2 className="text-blue-500" /> },
    { label: "Engineers", value: 15, icon: <Users className="text-blue-500" /> },
    { label: "Global Nodes", value: 35, icon: <Globe className="text-blue-500" /> },
    { label: "Experience", value: 5, icon: <Cpu className="text-blue-500" />, suffix: "Yrs" },
  ];

  const processSteps = [
    { step: "01", title: "Discovery", desc: "Analyzing project DNA and strategic goals.", icon: <Search size={22} />, color: "text-blue-600", bg: "bg-blue-50" },
    { step: "02", title: "Architecting", desc: "Designing high-fidelity blueprints and logic.", icon: <PenTool size={22} />, color: "text-indigo-600", bg: "bg-indigo-50" },
    { step: "03", title: "Engineering", desc: "Translating logic into elite performance code.", icon: <Terminal size={22} />, color: "text-purple-600", bg: "bg-purple-50" },
    { step: "04", title: "Deployment", desc: "Launching future-ready digital artifacts.", icon: <Rocket size={22} />, color: "text-rose-600", bg: "bg-rose-50" }
  ];

  const techStack = [
    { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
    { name: "NodeJS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
    { name: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
    { name: "AWS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg" },
    { name: "MongoDB", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
    { name: "Docker", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
    { name: "PostgreSQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
    { name: "Go", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original-wordmark.svg" }
  ];

  const coreValues = [
    { icon: <Zap className="text-blue-600" />, title: "Velocity", desc: "Extreme speed in development without compromising on resilient quality." },
    { icon: <ShieldCheck className="text-indigo-600" />, title: "Integrity", desc: "Absolute transparency and security in every line of code we ship." },
    { icon: <Sparkles className="text-purple-600" />, title: "Innovation", desc: "Iterative design and thinking that stays 2 steps ahead of market trends." }
  ];

  return (
    <main className="bg-white selection:bg-blue-100 selection:text-blue-600 overflow-x-hidden font-sans">
      <SEO 
        title="About Piedocx - Our Story & Vision" 
        description="Learn about Piedocx Technologies, our journey, mission, and the team driving digital innovation in Lucknow."
      />
      
      {/* 1. Asymmetrical Command Header (Projects Style) */}
      <section className="relative pt-20 pb-10 md:pb-12 px-6 border-b border-slate-100 bg-slate-50/50 mt-6 overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 mb-4 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em]" data-aos="fade-right">
               Vibrant Engineering Lab
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter italic mb-3 md:mb-4 uppercase" data-aos="fade-up" data-aos-delay="100">
               Visualizing the <span className="text-blue-600 underline decoration-blue-100 decoration-8 underline-offset-8">Digital Energy.</span>
            </h1>
            <p className="max-w-2xl text-slate-500 font-medium text-sm md:text-base mb-6 md:mb-8 leading-relaxed" data-aos="fade-up" data-aos-delay="200">
               Colorful engineering fused with visionary design for high-growth global enterprises. We don't just build software; we architect interactive experiences.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4" data-aos="fade-up" data-aos-delay="300">
               <Link to="/contact" className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-slate-900/10">Start Project</Link>
               <div className="flex items-center gap-3 h-12 px-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Always Computing</span>
               </div>
            </div>
          </div>
        </div>
        
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-[50%] h-full bg-blue-600/[0.02] -skew-x-12 translate-x-1/2 pointer-events-none"></div>
      </section>

      {/* 2. Mission & Vision */}
      <section className="py-8 md:py-10 px-6 bg-white overflow-hidden border-b border-slate-100">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-6 md:gap-8 items-stretch">
           <div className="p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] bg-slate-50 border border-slate-100 group hover:border-blue-200 transition-all" data-aos="fade-right">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-600 text-white rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 shadow-lg group-hover:rotate-12 transition-transform">
                 <Target size={20} className="md:w-6 md:h-6" />
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-slate-900 uppercase italic tracking-tighter mb-3 md:mb-4">Our Mission.</h3>
              <p className="text-[13px] md:text-sm font-bold text-slate-500 italic leading-relaxed">
                 To build high-impact digital products that simplify complex business challenges and deliver extreme value through elite engineering standards.
              </p>
           </div>
           
           <div className="p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] bg-slate-900 text-white group hover:scale-[1.02] transition-all" data-aos="fade-left">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white/10 text-white border border-white/20 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 backdrop-blur-md group-hover:scale-110 transition-transform">
                 <Eye size={20} className="text-blue-400 md:w-6 md:h-6" />
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-white uppercase italic tracking-tighter mb-3 md:mb-4">Our Vision.</h3>
              <p className="text-[13px] md:text-sm font-bold text-slate-400 italic leading-relaxed">
                 To become the world's most vibrant hub of technological excellence, where "Piedocx" stands for resilient code and visionary product design.
              </p>
           </div>
        </div>
      </section>

      {/* 3. Global Impact */}
      <section className="py-10 md:py-12 px-6 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
           <div data-aos="fade-right">
              <h2 className="text-blue-600 font-black text-[10px] uppercase tracking-[0.4em] mb-3 italic">Step 05 // Global Impact</h2>
              <h3 className="text-3xl md:text-5xl font-black text-slate-900 leading-none mb-6 uppercase italic tracking-tighter">Our Cloud <span className="text-blue-600 underline decoration-blue-100 underline-offset-8">Nodes.</span></h3>
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, i) => (
                   <div key={i} className="p-5 rounded-3xl bg-slate-50 border border-slate-100 group flex flex-col items-center text-center hover:bg-white hover:border-blue-400 hover:shadow-xl transition-all">
                      <div className="mb-2 scale-110">{stat.icon}</div>
                      <h4 className="text-2xl font-black text-slate-900 mb-0.5 italic"><CountUp end={stat.value} duration={3} />{stat.suffix || "+"}</h4>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                   </div>
                 ))}
              </div>
           </div>
           <div className="relative h-64 md:h-72 bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] flex items-center justify-center overflow-hidden shadow-2xl" data-aos="fade-left">
              <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl"></div>
              <Globe size={90} className="text-blue-500 animate-spin-slow" />
              <div className="absolute bottom-6 flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/20 border border-blue-500/20 text-blue-400">
                 <Activity size={12} className="animate-pulse" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Network Active</span>
              </div>
           </div>
        </div>
      </section>

      {/* 4. Core Values */}
      <section className="py-10 md:py-12 px-6 bg-slate-50/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12" data-aos="fade-down">
            <h2 className="text-blue-600 font-black text-[10px] uppercase tracking-[0.4em] mb-2 italic">Step 09 // Core Values</h2>
            <h3 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase italic">The DNA of <span className="text-blue-600">Piedocx.</span></h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {coreValues.map((val, i) => (
              <div key={i} className="p-8 rounded-[2.5rem] bg-white border border-slate-100 hover:shadow-2xl transition-all text-center group" data-aos="fade-up" data-aos-delay={i * 100}>
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                   {val.icon}
                </div>
                <h4 className="text-xl font-black italic uppercase text-slate-900 mb-3">{val.title}</h4>
                <p className="text-xs font-bold text-slate-400 leading-relaxed italic">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Our Process */}
      <section className="py-10 md:py-12 px-6 bg-slate-50/50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10" data-aos="fade-down">
            <h2 className="text-blue-600 font-black text-[10px] uppercase tracking-[0.4em] mb-2 italic">Step 01 // Workflow</h2>
            <h3 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase italic">How We <span className="text-blue-600">Orchestrate.</span></h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {processSteps.map((step, i) => (
              <div key={i} className="flex flex-col items-center group bg-white p-6 rounded-[2.5rem] border border-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all" data-aos="fade-up" data-aos-delay={i * 100}>
                <div className={`w-16 h-16 rounded-2xl ${step.bg} ${step.color} shadow-lg flex items-center justify-center mb-5 group-hover:scale-110 transition-all`}>
                  {step.icon}
                </div>
                <h4 className="text-base font-black text-slate-900 mb-1 italic uppercase tracking-tight">{step.step}. {step.title}</h4>
                <p className="text-[11px] font-bold text-slate-400 italic text-center leading-snug">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Tech Stack Ecosystem */}
      <section className="py-10 md:py-12 px-6 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 items-center">
          <div className="lg:w-1/2" data-aos="fade-right">
             <h2 className="text-blue-600 font-black text-[10px] uppercase tracking-[0.4em] mb-2 italic">Step 02 // Tech Ecosystem</h2>
             <h3 className="text-2xl md:text-4xl font-black text-slate-900 leading-none mb-6 uppercase italic tracking-tighter">Coloring for <span className="text-blue-600">Scale.</span></h3>
             <div className="grid grid-cols-4 gap-4">
               {techStack.map((tech, i) => (
                 <div key={i} className="p-4 rounded-2xl bg-white border-2 border-slate-50 flex flex-col items-center group hover:border-blue-500 hover:shadow-xl transition-all">
                    <img 
                      src={tech.icon} 
                      alt={tech.name} 
                      className="w-10 h-10 mb-2 group-hover:scale-110 transition-all object-contain"
                      onError={(e) => { e.target.src = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg"; }}
                    />
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{tech.name}</span>
                 </div>
               ))}
             </div>
          </div>
          
          <div className="lg:w-1/2 grid grid-cols-2 gap-6" data-aos="fade-left">
             <div className="relative overflow-hidden aspect-square bg-gradient-to-br from-blue-600 to-blue-700 rounded-[2.5rem] p-8 text-white flex flex-col justify-end shadow-2xl transition-all hover:scale-[1.02] group">
                {/* Fixed animation position: Moved to Top Right to avoid text overlap */}
                <div className="absolute top-[-20%] right-[-10%] p-8 opacity-10 animate-spin-slow">
                   <Settings size={180} />
                </div>
                <div className="relative z-10">
                   <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md group-hover:rotate-12 transition-transform">
                      <Code2 size={24} />
                   </div>
                   <h4 className="text-xl font-black italic uppercase leading-none mb-3">Modular Codebase.</h4>
                   <ul className="text-[9px] font-black uppercase tracking-[0.1em] space-y-2 opacity-80">
                      <li className="flex items-center gap-2"><div className="w-1 h-1 bg-white rounded-full"></div> Micro-Services Ready</li>
                      <li className="flex items-center gap-2"><div className="w-1 h-1 bg-white rounded-full"></div> Component Architecture</li>
                      <li className="flex items-center gap-2"><div className="w-1 h-1 bg-white rounded-full"></div> Ultra Scalable Logic</li>
                   </ul>
                </div>
             </div>

             <div className="relative overflow-hidden aspect-square bg-gradient-to-br from-indigo-700 to-purple-800 rounded-[2.5rem] p-8 text-white flex flex-col justify-end shadow-2xl mt-8 transition-all hover:scale-[1.02] group">
                {/* Fixed animation position: Moved to Top Right to avoid text overlap */}
                <div className="absolute top-[-20%] right-[-10%] p-8 opacity-10 animate-pulse">
                   <Layers size={180} />
                </div>
                <div className="relative z-10 text-right md:text-left">
                   <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6 ml-auto md:ml-0 backdrop-blur-md group-hover:scale-110 transition-transform">
                      <Boxes size={24} className="text-blue-300" />
                   </div>
                   <h4 className="text-xl font-black italic uppercase leading-none mb-3">Systematic Ops.</h4>
                   <ul className="text-[9px] font-black uppercase tracking-[0.1em] space-y-2 opacity-80 inline-block text-left">
                      <li className="flex items-center gap-2"><div className="w-1 h-1 bg-blue-400 rounded-full"></div> Automated CI/CD</li>
                      <li className="flex items-center gap-2"><div className="w-1 h-1 bg-blue-400 rounded-full"></div> Security Shielding</li>
                      <li className="flex items-center gap-2"><div className="w-1 h-1 bg-blue-400 rounded-full"></div> 99.9% Uptime SLA</li>
                   </ul>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 7. CEO Vision */}
      <section className="py-10 md:py-12 px-6 bg-slate-900 overflow-hidden relative border-t border-white/5">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 relative z-10">
          <div className="lg:w-[35%] flex justify-center" data-aos="zoom-in">
             <div className="p-1.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-[3rem] shadow-2xl relative inline-block">
                <img src="/Savanrai.jpg" alt="CEO" className="w-64 h-80 object-cover object-top rounded-[2.5rem] border border-white/10" />
                <div className="absolute -bottom-4 -right-4 bg-white text-blue-600 w-14 h-14 rounded-[1.5rem] flex items-center justify-center shadow-xl">
                   <MessageSquareQuote size={28} />
                </div>
             </div>
          </div>
          <div className="lg:w-[65%] text-white text-center lg:text-left" data-aos="fade-left">
             <h2 className="text-blue-500 font-black text-[10px] uppercase tracking-[0.4em] mb-3 italic">Step 04 // Visionary Note</h2>
             <h3 className="text-3xl md:text-6xl font-black text-white leading-tight mb-8 tracking-tighter italic uppercase">"Code is the <span className="text-blue-500">Paint</span>, <br /> Logic is the <span className="text-white/20">Canvas.</span>"</h3>
             <div className="flex flex-col lg:flex-row items-center gap-6 justify-center lg:justify-start">
                <div>
                   <p className="text-2xl font-black italic tracking-tighter uppercase mb-0.5 text-white">Savan Rai</p>
                   <p className="text-[9px] font-black uppercase text-blue-500 tracking-[0.3em]">CEO & Founding Architect</p>
                </div>
                <div className="h-[2px] w-14 bg-blue-600 rounded-full hidden lg:block"></div>
                <p className="font-['Charm'] text-2xl text-white/30 -rotate-6">SavanRai_</p>
             </div>
          </div>
        </div>
      </section>

      {/* 8. Awards */}
      <section className="py-8 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
           <div className="flex flex-wrap justify-center md:justify-between items-center gap-8 opacity-60 hover:opacity-100 transition-all">
              {[
                { icon: <Award className="text-blue-600" />, text: "Top Engineering Lab" },
                { icon: <Trophy className="text-blue-600" />, text: "Security Certified" },
                { icon: <ShieldCheck className="text-blue-600" />, text: "Cloud Excellence" },
                { icon: <Award className="text-blue-600" />, text: "Startup Catalyst" }
              ].map((award, i) => (
                <div key={i} className="flex items-center gap-2.5">
                   <div className="p-1.5 bg-slate-50 rounded-lg">{award.icon}</div>
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-800">{award.text}</span>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* 9. Life At Lab */}
      <section className="py-10 md:py-12 px-6 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10" data-aos="fade-up">
            <h2 className="text-blue-600 font-black text-[10px] uppercase tracking-[0.4em] mb-2 italic">Step 07 // The Culture</h2>
            <h3 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter italic uppercase">Technicolor <span className="text-blue-600">Genius.</span></h3>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80",
              "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80",
              "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80",
              "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80"
            ].map((img, i) => (
              <div key={i} className="relative aspect-square rounded-[2.5rem] overflow-hidden group shadow-lg border-2 border-slate-50" data-aos="zoom-in" data-aos-delay={i * 100}>
                 <img src={img} alt="Lab Life" className="w-full h-full object-cover object-center transition-all duration-1000 group-hover:scale-110" />
                 <div className="absolute inset-0 bg-gradient-to-t from-blue-600/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end text-center">
                    <p className="text-white text-[9px] font-black uppercase tracking-widest italic leading-none">Technicolor Node 0{i+1}</p>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. Final CTA (Blueprint Style) */}
      <section className="py-10 md:py-14 px-6 max-w-6xl mx-auto overflow-hidden">
         <div className="relative rounded-[2.5rem] md:rounded-[3.5rem] bg-slate-900 p-6 md:p-12 flex flex-col lg:flex-row gap-10 text-white shadow-2xl overflow-hidden group">
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_20%,rgba(37,99,235,0.08),transparent)] pointer-events-none"></div>
            
            <div className="lg:w-1/2 relative z-10">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 border border-blue-600/20 text-blue-500 mb-5 md:mb-6 text-[9px] font-black uppercase tracking-[0.3em]">
                  Mission Ready
               </div>
               <h2 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter leading-tight mb-5">READY FOR THE <span className="text-blue-600">COLORFUL BREAKTHROUGH?</span></h2>
               <p className="text-slate-400 text-xs md:text-sm font-medium leading-relaxed max-w-sm mb-6 md:mb-8 italic">Architect your future with vibrant precision. Let's build the extraordinary digital artifact together.</p>
               
               <div className="flex flex-col gap-4 mb-4">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400">
                        <Rocket size={14} />
                     </div>
                     <div>
                        <p className="text-[9px] font-black uppercase text-slate-600 tracking-widest">Global Reach</p>
                        <p className="text-sm font-black italic">Active Nodes Across 5 Continents</p>
                     </div>
                  </div>
               </div>
            </div>

            <div className="lg:w-1/2 relative z-10 flex items-center justify-center">
               <Link to="/contact" className="w-full max-w-xs bg-blue-600 text-white font-black py-4 md:py-5 rounded-[2rem] hover:bg-blue-700 transition shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3 uppercase text-[10px] md:text-xs tracking-widest group/btn text-center">
                  Initiate MISSION
                  <Zap size={18} className="group-hover/btn:scale-110 transition-transform" />
               </Link>
            </div>
         </div>
      </section>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Charm:wght@400;700&display=swap');
        .animate-spin-slow { animation: spin 20s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-bounce-slow { animation: bounce 4s ease-in-out infinite; }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
      `}</style>

    </main>
  );
};

export default AboutUsCompany;
