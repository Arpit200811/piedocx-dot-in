import { useEffect } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { 
  TrendingUp, 
  Target, 
  Users, 
  BarChart3, 
  MousePointer2, 
  PieChart, 
  ChevronRight,
  Zap,
  ArrowUpRight
} from "lucide-react";

const DigitalMarketing = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const features = [
    {
      title: "Content Strategy",
      desc: "Data-backed storytelling that positions your brand as a market leader.",
      icon: <Target className="w-5 h-5" />,
      delay: 0
    },
    {
      title: "Performance SEO",
      desc: "Dominating search results through technical optimization and link building.",
      icon: <TrendingUp className="w-5 h-5" />,
      delay: 50
    },
    {
      title: "Social Ecosystems",
      desc: "Building communities on LinkedIn & Instagram with viral campaigns.",
      icon: <Users className="w-5 h-5" />,
      delay: 100
    },
    {
      title: "Precision Ads",
      desc: "Targeted PPC and Social Ads with automated bidding for maximum ROI.",
      icon: <BarChart3 className="w-5 h-5" />,
      delay: 150
    },
    {
      title: "Conversion Funnels",
      desc: "Optimizing landing pages to turn every click into a customer.",
      icon: <MousePointer2 className="w-5 h-5" />,
      delay: 200
    },
    {
      title: "Advanced Analytics",
      desc: "Real-time dashboards tracking CAC, LTV, and conversion metrics.",
      icon: <PieChart className="w-5 h-5" />,
      delay: 250
    }
  ];

  return (
    <main className="bg-white min-h-screen font-sans selection:bg-blue-100 selection:text-blue-600 overflow-x-hidden pt-0">
      
      {/* Compact Hero */}
      <section className="relative pt-14 md:pt-16 lg:pt-20 pb-12 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/4 h-full bg-slate-50 opacity-50 transform skew-x-12 origin-top-right"></div>
        
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <div data-aos="fade-right">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 mb-4 text-[10px] font-black uppercase tracking-widest">
              Growth Engineering
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-6 tracking-tighter">
              Amplify Your <br /> <span className="text-blue-600 underline decoration-blue-100 underline-offset-4">Digital Voice.</span>
            </h1>
            <p className="text-base text-slate-600 leading-relaxed mb-8 max-w-lg font-medium">
              We engineer growth using data, user psychology, and relentless optimization to dominate your industry.
            </p>
            <div className="flex gap-4">
              <Link to="/contact" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg flex items-center gap-2">
                Get Growth Plan <ArrowUpRight size={16} />
              </Link>
              <Link to="/projects" className="px-6 py-3 bg-white text-slate-900 border border-slate-200 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all">
                Case Studies
              </Link>
            </div>
          </div>

          <div className="relative group scale-90 md:scale-100" data-aos="zoom-in">
             <div className="absolute -inset-10 bg-blue-400 opacity-5 blur-3xl rounded-full"></div>
             <div className="relative bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-2xl overflow-hidden grid grid-cols-2 gap-4">
                <div className="bg-slate-900 rounded-2xl p-6 flex flex-col justify-between h-32">
                   <TrendingUp className="text-blue-400" size={24} />
                   <p className="text-white text-xl font-black italic">12.5x</p>
                </div>
                <div className="bg-blue-50 rounded-2xl p-6 flex flex-col justify-between h-32 border border-blue-100">
                   <Zap className="text-blue-600" size={24} />
                   <p className="text-blue-900 text-sm font-bold">Fast Scale</p>
                </div>
                <div className="col-span-2 bg-slate-50 border border-slate-100 rounded-2xl p-6">
                   <div className="flex justify-between items-center h-4 bg-white rounded-full overflow-hidden mb-2">
                      <div className="h-full bg-blue-600 w-2/3 animate-pulse"></div>
                   </div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">ROI Optimization Active</p>
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
        <div className="max-w-5xl mx-auto rounded-[3rem] bg-blue-600 p-12 text-center text-white relative shadow-2xl overflow-hidden">
           <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.1),transparent)] pointer-events-none"></div>
           <div className="relative z-10" data-aos="zoom-up">
              <h3 className="text-3xl md:text-4xl font-black mb-6 tracking-tighter italic uppercase">STOP GUESSING. START GROWING.</h3>
              <p className="text-blue-100 text-base mb-10 max-w-lg mx-auto font-medium">
                 Join partners who scaled their enterprise with our performance marketing blueprints.
              </p>
              <Link to="/contact" className="inline-block px-10 py-4 bg-white text-blue-600 rounded-2xl font-black text-sm hover:scale-105 transition-all shadow-xl">
                 Claim Growth Audit
              </Link>
           </div>
        </div>
      </section>

    </main>
  );
};

export default DigitalMarketing;
