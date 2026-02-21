import { useEffect } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { 
  Smartphone, 
  Cpu, 
  Zap, 
  ShieldCheck, 
  Layers, 
  Layout, 
  Share2,
  ChevronRight,
  Code2,
  Globe,
  ArrowRight
} from "lucide-react";

const AndroidDev = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const features = [
    {
      title: "UI/UX Architecture",
      desc: "Pixel-perfect interfaces designed for human interaction using Material You.",
      icon: <Layout className="w-5 h-5" />,
      delay: 0
    },
    {
      title: "Native Android",
      desc: "Robust applications built with Kotlin and Jetpack Compose for the ultimate experience.",
      icon: <Code2 className="w-5 h-5" />,
      delay: 50
    },
    {
      title: "Swift iOS",
      desc: "Fluid, high-performance apps using SwiftUI and the latest Apple system features.",
      icon: <Smartphone className="w-5 h-5" />,
      delay: 100
    },
    {
      title: "Cross-Platform",
      desc: "Single codebase solutions with React Native & Flutter that feel and perform native.",
      icon: <Layers className="w-5 h-5" />,
      delay: 150
    },
    {
      title: "API Ecosystem",
      desc: "Seamlessly connect with GraphQL, REST, and Real-time databases for apps.",
      icon: <Share2 className="w-5 h-5" />,
      delay: 200
    },
    {
      title: "Performance",
      desc: "Optimized startup times and smooth 60fps animations for a premium user feel.",
      icon: <Zap className="w-5 h-5" />,
      delay: 250
    }
  ];

  return (
    <main className="bg-white min-h-screen font-sans selection:bg-blue-100 selection:text-blue-600 overflow-x-hidden pt-0">
      
      {/* Compact Hero */}
      <section className="relative pt-14 md:pt-16 lg:pt-20 pb-12 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/4 h-full bg-blue-50 opacity-50 transform -skew-x-12 origin-top-right"></div>
        
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <div data-aos="fade-right">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 mb-4 text-[10px] font-black uppercase tracking-widest">
              Mobile Core Excellence
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-6 tracking-tighter italic">
              Build the App <br /> of the <span className="text-blue-600 underline decoration-blue-100 underline-offset-4">Future.</span>
            </h1>
            <p className="text-base text-slate-600 leading-relaxed mb-8 max-w-lg font-medium">
              We engineer mobile experiences that are fast, secure, and addictive. From concept to App Store, we deliver absolute performance.
            </p>
            <div className="flex gap-4">
              <Link to="/contact" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg flex items-center gap-2">
                Request Quote <ArrowRight size={16} />
              </Link>
              <Link to="/projects" className="px-6 py-3 bg-white text-slate-900 border border-slate-200 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all">
                The Portfolio
              </Link>
            </div>
          </div>

          <div className="relative group scale-90 md:scale-100" data-aos="zoom-in">
             <div className="absolute -inset-4 bg-blue-100 rounded-full blur-3xl opacity-20"></div>
             <div className="relative bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-2xl overflow-hidden max-w-sm mx-auto flex flex-col items-center">
                <div className="w-full flex justify-between mb-8 px-2">
                   <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
                   </div>
                   <Smartphone size={16} className="text-blue-600" />
                </div>
                <div className="w-48 h-80 bg-slate-900 rounded-[2.5rem] p-4 border-[6px] border-slate-800 shadow-xl flex flex-col justify-between">
                   <div className="w-1/3 h-1 bg-slate-800 mx-auto rounded-full"></div>
                   <div className="flex-1 flex flex-col items-center justify-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg animate-pulse">
                         <Zap size={24} />
                      </div>
                      <p className="font-mono text-[8px] text-blue-400 text-center tracking-tighter underline">Optimization: ACTIVE</p>
                   </div>
                   <div className="h-1 w-1/4 bg-slate-800 mx-auto rounded-full"></div>
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
              <h3 className="text-3xl md:text-4xl font-black mb-6 tracking-tighter italic uppercase text-shadow-sm">READY TO DOMINATE THE APP STORE?</h3>
              <p className="text-blue-100 text-base mb-10 max-w-lg mx-auto font-medium">
                 Get a free strategy call with our lead architect and blueprint your next mobile product.
              </p>
              <Link to="/contact" className="inline-block px-10 py-4 bg-white text-blue-600 rounded-2xl font-black text-sm hover:scale-105 transition-all shadow-xl">
                 Get a Free Estimate
              </Link>
           </div>
        </div>
      </section>

    </main>
  );
};

export default AndroidDev;
