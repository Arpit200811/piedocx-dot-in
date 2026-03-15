import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Code2, 
  Rocket, 
  Terminal, 
  Cpu, 
  Zap, 
  CheckCircle2, 
  Globe, 
  Plus, 
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Workflow
} from "lucide-react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import SEO from "./SEO";

const Careers = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const openings = [
    {
      id: "node-01",
      title: "Senior Web Architect",
      type: "Full-Stack Node",
      stack: ["React", "Node.js", "Redis"],
      desc: "Architecting high-performance MERN ecosystems for global enterprise nodes.",
      icon: <Code2 className="text-blue-600" />
    },
    {
      id: "node-02",
      title: "Mobile System Engineer",
      type: "Cross-Platform",
      stack: ["Flutter", "Dart", "Firebase"],
      desc: "Building mission-critical iOS and Android artifacts with native precision.",
      icon: <Cpu className="text-blue-500" />
    },
    {
      id: "node-03",
      title: "UI/UX Orchestrator",
      type: "Visual Logic",
      stack: ["Figma", "Tailwind", "Framer"],
      desc: "Translating complex user journeys into high-fidelity digital blueprints.",
      icon: <Sparkles className="text-blue-600" />
    }
  ];

  const benefits = [
    { name: "Extreme Growth", desc: "Scale your skills in our high-velocity Innovation Lab.", icon: <Rocket size={20} /> },
    { name: "Node Flexibility", desc: "Collaborate from anywhere with our decentralized workflow.", icon: <Globe size={20} /> },
    { name: "Elite Hardware", desc: "Provisioned with the highest-tier terminal equipment.", icon: <Terminal size={20} /> }
  ];

  return (
    <main className="bg-white font-sans selection:bg-blue-600 selection:text-white pt-24 overflow-x-hidden">
      <SEO 
        title="Careers | Piedocx Architecture Lab" 
        description="Join our elite engineering squad. We're looking for architects, engineers, and visionaries to build the future."
      />

      {/* 1. Hero: Talent Node Activation */}
      <section className="relative px-6 py-12 md:py-24 overflow-hidden border-b border-slate-100">
        <div className="absolute top-0 right-0 w-[40%] h-full bg-blue-600/[0.03] -skew-x-12 translate-x-1/2 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 mb-6 text-[10px] font-black uppercase tracking-[0.4em]"
            >
              Protocol: Talent Acquisition 2025_
            </motion.div>
            <h1 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter italic uppercase leading-[0.8] mb-8" data-aos="fade-up">
              Join the <br /> <span className="text-blue-600 underline decoration-blue-500/10 decoration-8 underline-offset-8">Squad.</span>
            </h1>
            <p className="text-lg text-slate-500 font-medium italic border-l-4 border-blue-600 pl-8 max-w-2xl bg-slate-50/50 py-6 rounded-r-3xl mb-10" data-aos="fade-up" data-aos-delay="100">
              We are recruiting lead architects and precision engineers to scale our digital matrix. Your logic is the missing node in our growth trajectory.
            </p>
            <div className="flex flex-wrap gap-4" data-aos="fade-up" data-aos-delay="200">
              <div className="flex items-center gap-3 px-6 py-4 rounded-2xl border border-blue-100 bg-white shadow-sm">
                <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">3 Open Nodes Active</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Culture Grid: The Lab DNA */}
      <section className="py-24 px-6 bg-slate-50/50 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div data-aos="fade-right">
              <h2 className="text-blue-600 font-black text-[10px] uppercase tracking-[0.4em] mb-4 italic">Culture ecosystem_</h2>
              <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase italic mb-8">Engineering with <span className="text-blue-600">Soul.</span></h3>
              <p className="text-slate-500 font-medium text-base leading-relaxed mb-10 italic">
                Piedocx isn't a company; it's a high-performance lab where engineers are artists and code is the medium. We bypass bureaucracy to focus on pure technical breakthrough.
              </p>
              
              <div className="space-y-6">
                {benefits.map((b, i) => (
                  <div key={i} className="flex gap-6 group">
                    <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-blue-600 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all transform group-hover:rotate-12">
                      {b.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-black uppercase italic text-slate-900 mb-1">{b.name}</h4>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative" data-aos="fade-left">
               <div className="grid grid-cols-2 gap-4">
                  <div className="aspect-[4/5] rounded-[3rem] bg-blue-600 overflow-hidden relative group">
                    <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80" className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-all duration-700" alt="Lab" />
                    <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                        <Terminal size={24} className="mb-2" />
                        <p className="text-[10px] font-black uppercase tracking-[0.2em]">Lab Culture_</p>
                    </div>
                  </div>
                  <div className="aspect-[4/5] rounded-[3rem] bg-slate-900 overflow-hidden relative group mt-12">
                    <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80" className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-all duration-700" alt="Squad" />
                    <div className="absolute inset-0 p-6 flex flex-col justify-end text-white text-right">
                        <Workflow size={24} className="mb-2 ml-auto" />
                        <p className="text-[10px] font-black uppercase tracking-[0.2em]">Global Squad_</p>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Open Roles: Activate Your Node */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16" data-aos="fade-down">
            <h2 className="text-blue-600 font-black text-[10px] uppercase tracking-[0.4em] mb-4 italic">Active Deployments_</h2>
            <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase italic">Current <span className="text-blue-600">Openings.</span></h3>
          </div>

          <div className="space-y-6">
            {openings.map((job, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group p-8 rounded-[2.5rem] border-2 border-slate-100 bg-white hover:border-blue-600/30 hover:shadow-2xl hover:shadow-blue-600/5 transition-all flex flex-col md:flex-row items-center justify-between gap-8"
              >
                <div className="flex items-center gap-6 text-center md:text-left">
                  <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 group-hover:scale-110 transition-all">
                    {job.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter group-hover:text-blue-600 transition-colors">{job.title}</h3>
                    <div className="flex flex-wrap gap-2 mt-2 justify-center md:justify-start">
                      <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-blue-50 text-blue-600 rounded-lg">{job.type}</span>
                      {job.stack.map((s, idx) => (
                        <span key={idx} className="text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-slate-100 text-slate-400 rounded-lg">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <Link to="/contact" className="px-10 py-5 bg-blue-600 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-blue-600/20 group/btn">
                  Inject Profile <ArrowRight size={14} className="inline ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="mt-20 p-12 rounded-[3.5rem] bg-slate-900 text-white text-center relative overflow-hidden" data-aos="zoom-in">
             <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12">
                <ShieldCheck size={120} />
             </div>
             <h4 className="text-2xl font-black uppercase italic tracking-tighter mb-4">No match for your <span className="text-blue-600">Signal?</span></h4>
             <p className="text-slate-400 font-medium italic mb-8 max-w-md mx-auto">Send your resume to info@piedocx.in – we are always expanding our radar for exceptional talent.</p>
             <a href="mailto:info@piedocx.in" className="inline-flex items-center gap-3 px-10 py-4 border-2 border-white/20 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all">
               Push Resume_
               <Zap size={16} />
             </a>
          </div>
        </div>
      </section>

      {/* 4. Statistics: Scale With Us */}
      <section className="py-20 bg-slate-50/30 px-6 border-t border-slate-100">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-12">
          {[
            { label: "Engineering Nodes", val: "15+" },
            { label: "Deployed Artifacts", val: "50+" },
            { label: "Global Reach", val: "5 Nodes" },
            { label: "Uptime Protocol", val: "99.9%" }
          ].map((s, i) => (
            <div key={i} className="text-center group" data-aos="fade-up" data-aos-delay={i * 100}>
              <h5 className="text-4xl md:text-5xl font-black text-slate-900 mb-2 group-hover:text-blue-600 transition-colors uppercase italic tracking-tighter">{s.val}</h5>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] italic">{s.label}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Careers;
