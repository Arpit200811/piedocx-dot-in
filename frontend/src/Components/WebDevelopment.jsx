import { useEffect } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  Code2,
  Server,
  ShoppingCart,
  Search,
  MousePointer2,
  ChevronRight,
  LayoutGrid,
  Zap,
  Globe,
  ArrowRight
} from "lucide-react";

const WebDevelopment = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const features = [
    {
      title: "Custom Full-Stack",
      desc: "End-to-end web architectures using MERN & Next.js for high-speed applications.",
      icon: <Code2 className="w-5 h-5" />,
      delay: 0
    },
    {
      title: "Responsive Core",
      desc: "Infinite scalability with 'Mobile-First' philosophy across every browser.",
      icon: <LayoutGrid className="w-5 h-5" />,
      delay: 50
    },
    {
      title: "Backend Scalability",
      desc: "Mission-critical server logic using Node.js and Python with microservices.",
      icon: <Server className="w-5 h-5" />,
      delay: 100
    },
    {
      title: "E-Commerce Titan",
      desc: "Enterprise-grade shopping with custom checkouts and secure gateways.",
      icon: <ShoppingCart className="w-5 h-5" />,
      delay: 150
    },
    {
      title: "SEO Intelligence",
      desc: "Search optimization baked into code structure for maximum organic visibility.",
      icon: <Search className="w-5 h-5" />,
      delay: 200
    },
    {
      title: "Modern UI/UX",
      desc: "High-conversion designs focusing on user psychology and aesthetics.",
      icon: <MousePointer2 className="w-5 h-5" />,
      delay: 250
    }
  ];

  return (
    <main className="bg-white min-h-[calc(100vh-3.5rem)] md:min-h-[calc(100vh-4rem)] lg:min-h-[calc(100vh-5rem)] font-sans selection:bg-blue-100 selection:text-blue-600 overflow-x-hidden pt-0">

      {/* Compact Hero */}
      <section className="relative pt-6 pb-12 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/4 h-full bg-slate-50 opacity-50 transform skew-x-12 origin-top-right"></div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <div data-aos="fade-right">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 mb-4 text-[10px] font-black uppercase tracking-widest">
              Digital Architecture
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-6 tracking-tighter italic">
              Performance <br /> driven <span className="text-blue-600 underline decoration-blue-100 underline-offset-4">Web.</span>
            </h1>
            <p className="text-base text-slate-600 leading-relaxed mb-8 max-w-lg font-medium">
              We don't just build websites; we build business tools. Optimized for speed, SEO, and conversion to drive your growth.
            </p>
            <div className="flex gap-4">
              <Link to="/contact" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg flex items-center gap-2">
                Start Building <ArrowRight size={16} />
              </Link>
              <Link to="/services" className="px-6 py-3 bg-white text-slate-900 border border-slate-200 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all">
                The Stack
              </Link>
            </div>
          </div>

          <div className="relative group scale-90 md:scale-100" data-aos="zoom-in">
            <div className="absolute -inset-4 bg-blue-100 rounded-full blur-3xl opacity-20"></div>
            <div className="relative bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-2xl overflow-hidden max-w-sm mx-auto">
              <div className="flex justify-between items-start mb-6">
                <div className="space-y-2">
                  <div className="h-1.5 w-16 bg-blue-600 rounded-full"></div>
                  <div className="h-1.5 w-8 bg-slate-200 rounded-full"></div>
                </div>
                <Zap size={24} className="text-blue-600 animate-pulse" />
              </div>
              <div className="space-y-4">
                <div className="h-24 bg-slate-50 rounded-2xl border border-dashed border-slate-200 flex flex-col items-center justify-center p-4">
                  <Globe size={32} className="text-slate-300 mb-2" />
                  <p className="text-[8px] font-black text-slate-400 uppercase">Synchronizing...</p>
                </div>
                <div className="flex justify-between font-mono text-[9px] text-blue-400 italic">
                  <span>Status: Online</span>
                  <span>Uptime: 99.9%</span>
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
            <h3 className="text-3xl md:text-4xl font-black mb-6 tracking-tighter italic uppercase">Scale Your Digital Presence.</h3>
            <p className="text-blue-100 text-base mb-10 max-w-lg mx-auto font-medium">
              Ready to turn your vision into a global platform? Let's engineer your success today.
            </p>
            <Link to="/contact" className="inline-block px-10 py-4 bg-white text-blue-600 rounded-2xl font-black text-sm hover:scale-105 transition-all shadow-xl">
              Contact Our Experts
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
};

export default WebDevelopment;
