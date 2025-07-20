import { useEffect } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

// Importing icons
import {
  FaNodeJs,
  FaPhp,
  FaPython,
  FaJava,
  FaMobileAlt,
} from "react-icons/fa";
import { SiDotnet, SiFlutter } from "react-icons/si";

const AboutUs = () => {
  // Topics with corresponding icons
  const topics = [
    { name: "MERN STACK", link: "/mern", aos: "fade-up-right", icon: <FaNodeJs size={20} /> },
    { name: ".Net Core", link: "/dotnet", aos: "fade-up", icon: <SiDotnet size={20} /> },
    { name: "PHP Core", link: "/php", aos: "fade-up-left", icon: <FaPhp size={20} /> },
    { name: "Python", link: "/python", aos: "zoom-in-right", icon: <FaPython size={20} /> },
    { name: "Advance JAVA", link: "/java", aos: "zoom-in", icon: <FaJava size={20} /> },
    { name: "Flutter/Kotlin", link: "/flutter-kotlin", aos: "zoom-in-left", icon: <SiFlutter size={20} /> },
  ];

  useEffect(() => {
    AOS.init({ duration: 1200, once: true });
  }, []);

  return (
    <>
      <style>
        {`
          @keyframes floatY {
            0% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0); }
          }

          .hover-slide::before {
            content: "";
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, #2563eb, #3b82f6);
            transform: translateY(100%);
            transition: transform 1.2s cubic-bezier(0.65, 0, 0.35, 1);
            z-index: 0;
          }

          .group:hover .hover-slide::before {
            transform: translateY(0);
          }

          .hover-text {
            transition: color 0.6s cubic-bezier(0.65, 0, 0.35, 1);
          }

          .group:hover .hover-text {
            color: white;
          }
        `}
      </style>

      {/* 🔹 Section Title */}
      <div className="flex items-center justify-center mb-6" data-aos="fade-down">
        <h3 className="text-2xl md:text-3xl font-bold text-gray-800 border-b-4 border-blue-500 px-4 pb-1">
          What We Offer
        </h3>
      </div>

      {/* 🔹 Main Section */}
      <div className="max-w-6xl mx-auto px-3 py-8 flex flex-col-reverse md:flex-row items-center gap-6">
        
        {/* 🔹 Left - Text + Cards */}
        <div className="w-full md:w-1/2 space-y-5">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900" data-aos="fade-right">
            Website <span className="text-blue-500">Solutions</span>
          </h2>
          <p className=" text-gray-700 leading-relaxed" data-aos="fade-left" data-aos-delay="300">
            Our expert developers specialize in building responsive, functional,
            and interactive web and app solutions tailored to your business needs.
          </p>

          {/* 🔹 Topics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {topics.map((topic, index) => (
              <Link to={topic.link} key={index}>
                <div
                  className="group relative overflow-hidden rounded-lg bg-white 
                  shadow-[rgba(0,0,0,0.1)_0px_4px_12px] transform transition duration-300 
                  hover:scale-105 h-16 flex items-center justify-center 
                  border border-gray-300 group-hover:border-blue-500"
                  data-aos={topic.aos}
                  data-aos-delay={index * 100}
                >
                  <div className="hover-slide absolute inset-0 rounded-lg"></div>
                  <div className="relative z-10 px-2 py-1">
                    <h3 className="text-sm font-medium text-gray-800 hover-text flex items-center gap-2">
                      <span>{topic.icon}</span> {topic.name}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* 🔹 Right - Floating Image */}
        <div className="w-full md:w-1/2 flex justify-center" data-aos="flip-left" data-aos-delay="200">
          <img
            src="/choose-1.png"
            alt="Website Solutions"
            className="w-full max-w-xs md:max-w-sm"
            style={{ animation: "floatY 3s ease-in-out infinite" }}
          />
        </div>
      </div>
    </>
  );
};

export default AboutUs;
