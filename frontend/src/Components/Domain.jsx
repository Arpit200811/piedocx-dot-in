import { useEffect } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { 
  Globe, 
  Server, 
  ShieldCheck, 
  Cloud, 
  Zap, 
  ChevronRight,
  Database,
  Cpu,
  HardDrive,
  ArrowUpRight
} from "lucide-react";

const Domain = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const features = [
    {
      title: "Edge Cloud Hosting",
      desc: "Distributed networks ensuring sub-100ms load times globally.",
      icon: <Cloud className="w-5 h-5" />,
      delay: 0
    },
    {
      title: "Bare Metal VPS",
      desc: "High-performance environments with dedicated CPU and NVMe storage.",
      icon: <Server className="w-5 h-5" />,
      delay: 50
    },
    {
      title: "Web3 Domains",
      desc: "Secure your identity across classic .com and decentralized namespaces.",
      icon: <Globe className="w-5 h-5" />,
      delay: 100
    },
    {
      title: "Fortified Security",
      desc: "DDoS protection, automated SSL, and daily backups as standard.",
      icon: <ShieldCheck className="w-5 h-5" />,
      delay: 150
    },
    {
      title: "Managed DevOps",
      desc: "Expert server management including security patches and app optimization.",
      icon: <Cpu className="w-5 h-5" />,
      delay: 200
    },
    {
      title: "Private Clusters",
      desc: "Dedicated internal networks for enterprise apps requiring isolation.",
      icon: <Database className="w-5 h-5" />,
      delay: 250
    }
  ];

  return (
    <main className="bg-white min-h-screen font-sans selection:bg-blue-100 selection:text-blue-600 overflow-x-hidden pt-0">
      
      {/* Compact Hero */}
      <section className="relative pt-14 md:pt-16 lg:pt-20 pb-10 md:pb-12 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/4 h-full bg-slate-50 opacity-50 transform skew-x-[-12deg] origin-top-right"></div>
        
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-12 items-center relative z-10">
          <div data-aos="fade-right">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 mb-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest leading-none">
              Infrastructure Core
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight mb-4 md:mb-6 tracking-tighter italic">
              Zero Latency <br /> <span className="text-blue-600 underline decoration-blue-100 underline-offset-4">Digital Foundation.</span>
            </h1>
            <p className="text-sm md:text-base text-slate-600 leading-relaxed mb-6 md:mb-8 max-w-lg font-medium">
              We provide the heartbeat for modern enterprise. Secure, scalable, and ultra-fast hosting designed for traffic demands.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
              <Link to="/contact" className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg flex items-center justify-center gap-2">
                Check Availability <ArrowUpRight size={16} />
              </Link>
              <Link to="/services" className="w-full sm:w-auto px-6 py-3 bg-white text-slate-900 border border-slate-200 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all text-center">
                Custom Config
              </Link>
            </div>
          </div>

          <div className="relative group scale-90 md:scale-100" data-aos="zoom-in">
             <div className="absolute -inset-4 bg-emerald-100 rounded-full blur-3xl opacity-20"></div>
             <div className="relative bg-slate-900 rounded-[2.5rem] p-8 border border-slate-800 shadow-2xl overflow-hidden max-w-sm mx-auto">
                <div className="flex justify-between items-center mb-6">
                   <HardDrive size={24} className="text-blue-400 opacity-40" />
                   <div className="flex gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                   </div>
                </div>
                <div className="space-y-4">
                   <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 w-[45%] animate-pulse"></div>
                   </div>
                   <div className="flex justify-between font-mono text-[9px] text-blue-400">
                      <span>Latency: 24ms</span>
                      <span>Health: 100%</span>
                   </div>
                   <p className="text-xl font-black text-white/10 tracking-widest text-center mt-4 uppercase">Infrastructure</p>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Tighter Grid */}
      <section className="py-12 md:py-16 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {features.map((feature, idx) => (
            <div 
              key={idx} 
              className="p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] bg-slate-50 hover:bg-white border border-transparent hover:border-blue-100 transition-all duration-500 shadow-sm hover:shadow-xl hover:shadow-blue-600/5 group"
              data-aos="fade-up"
              data-aos-delay={feature.delay}
            >
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl flex items-center justify-center mb-4 md:mb-6 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all border border-slate-100 text-blue-600">
                {feature.icon}
              </div>
              <h4 className="text-lg md:text-xl font-black text-slate-800 mb-2 group-hover:text-blue-700 transition-colors uppercase tracking-tighter italic leading-tight">{feature.title}</h4>
              <p className="text-[13px] md:text-sm text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Refined CTA */}
      <section className="py-10 md:py-12 px-6">
        <div className="max-w-5xl mx-auto rounded-[2rem] md:rounded-[3rem] bg-blue-600 p-8 md:p-12 text-center text-white relative shadow-2xl overflow-hidden group">
           <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.1),transparent)] pointer-events-none"></div>
           <div className="relative z-10" data-aos="zoom-up">
              <h3 className="text-2xl md:text-4xl font-black mb-4 md:mb-6 tracking-tighter italic uppercase underline decoration-white/20 underline-offset-8">YOUR EMPIRE ON SOLID GROUND.</h3>
              <p className="text-blue-100 text-[13px] md:text-base mb-8 md:mb-10 max-w-lg mx-auto font-medium">
                 Deploy your vision on the most resilient hosting network available today.
              </p>
              <Link to="/contact" className="inline-flex px-10 py-4 bg-white text-blue-600 rounded-2xl font-black text-sm hover:scale-105 transition-all shadow-xl items-center gap-2 mx-auto uppercase">
                 Get Consultation <ChevronRight size={16} />
              </Link>
           </div>
        </div>
      </section>

    </main>
  );
};

export default Domain;
