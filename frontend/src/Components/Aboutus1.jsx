import { useEffect } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  FaNodeJs,
  FaPhp,
  FaPython,
  FaJava,
} from "react-icons/fa";
import { SiDotnet, SiFlutter } from "react-icons/si";

const AboutUs = () => {
  const topics = [
    { name: "MERN STACK", link: "/aboutus1/mern", icon: <FaNodeJs />, color: "text-green-600" },
    { name: ".Net Core", link: "/aboutus1/dotnet-core", icon: <SiDotnet />, color: "text-blue-600" },
    { name: "PHP Core", link: "/aboutus1/php-core", icon: <FaPhp />, color: "text-indigo-600" },
    { name: "Python", link: "/aboutus1/python", icon: <FaPython />, color: "text-yellow-600" },
    { name: "Advance JAVA", link: "/aboutus1/advance-java", icon: <FaJava />, color: "text-red-600" },
    { name: "Flutter/Kotlin", link: "/aboutus1/flutter-kotlin", icon: <SiFlutter />, color: "text-sky-500" },
  ];

  useEffect(() => {
    AOS.init({ duration: 1200, once: true });
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-6 py-12 md:py-20 bg-white">
      <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
        
        {/* Left: Content */}
        <div className="md:w-1/2 space-y-6 md:space-y-8" data-aos="fade-right">
          <div className="space-y-4">
            <h2 className="text-blue-600 font-bold uppercase tracking-widest text-[10px] md:text-sm">Industrial Expertise</h2>
            <h3 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight">
              Website Solutions for the <span className="text-premium">Modern Era.</span>
            </h3>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed">
              We don't just write code; we engineer experiences. Our expert developers specialize in building responsive, functional, and interactive solutions tailored to your unique business scale.
            </p>
          </div>
 
          {/* Topics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {topics.map((topic, index) => (
              <Link to={topic.link} key={index} className="group">
                <div className="p-3 md:p-4 rounded-2xl bg-gray-50 border border-transparent hover:border-blue-100 hover:bg-white hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 flex flex-col items-center text-center gap-2 md:gap-3">
                  <div className={`text-2xl md:text-3xl transition-transform duration-500 group-hover:scale-110 ${topic.color}`}>
                    {topic.icon}
                  </div>
                  <span className="text-[9px] md:text-[10px] font-black uppercase tracking-tighter text-gray-500 group-hover:text-blue-600 transition-colors">
                    {topic.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Right: Asset */}
        <div className="md:w-1/2 flex justify-center relative" data-aos="zoom-in" data-aos-delay="200">
          <div className="absolute inset-0 bg-blue-100/50 rounded-full blur-[120px] -z-0"></div>
          <img
            src="/choose-1.png"
            alt="Website Solutions"
            className="relative w-full max-w-md animate-float-slow mix-blend-multiply brightness-[1.1] contrast-[1.1]"
          />
        </div>
      </div>

      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-float-slow {
          animation: float-slow 4s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default AboutUs;
