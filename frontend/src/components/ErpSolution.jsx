import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { 
  Building2, 
  Workflow, 
  BarChart3, 
  Users2, 
  ShieldCheck, 
  Database, 
  Network, 
  Layers,
  ChevronRight,
  Zap,
  Globe,
  Settings,
  Cpu,
  ArrowUpRight
} from "lucide-react";

const ErpSolutions = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const features = [
    {
      title: "Unified Nerve Center",
      desc: "Centralized database architecture eliminates data silos across departments.",
      icon: <Network className="w-5 h-5" />,
      delay: 0
    },
    {
      title: "Process Automation",
      desc: "Zero-touch workflows for inventory and payroll to reduce human error.",
      icon: <Zap className="w-5 h-5" />,
      delay: 50
    },
    {
      title: "Real-time Intel",
      desc: "Interactive BI dashboards providing executive-level insights.",
      icon: <BarChart3 className="w-5 h-5" />,
      delay: 100
    },
    {
      title: "Scalable Ecosystem",
      desc: "Modular design allows you to add features as your enterprise expands.",
      icon: <Layers className="w-5 h-5" />,
      delay: 150
    },
    {
      title: "Secure Governance",
      desc: "Role-based access controls and military-grade encryption for data.",
      icon: <ShieldCheck className="w-5 h-5" />,
      delay: 200
    },
    {
      title: "API First Design",
      desc: "Integrate with SaaS tools, payment gateways, and logistics providers.",
      icon: <Globe className="w-5 h-5" />,
      delay: 250
    }
  ];

  return (
    <main className="bg-white min-h-screen font-sans selection:bg-blue-100 selection:text-blue-600 overflow-x-hidden pt-0">
      
      {/* Compact Hero */}
      <section className="relative pt-14 md:pt-16 lg:pt-20 pb-12 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50 opacity-40 transform skew-x-[-12deg] origin-top-right"></div>
        
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <div data-aos="fade-right">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 mb-4 text-[10px] font-black uppercase tracking-widest">
              <Cpu size={12} /> Enterprise Orchestration
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-6 tracking-tighter italic">
              Control your <br /> <span className="text-blue-600 underline decoration-blue-100 underline-offset-4">Empire Core.</span>
            </h1>
            <p className="text-base text-slate-600 leading-relaxed mb-8 max-w-lg font-medium">
              We build harmonized ERP solutions that synchronize every department into a high-performance digital engine.
            </p>
            <div className="flex gap-4">
              <Link to="/contact" className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg flex items-center gap-2">
                 Request Demo <ArrowUpRight size={16} />
              </Link>
              <Link to="/services" className="px-6 py-3 bg-white text-slate-900 border border-slate-200 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all">
                The Modules
              </Link>
            </div>
          </div>

          <div className="relative group scale-90 md:scale-100" data-aos="zoom-in">
             <div className="absolute -inset-4 bg-blue-100 rounded-full blur-3xl opacity-20"></div>
             <div className="relative bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-2xl overflow-hidden grid grid-cols-2 gap-4 max-w-sm mx-auto">
                <div className="bg-slate-900 rounded-2xl p-6 h-28 flex flex-col justify-between text-white">
                   <Settings size={24} className="animate-spin-slow" />
                   <p className="text-[9px] font-black uppercase tracking-widest">Global Automation</p>
                </div>
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 h-28 flex flex-col justify-between translate-y-4">
                   <BarChart3 size={24} className="text-blue-600" />
                   <p className="text-blue-900 font-black text-[10px] uppercase">Telemetry</p>
                </div>
                <div className="col-span-2 bg-slate-50 rounded-2xl p-4 border border-slate-200">
                   <div className="h-1 w-full bg-white rounded-full overflow-hidden mb-1">
                      <div className="h-full bg-blue-600 w-[99%] animate-pulse"></div>
                   </div>
                   <p className="text-[8px] font-black text-slate-400 text-center uppercase tracking-widest">System Sync: 100%</p>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Tighter Grid */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div 
              key={idx} 
              className="p-8 rounded-[2rem] bg-slate-50 hover:bg-white border border-transparent hover:border-blue-100 transition-all duration-500 shadow-sm hover:shadow-xl hover:shadow-blue-600/5 group"
              data-aos="fade-up"
              data-aos-delay={feature.delay}
            >
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-6 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all border border-slate-100 text-blue-600">
                {feature.icon}
              </div>
              <h4 className="text-xl font-black text-slate-800 mb-2 group-hover:text-blue-700 transition-colors uppercase tracking-tighter leading-tight italic">{feature.title}</h4>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Refined CTA */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto rounded-[3rem] bg-blue-600 p-12 text-center text-white relative shadow-2xl overflow-hidden group">
           <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.1),transparent)] pointer-events-none"></div>
           <div className="relative z-10" data-aos="zoom-up">
              <h3 className="text-3xl md:text-4xl font-black mb-6 tracking-tighter italic uppercase text-shadow-sm">FUTURE-PROOF YOUR EMPIRE.</h3>
              <p className="text-blue-100 text-base mb-10 max-w-lg mx-auto font-medium">
                 Consult with our ERP architects and map your transition to a centralized intelligence system.
              </p>
              <Link to="/contact" className="inline-block px-10 py-4 bg-white text-blue-600 rounded-2xl font-black text-sm hover:scale-105 transition-all shadow-xl">
                 Consult Our Architects
              </Link>
           </div>
        </div>
      </section>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 15s linear infinite;
        }
      `}</style>

    </main>
  );
};

export default ErpSolutions;
