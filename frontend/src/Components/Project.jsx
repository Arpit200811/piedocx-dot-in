import { useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import AOS from "aos";
import "aos/dist/aos.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { 
  Zap, 
  Cpu, 
  Workflow, 
  ArrowRight, 
  Phone, 
  Mail, 
  MapPin, 
  Github, 
  ExternalLink,
  Layers,
  Sparkles,
  Terminal,
  Activity,
  Code2
} from "lucide-react";
import { base_url } from "../utils/info";

const contactSchema = yup.object({
  name: yup.string().required("Identity required").min(3, "Too short"),
  email: yup.string().email("Invalid endpoint").required("Email required"),
  message: yup.string().required("Payload required").min(10, "Detail too short"),
}).required();

const Project = () => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(contactSchema)
  });

  const onSubmit = async (data) => {
    try {
      await axios.post(`${base_url}/api/users/user`, { ...data, source: 'contact' });
      Swal.fire({
        title: "Inquiry Locked",
        text: "Your breakthrough idea has been committed to our queue.",
        icon: "success",
        confirmButtonColor: "#2563eb",
        background: '#ffffff',
        customClass: { popup: 'rounded-[2rem]' }
      });
      reset();
    } catch (error) {
      Swal.fire("Transmission Error", "Data packet loss detected. Please retry.", "error");
    }
  };

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const corePillars = [
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Real-time Operations",
      text: "Optimized for latency-critical enterprise environments.",
      color: "blue"
    },
    {
      icon: <Cpu className="w-5 h-5" />,
      title: "Neural Integration",
      text: "AI-driven logic embedded within core architectures.",
      color: "indigo"
    },
    {
      icon: <Workflow className="w-5 h-5" />,
      title: "Agile Orchestration",
      text: "Seamlessly scaling from MVP to global production.",
      color: "emerald"
    }
  ];

  const projects = [
    { 
      id: 1, 
      title: "Command Center Web", 
      category: "DASHBOARD SYSTEMS", 
      imgSrc: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=2000&q=100",
      tech: ["React", "D3.js", "Node"]
    },
    { 
      id: 2, 
      title: "Neural App UI", 
      category: "MOBILE ECOSYSTEMS", 
      imgSrc: "https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=2000&q=100",
      tech: ["Flutter", "Kotlin", "Go"]
    },
    { 
      id: 3, 
      title: "Quantum Cloud", 
      category: "INFRASTRUCTURE", 
      imgSrc: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=2000&q=100",
      tech: ["Kubernetes", "AWS", "Python"]
    },
    { 
      id: 4, 
      title: "Sync Pro", 
      category: "SaaS ARCHITECTURE", 
      imgSrc: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=2000&q=100",
      tech: ["Vite", "Supabase", "Tailwind"]
    },
    { 
      id: 5, 
      title: "BioMetric Guard", 
      category: "SECURITY", 
      imgSrc: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=2000&q=100",
      tech: ["WebAuthn", "Rust", "C++"]
    },
    { 
      id: 6, 
      title: "Data Visualizer 2.0", 
      category: "ANALYTICS", 
      imgSrc: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=2000&q=100",
      tech: ["Python", "PowerBI", "Azure"]
    }
  ];

  return (
    <main className="bg-white font-sans overflow-x-hidden selection:bg-blue-100 selection:text-blue-600">
      
      {/* Dynamic Command Header */}
      <section className="relative pt-20 pb-10 md:pb-12 px-6 border-b border-slate-100 bg-slate-50/50 mt-6">
        <div className="max-w-6xl mx-auto relative z-10">
          
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 mb-4 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em]" data-aos="fade-right">
             The Innovation Lab
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter italic mb-3 md:mb-4 uppercase" data-aos="fade-up" data-aos-delay="100">
             Building <span className="text-blue-600 underline decoration-blue-100 decoration-8 underline-offset-8">Tomorrow.</span>
          </h1>
          <p className="max-w-2xl text-slate-500 font-medium text-sm md:text-base mb-6 md:mb-8 leading-relaxed" data-aos="fade-up" data-aos-delay="200">
             Explore our vault of architectural breakthroughs and high-performance digital systems engineered for the 2.0 era.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4" data-aos="fade-up" data-aos-delay="300">
             <button onClick={() => document.querySelector('.portfolio-grid')?.scrollIntoView({ behavior: 'smooth' })} className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-slate-900/10">View Deployments</button>
             <div className="flex items-center gap-3 h-12 px-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
                <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Live Systems Active</span>
             </div>
          </div>
        </div>
      </div>
        
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-[50%] h-full bg-blue-600/[0.02] -skew-x-12 translate-x-1/2 pointer-events-none"></div>
      </section>

      {/* Strategic Pillars */}
      <section className="max-w-6xl mx-auto px-6 py-10 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {corePillars.map((pillar, idx) => (
            <div key={idx} className="p-5 md:p-6 rounded-[2rem] md:rounded-[2.5rem] bg-slate-50 hover:bg-white border border-transparent hover:border-blue-100 transition-all duration-500 group shadow-sm hover:shadow-xl hover:shadow-blue-600/5 cursor-default" data-aos="fade-up" data-aos-delay={idx * 100}>
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all mb-4">
                {pillar.icon}
              </div>
              <h3 className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-400 mb-2 group-hover:text-blue-600 transition-colors">{pillar.title}</h3>
              <p className="text-xs md:text-sm font-bold text-slate-700 leading-relaxed italic">{pillar.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Refined Portfolio Grid */}
      <section className="portfolio-grid bg-slate-50/30 border-y border-slate-100 py-10 md:py-14">
        <div className="max-w-6xl mx-auto px-6">
           <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-12 px-2 md:px-4">
              <div>
                 <h2 className="text-2xl md:text-3xl font-black tracking-tighter italic uppercase text-slate-900 mb-2" data-aos="fade-right">Deployed Ecosystems</h2>
                 <p className="text-slate-400 text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em]" data-aos="fade-right" data-aos-delay="100">Vault 0.1 // Engineering Excellence</p>
              </div>
              <div className="flex flex-wrap gap-2" data-aos="fade-left">
                 {['ALL', 'WEB', 'APPS', 'CLOUD'].map(tag => (
                   <button key={tag} className="px-4 md:px-5 py-2 rounded-xl text-[9px] md:text-[10px] font-black bg-white border border-slate-100 text-slate-400 hover:text-blue-600 hover:border-blue-600/20 transition-all tracking-widest uppercase">{tag}</button>
                 ))}
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, i) => (
                <article key={project.id} className="group relative bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-blue-600/10 transition-all duration-700" data-aos="fade-up" data-aos-delay={i * 50}>
                   <div className="relative h-56 overflow-hidden">
                      <img src={project.imgSrc} alt={project.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[30%] group-hover:grayscale-0" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="absolute top-4 right-4 flex gap-2 translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                         <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/20 backdrop-blur-md text-white border border-white/20 hover:bg-white hover:text-slate-900"><ExternalLink size={16} /></button>
                         <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/20 backdrop-blur-md text-white border border-white/20 hover:bg-white hover:text-slate-900"><Github size={16} /></button>
                      </div>
                   </div>
                   <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                         <span className="h-1 w-1 bg-blue-600 rounded-full"></span>
                         <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">{project.category}</h4>
                      </div>
                      <h3 className="text-xl font-black text-slate-800 tracking-tighter italic uppercase group-hover:text-blue-600 transition-colors mb-4">{project.title}</h3>
                      <div className="flex flex-wrap gap-2">
                         {project.tech.map(tech => (
                           <span key={tech} className="px-3 py-1 bg-slate-50 border border-slate-100 text-[9px] font-black text-slate-400 rounded-lg group-hover:bg-blue-50 group-hover:text-blue-600 transition-all uppercase tracking-widest">{tech}</span>
                         ))}
                      </div>
                   </div>
                </article>
              ))}
           </div>
        </div>
      </section>

      {/* Blueprint CTA Section */}
      <section className="py-10 md:py-14 px-6 max-w-6xl mx-auto overflow-hidden">
         <div className="relative rounded-[2.5rem] md:rounded-[3.5rem] bg-slate-900 p-6 md:p-12 flex flex-col lg:flex-row gap-10 text-white shadow-2xl overflow-hidden group">
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_20%,rgba(37,99,235,0.08),transparent)] pointer-events-none"></div>
            
            <div className="lg:w-1/2 relative z-10">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 border border-blue-600/20 text-blue-500 mb-5 md:mb-6 text-[9px] font-black uppercase tracking-[0.3em]">
                  Initiate Project
               </div>
               <h2 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter leading-tight mb-5">Let's blueprint your <span className="text-blue-600">Vision.</span></h2>
               <p className="text-slate-400 text-xs md:text-sm font-medium leading-relaxed max-w-sm mb-6 md:mb-8 italic">"Engineering is not just building; it's architecting a future that doesn't yet exist."</p>
               
               <div className="grid grid-cols-1 gap-6 mb-10">
                  {[
                    { icon: <Phone size={14} />, text: "+91 6307503700", label: "Direct Line" },
                    { icon: <Mail size={14} />, text: "info@piedocx.com", label: "Inquiry Box" },
                    { icon: <MapPin size={14} />, text: "Aliganj, Lucknow IN", label: "Headquarters" }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 group/link cursor-pointer">
                       <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 group-hover/link:bg-blue-600 group-hover/link:text-white transition-all">
                          {item.icon}
                       </div>
                       <div>
                          <p className="text-[9px] font-black uppercase text-slate-600 tracking-widest mb-0.5">{item.label}</p>
                          <p className="text-sm font-black transition-colors group-hover/link:text-blue-500 italic">{item.text}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            <div className="lg:w-1/2 relative z-10 bg-white shadow-2xl rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 text-slate-900 mx-auto w-full max-w-md lg:max-w-none" data-aos="zoom-in">
               <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Mission Lead</label>
                     <input 
                        type="text" 
                        {...register("name")}
                        placeholder="Full Name" 
                        className={`w-full bg-slate-50 border ${errors.name ? 'border-red-500' : 'border-slate-100'} p-3.5 md:p-4 rounded-xl md:rounded-2xl focus:bg-white focus:border-blue-600/20 outline-none transition font-bold text-xs md:text-sm placeholder:text-slate-300`} 
                     />
                     {errors.name && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.name.message}</p>}
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Secure Channel</label>
                     <input 
                        type="email" 
                        {...register("email")}
                        placeholder="Email@domain.com" 
                        className={`w-full bg-slate-50 border ${errors.email ? 'border-red-500' : 'border-slate-100'} p-3.5 md:p-4 rounded-xl md:rounded-2xl focus:bg-white focus:border-blue-600/20 outline-none transition font-bold text-xs md:text-sm placeholder:text-slate-300`} 
                     />
                     {errors.email && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.email.message}</p>}
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Mission Details</label>
                     <textarea 
                        {...register("message")}
                        placeholder="Describe your breakthrough idea..." 
                        rows="4" 
                        className={`w-full bg-slate-50 border ${errors.message ? 'border-red-500' : 'border-slate-100'} p-3.5 md:p-4 rounded-xl md:rounded-2xl focus:bg-white focus:border-blue-600/20 outline-none transition font-bold text-xs md:text-sm placeholder:text-slate-300 resize-none`} 
                     ></textarea>
                     {errors.message && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.message.message}</p>}
                  </div>
                  <button 
                     type="submit" 
                     disabled={isSubmitting}
                     className="w-full bg-blue-600 text-white font-black py-4 md:py-5 rounded-[2rem] hover:bg-blue-700 transition shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3 uppercase text-[10px] md:text-xs tracking-widest group/btn"
                  >
                     {isSubmitting ? "Processing..." : "Push Deployment"} 
                     {!isSubmitting && <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />}
                  </button>
               </form>
            </div>
         </div>
      </section>



    </main>
  );
};

export default Project;
