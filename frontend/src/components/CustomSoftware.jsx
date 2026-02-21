import { useEffect } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { 
  Puzzle, 
  Scaling, 
  ShieldCheck, 
  GitMerge, 
  Crown, 
  Zap, 
  ChevronRight,
  Code2,
  Terminal,
  MousePointer2,
  ArrowRight,
  Braces
} from "lucide-react";

const CustomSoftware = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const features = [
    {
      title: "Bespoke Architecture",
      desc: "Software engineered around your unique business logic, not off-the-shelf.",
      icon: <Puzzle className="w-5 h-5" />,
      delay: 0
    },
    {
      title: "Unlimited Scalability",
      desc: "Architectures that evolve from startup MVPs to enterprise-grade systems.",
      icon: <Scaling className="w-5 h-5" />,
      delay: 50
    },
    {
      title: "Hardened Security",
      desc: "Proprietary security layers and encryption protocols built into the core.",
      icon: <ShieldCheck className="w-5 h-5" />,
      delay: 100
    },
    {
      title: "Deep Integration",
      desc: "Native connectors for your existing CRM, ERP, and legacy systems.",
      icon: <GitMerge className="w-5 h-5" />,
      delay: 150
    },
    {
      title: "Full IP Ownership",
      desc: "100% ownership of source code. No licensing fees or vendor lock-ins.",
      icon: <Crown className="w-5 h-5" />,
      delay: 200
    },
    {
      title: "Performance Tuning",
      desc: "Low-level optimization ensuring maximum speed and resource efficiency.",
      icon: <Zap className="w-5 h-5" />,
      delay: 250
    }
  ];

  return (
    <main className="bg-white min-h-screen font-sans selection:bg-blue-100 selection:text-blue-600 overflow-x-hidden pt-0">
      
      {/* Compact Hero */}
      <section className="relative pt-14 md:pt-16 lg:pt-20 pb-12 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/4 h-full bg-slate-50 opacity-50 transform -skew-x-12 origin-top-right"></div>
        
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <div data-aos="fade-right">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 mb-4 text-[10px] font-black uppercase tracking-widest">
              <Braces size={12} /> Solution Engineering
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-6 tracking-tighter">
              Build the <br /> <span className="text-blue-600 underline decoration-blue-100 underline-offset-4 italic">Unimaginable.</span>
            </h1>
            <p className="text-base text-slate-600 leading-relaxed mb-8 max-w-lg font-medium">
              We engineer competitive advantages. Get a custom-built digital ecosystem that works exactly how your business thinks.
            </p>
            <div className="flex gap-4">
              <Link to="/contact" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg flex items-center gap-2">
                Assemble Project <ArrowRight size={16} />
              </Link>
              <Link to="/services" className="px-6 py-3 bg-white text-slate-900 border border-slate-200 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all">
                The Tech Stack
              </Link>
            </div>
          </div>

          <div className="relative group scale-90 md:scale-100" data-aos="zoom-in">
             <div className="absolute -inset-4 bg-blue-200 opacity-10 rounded-full blur-[60px]"></div>
             <div className="relative bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden border border-slate-800 max-w-sm mx-auto">
                <Terminal size={320} className="text-white opacity-5 absolute -bottom-10 -right-10 rotate-12 transition-transform duration-1000 group-hover:scale-110" />
                <div className="relative z-10 space-y-4 h-48 flex flex-col justify-between italic">
                   <div className="flex gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                   </div>
                   <div className="font-mono text-[9px] text-blue-400">
                      <p>&gt; init.architecture()</p>
                      <p>&gt; secure_core.load()</p>
                      <p className="text-slate-500">// Ready to build...</p>
                   </div>
                   <h4 className="text-3xl font-black text-white italic tracking-tighter">{"{ Native }"}</h4>
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
           <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.1),transparent)] pointer-events-none"></div>
           <div className="relative z-10" data-aos="zoom-up">
              <h3 className="text-3xl md:text-4xl font-black mb-6 tracking-tighter italic uppercase text-shadow-sm">OWN THE SOURCE. OWN THE MARKET.</h3>
              <p className="text-blue-100 text-base mb-10 max-w-lg mx-auto font-medium">
                 Don't build on rented land. We engineer proprietary software that puts 100% control back in your hands.
              </p>
              <Link to="/contact" className="inline-flex px-10 py-4 bg-white text-blue-600 rounded-2xl font-black text-sm hover:scale-105 transition-all shadow-xl items-center gap-2 mx-auto">
                 Define Blueprint <MousePointer2 size={16} />
              </Link>
           </div>
        </div>
      </section>

    </main>
  );
};

export default CustomSoftware;
