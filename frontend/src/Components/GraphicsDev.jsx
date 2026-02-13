import { useEffect } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { 
  Palette, 
  Layers, 
  Sparkles, 
  Share2, 
  PenTool, 
  Layout, 
  ChevronRight,
  Brush,
  Box,
  MousePointer2
} from "lucide-react";

const GraphicsDev = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const features = [
    {
      title: "Brand Identity",
      desc: "Architecting iconic logos and visual languages that tell your story.",
      icon: <Palette className="w-5 h-5" />,
      delay: 0
    },
    {
      title: "UI/UX Mastery",
      desc: "Minimal interfaces designed to provide a frictionless user journey.",
      icon: <Layout className="w-5 h-5" />,
      delay: 50
    },
    {
      title: "Motion Narratives",
      desc: "Dynamic vector animations and cinematic transitions for your brand.",
      icon: <Sparkles className="w-5 h-5" />,
      delay: 100
    },
    {
      title: "Social Canvas",
      desc: "Scroll-stopping social media assets designed to maximize engagement.",
      icon: <Share2 className="w-5 h-5" />,
      delay: 150
    },
    {
      title: "Futuristic Art",
      desc: "Custom 3D and isometric artwork that positions your brand as a leader.",
      icon: <Box className="w-5 h-5" />,
      delay: 200
    },
    {
      title: "Print Engineering",
      desc: "Premium layouts for high-end brochures and hardware packaging.",
      icon: <Layers className="w-5 h-5" />,
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
              Visual Architecture
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-6 tracking-tighter">
              Design for the <br /> <span className="text-blue-600 underline decoration-blue-100 underline-offset-4 italic">Creative Century.</span>
            </h1>
            <p className="text-base text-slate-600 leading-relaxed mb-8 max-w-lg font-medium">
              We build visual strategies that communicate your value and command attention through elite aesthetics.
            </p>
            <div className="flex gap-4">
              <Link to="/contact" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg">
                Start Design Session
              </Link>
              <Link to="/projects" className="px-6 py-3 bg-white text-slate-900 border border-slate-200 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all">
                The Portfolio
              </Link>
            </div>
          </div>

          <div className="relative group scale-90 md:scale-100" data-aos="zoom-in">
             <div className="absolute -inset-4 bg-blue-100 rounded-full blur-3xl opacity-20"></div>
             <div className="relative bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-2xl overflow-hidden grid grid-cols-2 gap-4 max-w-sm mx-auto">
                <div className="bg-slate-900 rounded-2xl p-6 flex flex-col justify-between h-28 transform -rotate-2">
                   <Box size={24} className="text-blue-400" />
                   <p className="text-white text-[10px] font-black uppercase tracking-widest">3D Sculpt</p>
                </div>
                <div className="bg-blue-600 rounded-2xl p-6 flex flex-col justify-between h-28 transform rotate-2">
                   <Palette size={24} className="text-white" />
                   <p className="text-white text-[10px] font-black uppercase tracking-widest">Aesthetics</p>
                </div>
                <div className="col-span-2 bg-slate-50 rounded-2xl p-4 flex items-center gap-4">
                   <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center">
                      <Brush size={14} className="text-blue-600" />
                   </div>
                   <div className="h-1 flex-1 bg-blue-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 w-2/3 animate-pulse"></div>
                   </div>
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
              <h4 className="text-xl font-black text-slate-800 mb-2 group-hover:text-blue-700 transition-colors uppercase tracking-tighter italic">{feature.title}</h4>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Refined CTA */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto rounded-[3rem] bg-blue-600 p-12 text-center text-white relative shadow-2xl overflow-hidden group">
           <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_50%,rgba(255,255,255,0.1),transparent)] pointer-events-none"></div>
           <div className="relative z-10" data-aos="zoom-up">
              <h3 className="text-3xl md:text-4xl font-black mb-6 tracking-tighter italic uppercase text-shadow-sm">BECOME ICONIC.</h3>
              <p className="text-blue-100 text-base mb-10 max-w-lg mx-auto font-medium">
                 Turn your brand into a visual masterpiece with our elite design collective.
              </p>
              <Link to="/contact" className="inline-flex px-10 py-4 bg-white text-blue-600 rounded-2xl font-black text-sm hover:scale-105 transition-all shadow-xl items-center gap-2 mx-auto">
                 Initiate Build <MousePointer2 size={16} />
              </Link>
           </div>
        </div>
      </section>

    </main>
  );
};

export default GraphicsDev;
