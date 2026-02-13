import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import SEO from "./SEO";
import { 
  Linkedin, 
  Mail, 
  Plus,
  Zap,
  ShieldCheck,
  Cpu,
  Workflow,
  Sparkles,
  Command,
  Coffee,
  Code,
  Trophy,
  Activity,
  UserCheck,
  Globe,
  Ghost,
  CpuIcon,
  Slack,
  Github,
  Figma,
  Trello,
  LayoutGrid
} from "lucide-react";

const teamMembers = [
  {
    name: "Savan Rai",
    role: "CEO & Founder",
    img: "/Savanrai.jpg",
    bio: "Visionary leader architecting the future of enterprise digital ecosystems.",
    skills: ["Strategic Design", "System Architecture", "Cloud-Native"],
    category: "Leadership"
  },
  {
    name: "Arpit Gupta",
    role: "Technical Lead",
    img: "/Arpit.jpg",
    bio: "Excellence in high-performance MERN stack and complex logic.",
    skills: ["React", "NodeJS", "Kubernetes"],
    category: "Engineering"
  },
  {
    name: "Manju Yadav",
    role: "Senior .NET Developer",
    img: "/Manju.jpg",
    bio: "Specializing in robust enterprise-grade backend infrastructure.",
    skills: [".NET Core", "Azure", "Microservices"],
    category: "Engineering"
  },
  {
    name: "Madhu Verma",
    role: "Product Designer",
    img: "/Madhu.jpg",
    bio: "Crafting vibrant and intuitive user experiences for global brands.",
    skills: ["UI/UX", "Visual Branding", "Motion"],
    category: "Design"
  },
  {
    name: "Sameer Sharma",
    role: "Java Backend Engineer",
    img: "/Sameer.jpg",
    bio: "Engineering highly secure and scalable financial microservices.",
    skills: ["Java", "Spring Boot", "Security"],
    category: "Engineering"
  },
  {
    name: "Aditya Kumar",
    role: "Mobile Systems Dev",
    img: "/Aditya.jpg",
    bio: "Architecting fluid and responsive cross-platform native experiences.",
    skills: ["React Native", "Flutter", "Swift"],
    category: "Engineering"
  }
];

const funStats = [
  { label: "Caffeine Consumed", value: "5000+", icon: <Coffee className="text-amber-500" /> },
  { label: "Lines of Logic", value: "2.4M", icon: <Code className="text-blue-500" /> },
  { label: "Elite Deployments", value: "150+", icon: <Trophy className="text-yellow-500" /> },
  { label: "Brain Power", value: "100%", icon: <Activity className="text-rose-500" /> }
];

const collaborationTools = [
  { name: "Slack", icon: <Slack size={18} className="text-purple-500" /> },
  { name: "GitHub", icon: <Github size={18} className="text-slate-900" /> },
  { name: "Figma", icon: <Figma size={18} className="text-rose-500" /> },
  { name: "Notion", icon: <LayoutGrid size={18} className="text-blue-600" /> },
  { name: "Jira", icon: <Trello size={18} className="text-blue-500" /> },
  { name: "VS Code", icon: <Code size={18} className="text-sky-500" /> }
];

const TeamSection = () => {
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const filteredMembers = filter === "All" 
    ? teamMembers 
    : teamMembers.filter(m => m.category === filter);

  return (
    <main className="bg-white min-h-screen text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-600 overflow-x-hidden">
      <SEO 
        title="Our Team - The Piedocx Architects" 
        description="Meet the expert team of developers, designers, and strategists behind Piedocx Technologies."
      />
      
      {/* 1. Asymmetrical Command Header (Projects Style) */}
      <section className="relative pt-20 pb-10 md:pb-12 px-6 border-b border-slate-100 bg-slate-50/50 mt-6 overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 mb-4 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em]" data-aos="fade-right">
               The Engineering Hub
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter italic mb-3 md:mb-4 uppercase" data-aos="fade-up" data-aos-delay="100">
               The <span className="text-blue-600 underline decoration-blue-100 decoration-8 underline-offset-8">Architects.</span>
            </h1>
            <p className="max-w-2xl text-slate-500 font-medium text-sm md:text-base mb-6 md:mb-8 leading-relaxed" data-aos="fade-up" data-aos-delay="200">
               Meet the elite squad translating complex business logic into vivid digital artifacts. We don't just build teams; we assemble multi-disciplinary intelligence.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4" data-aos="fade-up" data-aos-delay="300">
               <button onClick={() => document.querySelector('.team-grid')?.scrollIntoView({ behavior: 'smooth' })} className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-slate-900/10">Explore Talent</button>
               <div className="flex items-center gap-3 h-12 px-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Mission Ready</span>
               </div>
            </div>
          </div>
        </div>
        
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-[50%] h-full bg-blue-600/[0.02] -skew-x-12 translate-x-1/2 pointer-events-none"></div>
      </section>

      {/* 2. Leadership Spotlight */}
      <section className="py-8 md:py-12 px-6 bg-white overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-8 bg-slate-900 rounded-[2.5rem] p-6 md:p-10 text-white relative shadow-2xl">
             <div className="absolute top-0 right-0 p-6 opacity-10 animate-spin-slow">
                <Command size={100} />
             </div>
             <div className="lg:w-1/3 flex justify-center" data-aos="zoom-in">
                <div className="p-1 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[2.5rem] shadow-xl">
                   <img src="/Savanrai.jpg" alt="CEO" className="w-56 h-72 object-cover object-top rounded-[2rem] border border-white/10" />
                </div>
             </div>
             <div className="lg:w-2/3" data-aos="fade-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-400 mb-4 text-[9px] font-black uppercase tracking-widest border border-white/10">
                   <UserCheck size={12} /> Founding Pillar
                </div>
                <h2 className="text-3xl md:text-4xl font-black tracking-tighter italic uppercase mb-3 leading-none text-white">
                   Savan <span className="text-blue-500">Rai_</span>
                </h2>
                <p className="text-base font-bold text-blue-300 uppercase tracking-widest mb-4 italic">CEO & Lead Architect</p>
                <p className="text-sm md:text-base text-slate-400 font-medium italic mb-8 leading-relaxed max-w-xl">
                   "Our mission is to bridge the gap between abstract business ideas and high-performance digital reality. At Piedocx, we engineer with soul and scale with precision."
                </p>
                <div className="flex flex-wrap gap-3">
                   {["Visionary", "Tech Strategist", "Product Mentor"].map(skill => (
                     <span key={skill} className="px-5 py-2 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black uppercase text-white hover:bg-white hover:text-black transition-all">
                        {skill}
                     </span>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 4. Filter Bar */}
      <section className="py-8 px-6 max-w-7xl mx-auto flex flex-wrap justify-center gap-4 border-b border-slate-100">
         {["All", "Leadership", "Engineering", "Design"].map(cat => (
           <button 
             key={cat}
             onClick={() => setFilter(cat)}
             className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === cat ? 'bg-blue-600 text-white shadow-xl shadow-blue-200 translate-y-[-2px]' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
           >
              {cat}
           </button>
         ))}
      </section>

      {/* 5. The Grid (Members + Skill Badges) */}
      <section className="team-grid max-w-5xl mx-auto px-6 py-10 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {filteredMembers.map((member, idx) => (
            <div key={idx} className="group" data-aos="fade-up" data-aos-delay={idx * 50}>
              <div className="relative aspect-square mb-4 overflow-hidden rounded-[1.5rem] bg-slate-50 border border-slate-100 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-blue-600/10">
                <img 
                  src={member.img} 
                  alt={member.name} 
                  className="w-full h-full object-cover object-top transition-transform duration-1000 group-hover:scale-105"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                   <div className="flex gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 w-full justify-center">
                      <a href="https://www.linkedin.com/company/piedocx" target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-xl">
                         <Linkedin size={14} />
                      </a>
                      <Link to="/contact" className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-xl">
                         <Mail size={14} />
                      </Link>
                   </div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-[8px] font-black uppercase tracking-[0.2em] text-blue-600 mb-1">{member.role}</p>
                <h3 className="text-lg font-black text-slate-900 tracking-tighter uppercase italic leading-none mb-2 group-hover:text-blue-600 transition-colors">
                  {member.name}
                </h3>
                <div className="flex flex-wrap justify-center gap-1.5 mb-3">
                   {member.skills?.map(skill => (
                     <span key={skill} className="px-2 py-0.5 rounded-md bg-blue-50 text-[7px] font-black uppercase text-blue-600 border border-blue-100">
                        {skill}
                     </span>
                   ))}
                </div>
                <p className="text-[10px] font-bold text-slate-400 leading-relaxed italic max-w-[200px] mx-auto group-hover:text-slate-600 transition-colors">
                  "{member.bio}"
                </p>
              </div>
            </div>
          ))}

          {/* Hire Card */}
          <div className="group relative aspect-square rounded-[1.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-6 text-center hover:border-blue-400 hover:bg-blue-50/20 transition-all cursor-pointer" data-aos="fade-up">
             <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all shadow-xl shadow-blue-200">
                <Plus size={24} />
             </div>
             <h3 className="text-lg font-black text-slate-900 tracking-tighter uppercase mb-1 italic">Join Squad</h3>
             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic">Scale with logic.</p>
          </div>
        </div>
      </section>

      {/* 6. Collaborative Ecosystem (NEW - Tool Ribbon) */}
      <section className="py-8 bg-slate-50 border-y border-slate-100">
         <div className="max-w-7xl mx-auto px-6 overflow-hidden">
            <h4 className="text-center text-[9px] font-black uppercase text-slate-400 tracking-[0.4em] mb-8">Our Collaborative Ecosystem</h4>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 hover:opacity-100 transition-all">
               {collaborationTools.map((tool, i) => (
                 <div key={i} className="flex items-center gap-2 group cursor-default">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
                       {tool.icon}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-800">{tool.name}</span>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* 7. Fun Stats Section (Vibrant) */}
      <section className="py-14 bg-white">
         <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
               {funStats.map((stat, i) => (
                 <div key={i} className="flex flex-col items-center text-center p-6 bg-slate-50 rounded-[2rem] shadow-sm hover:shadow-xl transition-all group border border-slate-50">
                    <div className="mb-4 transform group-hover:scale-110 transition-transform">{stat.icon}</div>
                    <p className="text-3xl font-black text-slate-900 italic mb-1">{stat.value}</p>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* 8. Philosophy Ribbon */}
      <section className="py-12 md:py-16 px-6 max-w-7xl mx-auto overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {[
             { icon: <Cpu className="w-6 h-6"/>, title: "Precision", text: "Mathematical certainty in every bit of logic we architect." },
             { icon: <Workflow className="w-6 h-6"/>, title: "Momentum", text: "Zero-friction collaboration. We are your high-speed engine." },
             { icon: <ShieldCheck className="w-6 h-6"/>, title: "Fortified", text: "Security-first DNA. Enterprise-grade resilience is default." }
           ].map((pill, i) => (
             <div key={i} className="group p-6 rounded-[2rem] bg-stone-50 hover:bg-white hover:border-blue-100 transition-all border border-slate-50 shadow-sm hover:shadow-xl" data-aos="fade-up" data-aos-delay={i * 100}>
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-all">
                   {pill.icon}
                </div>
                <h3 className="text-lg font-black tracking-tight uppercase italic mb-2">{pill.title}</h3>
                <p className="text-xs font-bold text-slate-500 leading-relaxed italic">{pill.text}</p>
             </div>
           ))}
        </div>
      </section>

      {/* 9. Elite CTA (Projects Style) */}
      <section className="py-10 md:py-14 px-6 max-w-6xl mx-auto overflow-hidden">
         <div className="relative rounded-[2.5rem] md:rounded-[3.5rem] bg-slate-900 p-6 md:p-12 flex flex-col lg:flex-row gap-10 text-white shadow-2xl overflow-hidden group">
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_20%,rgba(37,99,235,0.08),transparent)] pointer-events-none"></div>
            
            <div className="lg:w-1/2 relative z-10">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 border border-blue-600/20 text-blue-500 mb-5 md:mb-6 text-[9px] font-black uppercase tracking-[0.3em]">
                  Mission Access
               </div>
               <h2 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter leading-tight mb-5">Manifest <span className="text-blue-600">Your Mission.</span></h2>
               <p className="text-slate-400 text-xs md:text-sm font-medium leading-relaxed max-w-sm mb-6 md:mb-8 italic">"Great things in business are never done by one person. They're done by a team of people."</p>
               
               <div className="flex flex-col gap-4 mb-4">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400">
                        <Activity size={14} />
                     </div>
                     <div>
                        <p className="text-[9px] font-black uppercase text-slate-600 tracking-widest">Active Seats</p>
                        <p className="text-sm font-black italic">3 Elite Vacancies</p>
                     </div>
                  </div>
               </div>
            </div>

            <div className="lg:w-1/2 relative z-10 flex items-center justify-center">
               <Link to="/contact" className="w-full max-w-xs bg-blue-600 text-white font-black py-4 md:py-5 rounded-[2rem] hover:bg-blue-700 transition shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3 uppercase text-[10px] md:text-xs tracking-widest group/btn text-center">
                  Apply to Squad
                  <Zap size={18} className="group-hover/btn:scale-110 transition-transform" />
               </Link>
            </div>
         </div>
      </section>

      <style>{`
        .animate-spin-slow { animation: spin 20s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

    </main>
  );
};

export default TeamSection;
