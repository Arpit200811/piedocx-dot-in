import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Link } from "react-router-dom";
import {
  Code2,
  Smartphone,
  PenTool,
  Globe,
  Palette,
  Megaphone
} from "lucide-react";

const Aboutus2 = () => {
  useEffect(() => {
    AOS.init({ duration: 1200, easing: "ease-in-out", once: true });
  }, []);

  const services = [
    { name: "Web App Development", icon: <Code2 strokeWidth={1.5} />, link: "/services/web-development", color: "text-blue-600" },
    { name: "Android & IOS", icon: <Smartphone strokeWidth={1.5} />, link: "/services/android-ios", color: "text-indigo-600" },
    { name: "UX/UI Designing", icon: <PenTool strokeWidth={1.5} />, link: "/services/custom-software", color: "text-purple-600" },
    { name: "Domain & Hosting", icon: <Globe strokeWidth={1.5} />, link: "/services/domain-web-hosting", color: "text-sky-600" },
    { name: "Graphic Designing", icon: <Palette strokeWidth={1.5} />, link: "/services/graphic-design", color: "text-pink-600" },
    { name: "Digital Marketing", icon: <Megaphone strokeWidth={1.5} />, link: "/services/digital-marketing", color: "text-cyan-600" },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-12 md:py-24">
      <div className="flex flex-col lg:flex-row items-center gap-10 md:gap-16">

        {/* Left Side: Content */}
        <div className="lg:w-1/2" data-aos="fade-right">
          <div className="space-y-6">
            <h2 className="text-blue-600 font-bold uppercase tracking-widest text-[10px] md:text-sm">Grow with Expertise</h2>
            <h3 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight">
              A Tech Soul Designed for Your <span className="text-premium">Ambition.</span>
            </h3>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed">
              Piedocx Technologies isn't just a development agency; we're your architectural partners. We build the digital backbone that lets your business scale effortlessly in an ever-evolving market.
            </p>

            {/* Functional Grid - Matching Style of Aboutus1 */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 pt-4 md:pt-6">
              {services.map((service, index) => (
                <Link to={service.link} key={index} className="group">
                  <div className="p-4 rounded-2xl bg-gray-50 border border-transparent hover:border-blue-100 hover:bg-white hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 flex flex-col items-center text-center gap-3">
                    <div className={`text-3xl transition-transform duration-500 group-hover:scale-110 ${service.color}`}>
                      {service.icon}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-tighter text-gray-500 group-hover:text-blue-600 transition-colors">
                      {service.name}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Creative Image Frame */}
        <div className="lg:w-1/2 relative w-full" data-aos="fade-left">
          <div className="absolute -inset-4 bg-gradient-to-tr from-blue-100 to-indigo-50 rounded-[3rem] blur-3xl opacity-50"></div>
          <img
            src="/choose-2.png"
            alt="Tech Illustration"
            className="relative w-full max-w-[300px] md:max-w-lg mx-auto animate-float-slow mix-blend-multiply brightness-[1.1] contrast-[1.1]"
          />
          <div className="absolute top-5 right-5 md:top-10 md:right-10 w-14 h-14 md:w-20 md:h-20 bg-white/40 backdrop-blur-md rounded-xl md:rounded-2xl border border-white/40 shadow-xl flex items-center justify-center animate-bounce duration-[4s]">
            <Code2 className="text-blue-600 text-2xl md:text-3xl" strokeWidth={1.5} />
          </div>
        </div>

      </div>

      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-float-slow {
          animation: float-slow 5s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default Aboutus2;
