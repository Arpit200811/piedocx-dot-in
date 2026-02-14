import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { 
  Zap, Cpu, Workflow, ArrowRight, Phone, Mail, 
  MapPin, Github, ExternalLink, Layers, Sparkles,
  Terminal, Activity, Code2, Rocket, ShieldCheck,
  ChevronRight, Globe2
} from "lucide-react";
import { base_url } from "../utils/info";
import SEO from "./SEO";

const contactSchema = yup.object({
  name: yup.string().required("Identity required").min(3, "Too short"),
  email: yup.string().email("Invalid endpoint").required("Email required"),
  message: yup.string().required("Payload required").min(10, "Detail too short"),
}).required();

const Project = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(contactSchema)
  });

  const onSubmit = async (data) => {
    try {
      await axios.post(`${base_url}/api/users/user`, { ...data, source: 'contact' });
      Swal.fire({
        title: "Transmission Secure",
        text: "Your architectural vision has been logged into our core server.",
        icon: "success",
        confirmButtonColor: "#2563eb",
        background: '#ffffff',
        customClass: { popup: 'rounded-[3rem] border-none shadow-2xl' }
      });
      reset();
    } catch (error) {
      Swal.fire("Data Loss", "Packet transmission failed. Re-initiate connection.", "error");
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const corePillars = [
    {
      icon: <Zap size={24} />,
      title: "Real-time Operations",
      text: "Ultra-low latency architectures for critical enterprise nodes.",
      color: "text-blue-600"
    },
    {
      icon: <Cpu size={24} />,
      title: "Neural Integration",
      text: "Deep-embedded AI logic within high-performance workflows.",
      color: "text-blue-500"
    },
    {
      icon: <Layers size={24} />,
      title: "System Orchestration",
      text: "Seamlessly scaling infrastructures from MVP to global production.",
      color: "text-blue-700"
    }
  ];

  const projects = [
    { 
      id: 1, 
      title: "Command Center", 
      category: "ECOSYSTEM DASHBOARD", 
      imgSrc: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
      tech: ["React", "D3.js", "Redis"]
    },
    { 
      id: 2, 
      title: "Neural Mobile", 
      category: "SMART INTERFACE", 
      imgSrc: "https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=800&q=80",
      tech: ["Flutter", "Go", "TensorFlow"]
    },
    { 
      id: 3, 
      title: "Cloud Genesis", 
      category: "INFRASTRUCTURE", 
      imgSrc: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
      tech: ["K8s", "AWS", "Terraform"]
    },
    { 
      id: 4, 
      title: "Bio-Guard", 
      category: "SECURITY PROTOCOL", 
      imgSrc: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
      tech: ["Rust", "C++", "Vault"]
    },
    { 
      id: 5, 
      title: "Quantum Sync", 
      category: "SaaS CORE", 
      imgSrc: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
      tech: ["Next.js", "Supabase", "Node"]
    },
    { 
      id: 6, 
      title: "Data Pulse", 
      category: "ANALYTICS ENGINE", 
      imgSrc: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
      tech: ["Python", "Spark", "Elastic"]
    }
  ];

  return (
    <main className="bg-white font-sans selection:bg-blue-600 selection:text-white pt-24 overflow-x-hidden">
      <SEO title="Our Deployments | Piedocx Architecture Lab" description="Explore our vault of architectural breakthroughs and high-performance digital systems." />
      
      {/* 1. Lab Hero Header */}
      <section className="relative py-20 px-6 border-b border-blue-50">
        <div className="absolute top-0 right-0 w-[50%] h-full bg-blue-50 opacity-20 -skew-x-12 translate-x-1/2"></div>
        <div className="max-w-7xl mx-auto relative z-10 text-center lg:text-left">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 mb-8"
          >
            <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Engineering Vault 2.0</span>
          </motion.div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-end">
             <div>
                <motion.h1 
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter italic leading-[0.85] uppercase mb-8"
                >
                  Building <br/>
                  <span className="text-blue-600">The Future.</span>
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="max-w-xl text-slate-500 font-medium text-lg mb-10 leading-relaxed border-l-4 border-blue-600 pl-8"
                >
                  Welcome to our Innovation Lab. Below is a curated collection of high-fidelity architectural deployments engineered for global scale and precision performance.
                </motion.p>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-wrap gap-4 justify-center lg:justify-start"
                >
                  <button onClick={() => document.getElementById('vault').scrollIntoView({ behavior: 'smooth' })} className="px-10 py-5 bg-blue-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-blue-700 hover:scale-105 transition-all shadow-xl shadow-blue-600/30">
                    Explore Vault
                  </button>
                  <div className="px-8 py-5 rounded-[2rem] border border-blue-100 bg-white shadow-sm flex items-center gap-3">
                     <Globe2 size={18} className="text-blue-400" />
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Ops: LIVE</span>
                  </div>
                </motion.div>
             </div>
             
             <div className="hidden lg:block">
                <div className="grid grid-cols-2 gap-4">
                   {[...Array(4)].map((_, i) => (
                     <motion.div 
                        key={i} 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.2 }}
                        className="h-24 bg-blue-50 border border-blue-100 rounded-3xl opacity-40 flex items-center justify-center"
                     >
                        <div className="w-12 h-1 bg-blue-200 rounded-full"></div>
                     </motion.div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 2. Strategic Pillars */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {corePillars.map((pillar, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -10 }}
              className="p-10 rounded-[3rem] bg-white border border-blue-50 shadow-sm hover:shadow-2xl hover:shadow-blue-600/5 transition-all group"
            >
              <div className={`w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center ${pillar.color} mb-8 transition-colors group-hover:bg-blue-600 group-hover:text-white`}>
                {pillar.icon}
              </div>
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-4 group-hover:text-blue-600 transition-colors">{pillar.title}</h3>
              <p className="text-base font-bold text-slate-700 leading-relaxed italic">{pillar.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. The Deployment Grid */}
      <section id="vault" className="py-24 px-6 bg-blue-50/30">
        <div className="max-w-7xl mx-auto">
           <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-20 px-4">
              <div>
                 <p className="text-blue-600 font-black uppercase tracking-[0.4em] text-[10px] mb-4">Engineering Archive</p>
                 <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-slate-900">Deployed Ecosystems</h2>
              </div>
              <div className="flex flex-wrap gap-3">
                 {['All Systems', 'Web', 'Mobile', 'Cloud'].map((tag, i) => (
                   <button key={i} className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${i === 0 ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-slate-400 border border-blue-50 hover:border-blue-200'}`}>
                     {tag}
                   </button>
                 ))}
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {projects.map((project, i) => (
                <motion.article 
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group bg-white rounded-[3.5rem] overflow-hidden border border-blue-50 shadow-xl hover:shadow-blue-600/10 transition-all duration-700"
                >
                   <div className="relative h-64 overflow-hidden">
                      <img src={project.imgSrc} alt={project.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="absolute top-6 right-6 flex gap-3 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all">
                         <div className="w-10 h-10 rounded-2xl bg-white/90 backdrop-blur-md flex items-center justify-center text-blue-600 shadow-xl cursor-pointer hover:bg-blue-600 hover:text-white transition-colors">
                            <ExternalLink size={18} />
                         </div>
                      </div>
                   </div>
                   <div className="p-10">
                      <div className="flex items-center gap-3 mb-4">
                         <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                         <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">{project.category}</h4>
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 tracking-tighter italic uppercase group-hover:text-blue-600 transition-colors mb-6">{project.title}</h3>
                      <div className="flex flex-wrap gap-2">
                         {project.tech.map((t, idx) => (
                           <span key={idx} className="px-4 py-2 bg-blue-50/50 text-[9px] font-black text-blue-600 rounded-xl uppercase tracking-widest">{t}</span>
                         ))}
                      </div>
                   </div>
                </motion.article>
              ))}
           </div>
        </div>
      </section>

      {/* 4. The Blueprint CTA (Light Theme) */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="relative rounded-[4rem] bg-white border border-blue-100 shadow-[0_40px_100px_rgba(0,0,0,0.05)] p-12 md:p-20 overflow-hidden">
           <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_20%,rgba(37,99,235,0.05),transparent)] pointer-events-none"></div>
           
           <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div>
                 <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-blue-50 text-blue-600 mb-8 border border-blue-100 font-black text-[10px] uppercase tracking-widest">
                    <Rocket size={14} /> Initiate Blueprint
                 </div>
                 <h2 className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter leading-[0.9] text-slate-900 mb-8">
                    Start Your <br/> <span className="text-blue-600">Vision Node.</span>
                 </h2>
                 <p className="text-slate-500 font-medium text-lg leading-relaxed mb-12 max-w-md italic border-l-4 border-blue-600 pl-8">
                   "High-fidelity engineering is not just building; it's architecting a future that doesn't yet exist."
                 </p>
                 
                 <div className="space-y-8">
                    {[
                      { icon: <Phone size={20} />, label: "Terminal Line", value: "+91 6307503700" },
                      { icon: <Mail size={20} />, label: "Dispatch Hub", value: "info@piedocx.com" },
                      { icon: <MapPin size={20} />, label: "Geo-Coordinates", value: "Lucknow, IN" }
                    ].map((item, i) => (
                      <div key={i} className="flex gap-6 items-center group cursor-pointer">
                         <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                            {item.icon}
                         </div>
                         <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                            <p className="text-lg font-black text-slate-900 italic tracking-tighter group-hover:text-blue-600 transition-colors">{item.value}</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>

              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-blue-50/50 backdrop-blur-xl border border-blue-100 p-10 md:p-12 rounded-[3.5rem] shadow-2xl shadow-blue-600/5"
              >
                 <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 ml-4">Lead Identity</label>
                       <input 
                          type="text" 
                          {...register("name")}
                          placeholder="Node Master / Full Name" 
                          className="w-full bg-white border border-transparent p-5 rounded-3xl focus:border-blue-600/30 outline-none transition-all font-bold text-sm shadow-sm"
                       />
                       {errors.name && <p className="text-[10px] text-red-500 font-bold ml-4">{errors.name.message}</p>}
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 ml-4">Secure Channel</label>
                       <input 
                          type="email" 
                          {...register("email")}
                          placeholder="email@node.com" 
                          className="w-full bg-white border border-transparent p-5 rounded-3xl focus:border-blue-600/30 outline-none transition-all font-bold text-sm shadow-sm"
                       />
                       {errors.email && <p className="text-[10px] text-red-500 font-bold ml-4">{errors.email.message}</p>}
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 ml-4">Mission Specs</label>
                       <textarea 
                          {...register("message")}
                          placeholder="Describe your architectural breakthrough..." 
                          rows="4" 
                          className="w-full bg-white border border-transparent p-5 rounded-3xl focus:border-blue-600/30 outline-none transition-all font-bold text-sm shadow-sm resize-none"
                       ></textarea>
                       {errors.message && <p className="text-[10px] text-red-500 font-bold ml-4">{errors.message.message}</p>}
                    </div>
                    <button 
                       type="submit" 
                       disabled={isSubmitting}
                       className="group w-full py-6 bg-blue-600 text-white rounded-[2.5rem] font-black text-xs uppercase tracking-[0.4em] hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/30 flex items-center justify-center gap-4 active:scale-95"
                    >
                       {isSubmitting ? "Transmitting..." : "Push Dispatch"}
                       <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                    </button>
                 </form>
              </motion.div>
           </div>
        </div>
      </section>

    </main>
  );
};

export default Project;
