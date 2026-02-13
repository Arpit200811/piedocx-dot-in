import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { 
  Laptop, 
  Smartphone, 
  TrendingUp, 
  Palette, 
  Globe, 
  Server, 
  Settings, 
  Activity, 
  Layout,
  ArrowRight,
  Code2,
  Database,
  ShieldCheck,
  Cloud,
  Cpu,
  Zap,
  CheckCircle,
  Box,
  Layers,
  Search,
  Rocket,
  MoveUpRight,
  Wifi,  
  Brain, 
  Link2    
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from './SEO';

const Services = () => {
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    AOS.init({ duration: 1000, easing: 'ease-out-cubic', once: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const services = [
    {
      title: "Web Development",
      path: "/services/full-stack",
      icon: <Laptop size={32} />,
      color: "from-blue-500 to-indigo-600",
      description: "Custom websites and web applications built with modern technologies like React and Next.js.",
      tech: ["React", "Node.js", "MongoDB", "Docker"],
      features: ["E-commerce", "Corporate Sites", "Web Apps"]
    },
    {
      title: "Mobile App Development",
      path: "/services/android-ios",
      icon: <Smartphone size={32} />,
      color: "from-emerald-500 to-teal-600",
      description: "High-quality Android & iOS mobile applications designed for seamless user experience.",
      tech: ["Flutter", "Kotlin", "Swift", "Firebase"],
      features: ["iOS Apps", "Android Apps", "Hybrid Apps"]
    },
    {
      title: "IoT & Smart Systems",
      path: "/services/iot", // Assuming route
      icon: <Wifi size={32} />,
      color: "from-cyan-500 to-blue-600",
      description: "Connecting physical hardware to digital brains. Real-time data streaming and device control.",
      tech: ["MQTT", "Raspberry Pi", "Arduino", "AWS IoT"],
      features: ["Smart Home", "Industrial IoT", "Embedded"]
    },
    {
      title: "AI & Machine Learning",
      path: "/services/ai-ml", // Assuming route
      icon: <Brain size={32} />,
      color: "from-purple-500 to-violet-600",
      description: "Intelligent algorithms that predict, learn, and automate complex business decisions.",
      tech: ["Python", "TensorFlow", "OpenAI", "PyTorch"],
      features: ["Chatbots", "Predictive Analytics", "Automation"]
    },
    {
      title: "Blockchain Solutions",
      path: "/services/blockchain", // Assuming route
      icon: <Link2 size={32} />,
      color: "from-orange-500 to-red-600",
      description: "Decentralized applications (DApps) and smart contracts for transparent and secure transactions.",
      tech: ["Solidity", "Ethereum", "Web3.js", "Hyperledger"],
      features: ["Smart Contracts", "DeFi", "NFT Marketplace"]
    },
    {
      title: "Digital Marketing",
      path: "/services/digital-marketing",
      icon: <TrendingUp size={32} />,
      color: "from-rose-500 to-red-600",
      description: "Data-driven marketing strategies including SEO and PPC to grow your online presence.",
      tech: ["Google Ads", "Meta Pixel", "Semrush"],
      features: ["SEO", "Social Media", "Lead Gen"]
    },
    {
      title: "UI/UX Design",
      path: "/services/graphic-design",
      icon: <Palette size={32} />,
      color: "from-amber-500 to-orange-600",
      description: "Intuitive and beautiful designs that enhance user engagement and brand identity.",
      tech: ["Figma", "Adobe CC", "Spline 3D"],
      features: ["Web Design", "App Design", "Branding"]
    },
    {
      title: "Software Development",
      path: "/services/web-development",
      icon: <Code2 size={32} />, 
      color: "from-sky-500 to-cyan-600",
      description: "Tailored software solutions to streamline your business operations and workflows.",
      tech: ["Vue.js", "Tailwind", "Vercel"],
      features: ["CRM Systems", "ERP Solutions", "Automation"]
    },
    {
      title: "Cloud & Hosting",
      path: "/services/domain-web-hosting",
      icon: <Server size={32} />,
      color: "from-slate-700 to-slate-900",
      description: "Secure cloud infrastructure and reliable hosting services for your applications.",
      tech: ["AWS", "Azure", "Kubernetes"],
      features: ["AWS Setup", "Domain Reg", "SSL Security"]
    }
  ];

  /* 
    REFINED: Engineering Process 
  */
  const engineeringProcess = [
    { 
      step: "01", 
      title: "Discovery", 
      desc: "Deep-dive analysis of business logic & user needs.", 
      icon: <Search size={24} />,
      details: ["Requirement Mapping", "Feasibility Study", "User Personas"]
    },
    { 
      step: "02", 
      title: "Architecture", 
      desc: "Blueprinting the system core & database schema.", 
      icon: <Layers size={24} />,
      details: ["System Design", "Tech Stack Selection", "Security Protocol"]
    },
    { 
      step: "03", 
      title: "Code", 
      desc: "Writing modular, clean, and test-driven code.", 
      icon: <Code2 size={24} />,
      details: ["Agile Sprints", "Unit Testing", "Code Reviews"]
    },
    { 
      step: "04", 
      title: "Scale", 
      desc: "Optimizing for load, speed, and global reach.", 
      icon: <Rocket size={24} />,
      details: ["Load Balancing", "Performance Tuning", "Global CDN"]
    }
  ];

  return (
    <main className="bg-white font-sans selection:bg-black selection:text-white pt-20 overflow-x-hidden">
      <SEO 
        title="Our Capabilities - Software & Cloud Engineering" 
        description="Comprehensive IT services including Full Stack Development, Mobile Apps, Cloud Solutions, and AI/ML integrations."
      />
      
      {/* 1. Asymmetrical Typographic Hero */}
      <section className="px-6 md:px-12 py-6 md:py-8 relative">
        <div className="absolute top-0 right-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-gradient-to-br from-blue-50 to-purple-50 rounded-full blur-[80px] md:blur-[120px] -z-10 translate-x-1/4 md:translate-x-1/2 -translate-y-1/4 md:-translate-y-1/2"></div>
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
           <div data-aos="fade-right">
              <div className="flex items-center gap-3 mb-3 md:mb-5">
                 <span className="w-8 md:w-12 h-[2px] bg-black"></span>
                 <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Our Capabilities</span>
              </div>
              <h1 className="text-3xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[1.1] md:leading-[0.9] mb-4 md:mb-6">
                 ENGINEERING <br/>
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 italic">VELOCITY.</span>
              </h1>
              <p className="text-sm md:text-base text-slate-500 font-medium leading-relaxed max-w-md border-l-4 border-slate-900 pl-4 mb-6 md:mb-8">
                 We translate complex business logic into fluid digital ecosystems. Precision code meets human-centric design.
              </p>
              <Link to="/contact" className="inline-block w-full sm:w-auto px-6 md:px-8 py-3 md:py-3 bg-slate-900 text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-blue-600 hover:scale-105 transition-all shadow-2xl text-center">
                 Explore Services
              </Link>
           </div>
           
           {/* Abstract Service Visual (Right Side) */}
           <div className="relative hidden lg:block h-[420px] w-full max-w-md mx-auto" data-aos="fade-left">
              <div className="absolute inset-0 bg-slate-900 rounded-[2.5rem] transform rotate-3 translate-x-2 translate-y-2"></div>
              <div className="absolute inset-0 bg-white border-2 border-slate-900 rounded-[2.5rem] p-6 flex flex-col justify-between transform hover:translate-x-1 hover:translate-y-1 transition-transform duration-500 shadow-2xl overflow-hidden">
                 
                 {/* Header */}
                 <div className="flex justify-between items-center relative z-10">
                    <div className="p-2 bg-blue-50 rounded-xl border border-blue-100">
                       <Cpu size={28} className="text-blue-600 animate-pulse" />
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100">
                       <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                       <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">System Online</span>
                    </div>
                 </div>

                 {/* Center Animation: The Neural Core */}
                 <div className="flex-1 flex items-center justify-center relative my-4">
                    {/* Rotating Rings */}
                    <div className="absolute w-40 h-40 border-[1px] border-slate-200 rounded-full animate-spin-slow"></div>
                    <div className="absolute w-32 h-32 border-[1px] border-dashed border-blue-200 rounded-full animate-spin-reverse-slow"></div>
                    
                    {/* Pulsing Core */}
                    <div className="relative z-10 w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full shadow-lg shadow-blue-500/30 flex items-center justify-center animate-bounce-slow">
                       <Zap size={32} className="text-white fill-white" />
                    </div>

                    {/* FLoating Data Particles */}
                    <div className="absolute w-full h-full animate-pulse opacity-20">
                       <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-500 rounded-full"></div>
                       <div className="absolute bottom-1/4 right-1/4 w-3 h-3 bg-purple-500 rounded-full"></div>
                       <div className="absolute top-1/2 right-10 w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                    </div>
                 </div>

                 {/* Footer Info */}
                 <div className="relative z-10 bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <div className="flex justify-between items-end mb-2">
                       <div>
                          <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1">Active Process</p>
                          <h3 className="text-lg font-black italic uppercase text-slate-900 leading-none">Core Architecture</h3>
                       </div>
                       <span className="text-xl font-black text-blue-600">98%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                       <div className="h-full bg-blue-600 w-[98%] rounded-full animate-width-grow"></div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* 2. Interactive Service Ecosystem (Neural Map) */}
      <section className="py-12 px-6 md:px-12 bg-slate-50 overflow-hidden relative">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
         <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-8">
               <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase italic tracking-tighter mb-3">The Neural Ecosystem</h2>
               <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">Interconnected Solutions for Digital Dominance</p>
            </div>

            <div className="relative h-[500px] lg:h-[600px] flex items-center justify-center">
               {/* Central Core */}
               <div className="absolute w-48 h-48 bg-slate-900 rounded-full flex items-center justify-center shadow-2xl z-20 animate-pulse-slow">
                  <div className="text-center">
                     <Box size={40} className="text-blue-500 mx-auto mb-2" />
                     <p className="text-white font-black uppercase tracking-widest text-sm">Digital<br/>Core</p>
                  </div>
               </div>

               {/* Orbiting Services (Stylized) */}
               <div className="absolute w-[500px] h-[500px] border border-blue-200 rounded-full animate-spin-slow opacity-50 hidden md:block"></div>
               <div className="absolute w-[800px] h-[800px] border border-slate-200 rounded-full animate-spin-reverse-slow opacity-30 hidden md:block"></div>

               {services.map((service, index) => {
                  // Calculating approximate positions for a circle layou (just visual approximation via absolute positioning classes for simplicity in this example context, or manual placement)
                  // For robustness in React without complex math libraries, we'll place them manually via style or classes for 6 items.
                  // 6 items: 0, 60, 120, 180, 240, 300 degrees
                  const radius = 280; // Distance from center
                  const angle = (index * 60) * (Math.PI / 180);
                  const x = Math.cos(angle) * radius;
                  const y = Math.sin(angle) * radius;

                  // Adjust for responsiveness: On mobile, this will just stack or be specific
                  
                  return (
                     <Link 
                        to={service.path}
                        key={index} 
                        className="hidden md:flex absolute w-40 h-40 bg-white border-2 border-slate-100 rounded-full items-center justify-center flex-col text-center hover:scale-110 hover:border-blue-500 hover:shadow-xl transition-all z-20 cursor-pointer group"
                        style={{ transform: `translate(${x}px, ${y}px)` }}
                     >
                        <div className={`mb-2 text-slate-400 group-hover:text-blue-600 transition-colors`}>{service.icon}</div>
                        <p className="text-[10px] font-black uppercase text-slate-900 leading-tight px-4">{service.title}</p>
                        {/* Connecting Line to Center (Visual only) */}
                        <div className="absolute top-1/2 left-1/2 w-[280px] h-[1px] bg-blue-200 -z-10 origin-left rotate-180" style={{ transform: `rotate(${index * 60 + 180}deg)` }}></div>
                     </Link>
                  );
               })}
               
               {/* Mobile Fallback View for Ecosystem */}
               <div className="md:hidden grid grid-cols-2 gap-4 w-full">
                  {services.slice(0, 4).map((service, index) => (
                      <Link to={service.path} key={index} className="bg-white p-4 rounded-2xl border border-slate-100 text-center shadow-sm">
                         <div className="mb-2 flex justify-center text-blue-600">{service.icon}</div>
                         <p className="text-[10px] font-black uppercase">{service.title}</p>
                      </Link>
                  ))}
               </div>
            </div>
         </div>
      </section>

      {/* 3. The Service Deep Dive (Cards) */}
      <section className="py-12 px-6 md:px-12">
         <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {services.map((service, index) => (
                 <Link 
                    to={service.path} 
                    key={index} 
                    className="group relative h-[300px] rounded-2xl bg-stone-50 p-5 flex flex-col justify-between overflow-hidden hover:-translate-y-1 transition-transform duration-500 hover:shadow-xl border border-slate-100"
                 >
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-600/10 rounded-2xl transition-colors pointer-events-none"></div>

                    <div className="relative z-10 h-full flex flex-col text-left">
                       {/* Compact Header: Icon left, Title right */}
                       <div className="flex items-center gap-4 mb-4">
                          {/* Creative Colorful Icon */}
                          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-500 shrink-0`}>
                             {React.cloneElement(service.icon, { size: 20 })}
                          </div>
                          <div className="flex-1">
                             <h3 className="text-lg font-black text-slate-900 uppercase italic tracking-tighter leading-none mb-1">
                                {service.title}
                             </h3>
                             <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Available</span>
                             </div>
                          </div>
                       </div>

                       {/* Tech Stack Row */}
                       <div className="flex flex-wrap gap-1.5 mb-3">
                           {service.tech.map((t, i) => (
                               <span key={i} className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-white px-2 py-1 rounded border border-slate-100">{t}</span>
                           ))}
                       </div>

                       {/* Description */}
                       <p className="text-sm font-medium text-slate-500 leading-relaxed line-clamp-2 mb-auto">
                          {service.description}
                       </p>
                       
                       {/* Footer: Dense Spec Grid */}
                       <div className="mt-4 pt-4 border-t border-slate-200/50 grid grid-cols-2 gap-4">
                          <div>
                             <p className="text-[9px] font-black uppercase tracking-widest text-slate-300 mb-2">Deliverables</p>
                             <ul className="space-y-1">
                                {service.features.map((f, i) => (
                                   <li key={i} className="text-[10px] font-bold text-slate-700 flex items-center gap-1.5">
                                      <div className="w-1 h-1 bg-blue-500 rounded-full"></div> {f}
                                   </li>
                                ))}
                             </ul>
                          </div>
                          <div>
                             <p className="text-[9px] font-black uppercase tracking-widest text-slate-300 mb-2">Impact</p>
                             <div className="space-y-1.5">
                                <span className="block text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded text-center">High Velocity</span>
                                <span className="block text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded text-center">Scalable Core</span>
                             </div>
                          </div>
                       </div>
                    </div>
                 </Link>
               ))}
            </div>
         </div>
      </section>

      {/* 4. "How We Engineer" (Discovery -> Architecture -> Code -> Scale) */}
      <section className="py-12 px-6 md:px-12 bg-slate-900 text-white relative overflow-hidden">
         {/* Background Grid Pattern */}
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
         
         <div className="max-w-7xl mx-auto relative z-10">
            <div className="mb-8">
               <h4 className="text-blue-500 font-black uppercase tracking-[0.3em] text-[10px] mb-3">Mastery in Motion</h4>
               <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter">How We Engineer</h2>
            </div>

            <div className="relative">
               {/* Timeline Line */}
               <div className="absolute top-12 left-0 w-full h-[2px] bg-white/10 hidden md:block"></div>

               <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  {engineeringProcess.map((proc, idx) => (
                     <div key={idx} className="relative group">
                        {/* Dot on Timeline */}
                        <div className="hidden md:block absolute top-[43px] left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-900 border-2 border-blue-500 rounded-full z-10 group-hover:bg-blue-500 transition-colors"></div>
                        
                        <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] hover:bg-white/10 transition-all hover:-translate-y-2 h-full">
                           <div className="flex items-center justify-between mb-4">
                              <span className="text-3xl font-black text-slate-700 group-hover:text-white transition-colors opacity-50">{proc.step}</span>
                              <div className="text-blue-400">{proc.icon}</div>
                           </div>
                           <h3 className="text-xl font-black italic uppercase mb-2 group-hover:text-blue-400 transition-colors">{proc.title}</h3>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-4 leading-relaxed">{proc.desc}</p>
                           
                           <ul className="space-y-2 border-t border-white/10 pt-4">
                              {proc.details.map((detail, dIdx) => (
                                 <li key={dIdx} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 group-hover:text-white transition-colors">
                                    <div className="w-1 h-1 bg-blue-500 rounded-full"></div> {detail}
                                 </li>
                              ))}
                           </ul>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </section>

      {/* 5. Pricing / Engagement Models */}
      <section className="py-12 px-6 md:px-12">
         <div className="max-w-5xl mx-auto text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase italic tracking-tighter mb-3">Engagement Models</h2>
            <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">Flexible architectures for every stage</p>
         </div>

         <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
               { name: "Fixed Scope", desc: "Defined Budget & Timeline", price: "Project Based" },
               { name: "Time & Material", desc: "Agile & Evolving Needs", price: "Hourly / Monthly" },
               { name: "Dedicated Team", desc: "Your Extended Tech Arm", price: "Subscription" }
            ].map((model, i) => (
               <div key={i} className="border border-slate-200 rounded-[2.5rem] p-8 text-center hover:border-blue-600 hover:shadow-2xl transition-all group bg-white">
                  <h3 className="text-xl font-black text-slate-900 uppercase italic mb-2">{model.name}</h3>
                  <p className="text-sm font-medium text-slate-500 mb-6">{model.desc}</p>
                  <div className="w-full h-[1px] bg-slate-100 mb-6"></div>
                  <p className="text-blue-600 font-black uppercase tracking-widest text-xs mb-6">{model.price}</p>
                  <Link to="/contact" className="inline-block w-full py-4 rounded-xl border-2 border-slate-900 text-slate-900 font-black text-xs uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-colors text-center">
                     Select Model
                  </Link>
               </div>
            ))}
         </div>
      </section>

      <style>{`
        .animate-spin-slow { animation: spin 30s linear infinite; }
        .animate-spin-reverse-slow { animation: spin 40s linear infinite reverse; }
        .animate-pulse-slow { animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        .animate-bounce-slow { animation: bounce 3s infinite; }
        .animate-width-grow { animation: widthGrow 2s ease-out forwards; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes widthGrow { from { width: 0; } to { width: 98%; } }
      `}</style>

    </main>
  );
};

export default Services;
