import { useEffect } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { 
  FileEdit, 
  Layout, 
  Search, 
  Users, 
  ShieldCheck, 
  Zap, 
  Layers,
  ChevronRight,
  Share2,
  MousePointer2,
  Globe,
  Monitor
} from "lucide-react";

const CMSSolution = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const features = [
    {
      title: "No-Code Editing",
      desc: "Empower non-technical teams to create and publish high-performance pages.",
      icon: <FileEdit className="w-5 h-5" />,
      delay: 0
    },
    {
      title: "Headless Architecture",
      desc: "API-driven content layer that serves web, mobile, and IoT apps simultaneously.",
      icon: <Layers className="w-5 h-5" />,
      delay: 50
    },
    {
      title: "SEO Automation",
      desc: "Automatic schema generation and sitemap management baked into the core.",
      icon: <Search className="w-5 h-5" />,
      delay: 100
    },
    {
      title: "Granular Permissions",
      desc: "Advanced RBAC systems for multi-author environments and workflows.",
      icon: <Users className="w-5 h-5" />,
      delay: 150
    },
    {
      title: "Edge Delivery",
      desc: "Static site generation and global CDN caching for instant page loads.",
      icon: <Zap className="w-5 h-5" />,
      delay: 200
    },
    {
      title: "Infinite Extensibility",
      desc: "Native support for third-party plugins and custom modules.",
      icon: <Share2 className="w-5 h-5" />,
      delay: 250
    }
  ];

  return (
    <main className="bg-white min-h-screen font-sans selection:bg-blue-100 selection:text-blue-600 overflow-x-hidden pt-0">
      
      {/* Compact Hero */}
      <section className="relative pt-14 md:pt-16 lg:pt-20 pb-12 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/4 h-full bg-blue-50/20 -skew-x-12 transform origin-top-right"></div>
        
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <div data-aos="fade-right">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 mb-4 text-[10px] font-black uppercase tracking-widest">
              <Layout size={12} /> Digital Experience Platform
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-6 tracking-tighter italic">
               Manage Content <br /> <span className="text-blue-600 underline decoration-blue-100 underline-offset-4">Without Limits.</span>
            </h1>
            <p className="text-base text-slate-600 leading-relaxed mb-8 max-w-lg font-medium">
              We build intelligent Content Management Systems that give you total control over your digital narrative.
            </p>
            <div className="flex gap-4">
              <Link to="/contact" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg flex items-center gap-2">
                Explore Engine <ChevronRight size={16} />
              </Link>
              <Link to="/services" className="px-6 py-3 bg-white text-slate-900 border border-slate-200 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all">
                The Architecture
              </Link>
            </div>
          </div>

          <div className="relative group scale-90 md:scale-100" data-aos="zoom-in">
             <div className="absolute -inset-4 bg-blue-100 rounded-full blur-3xl opacity-20"></div>
             <div className="relative bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-2xl overflow-hidden max-w-sm mx-auto">
                <div className="flex items-center justify-between mb-6">
                   <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
                   </div>
                   <p className="text-[8px] font-mono text-slate-300 italic">cms_ Piedocx</p>
                </div>
                <div className="space-y-4">
                   <div className="h-10 bg-slate-50 rounded-xl border border-dashed border-slate-200 flex items-center justify-center">
                      <Zap size={16} className="text-blue-600 animate-pulse" />
                   </div>
                   <div className="grid grid-cols-2 gap-2">
                      <div className="h-16 bg-slate-900 rounded-xl p-3 flex flex-col justify-between">
                         <div className="h-1 w-1/2 bg-blue-500/50 rounded-full"></div>
                         <p className="text-[7px] text-white font-black uppercase">Edge Cache</p>
                      </div>
                      <div className="h-16 bg-blue-50 border border-blue-100 rounded-xl p-3 flex flex-col justify-between">
                         <Globe size={14} className="text-blue-600" />
                         <p className="text-[7px] text-blue-900 font-black uppercase">Deploy</p>
                      </div>
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
              <h4 className="text-xl font-black text-slate-800 mb-2 group-hover:text-blue-700 transition-colors uppercase tracking-tighter leading-tight italic">{feature.title}</h4>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Refined CTA */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto rounded-[3rem] bg-blue-600 p-12 text-center text-white relative shadow-2xl overflow-hidden group">
           <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.1),transparent)] pointer-events-none"></div>
           <div className="relative z-10" data-aos="zoom-up">
              <h3 className="text-3xl md:text-4xl font-black mb-6 tracking-tighter italic uppercase text-shadow-sm">RECLAIM YOUR DIGITAL STORY.</h3>
              <p className="text-blue-100 text-base mb-10 max-w-lg mx-auto font-medium">
                 Switch to a CMS that empowers your creativity instead of limiting it.
              </p>
              <Link to="/contact" className="inline-flex px-10 py-4 bg-white text-blue-600 rounded-2xl font-black text-sm hover:scale-105 transition-all shadow-xl items-center gap-2 mx-auto">
                 Launch Prototype <MousePointer2 size={16} />
              </Link>
           </div>
        </div>
      </section>

    </main>
  );
};

export default CMSSolution;
