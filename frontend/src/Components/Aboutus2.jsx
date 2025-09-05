import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Link } from "react-router-dom";
import {
  FaCode,
  FaMobileAlt,
  FaPaintBrush,
  FaServer,
  FaPalette,
  FaBullhorn,
} from "react-icons/fa";

const Aboutus2 = () => {
  useEffect(() => {
    AOS.init({ duration: 1200, easing: "ease-in-out", once: true });
  }, []);

  const services = [
    { name: "Web App Development", icon: <FaCode />, link: "/web-development" },
    { name: "Android & IOS", icon: <FaMobileAlt />, link: "/android-ios" },
    { name: "UX/UI Designing", icon: <FaPaintBrush />, link: "/Custom-Software-Development" },
    { name: "Domain & Web-Hosting", icon: <FaServer />, link: "/Domain & Web Hosting" },
    { name: "Graphic Designing", icon: <FaPalette />, link: "/Graphic-design" },
    { name: "Digital Marketing", icon: <FaBullhorn />, link: "/DigitalMarketing" },
  ];

  return (
    <section className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-12 py-12 flex flex-col md:flex-row items-start gap-8 bg-white rounded-2xl">
      <style>
        {`
          /* Floating animation for image */
          @keyframes floatY {
            0% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0); }
          }

          /* Hover slide effect for service boxes */
          .hover-slide::before {
            content: "";
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, #2563eb, #3b82f6);
            transform: translateY(100%);
            transition: transform 0.7s cubic-bezier(0.65, 0, 0.35, 1);
            z-index: 0;
            border-radius: 0.75rem; /* match rounded-xl */
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

          .hover-group {
            position: relative;
            overflow: hidden;
          }
        `}
      </style>

      {/* Left Image */}
      <div className="md:w-1/2 flex justify-center md:justify-start mb-6 md:mb-0" data-aos="fade-right">
        <img
          src="/choose-2.png"
          alt="Tech Illustration"
          className="w-3/4 sm:w-2/3 md:w-full max-w-md"
          style={{ animation: "floatY 3s ease-in-out infinite" }}
        />
      </div>

      {/* Right Content */}
      <div className="md:w-1/2 flex flex-col justify-start items-start space-y-4" data-aos="fade-left">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600 leading-tight">
          Tech Soul for your Business
        </h2>
        <p className="text-gray-600 text-sm sm:text-base md:text-lg">
          We provide full-spectrum IT solutions tailored for your success — from web & app development to digital marketing. Unlock growth through scalable, smart, and secure digital strategies.
        </p>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 w-full">
          {services.map((service, index) => (
            <Link to={service.link} key={index} className="w-full">
              <div
                className="group hover-group h-16 flex items-center justify-center rounded-xl border border-gray-300 shadow-[rgba(0,0,0,0.1)_0px_4px_12px] transform transition duration-300 hover:scale-105 px-3"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="hover-slide absolute inset-0 rounded-xl"></div>
                <div className="relative z-10 flex items-center gap-2 justify-center text-center w-full">
                  <span className="text-xl flex-shrink-0">{service.icon}</span>
                  <span className="text-sm sm:text-base md:text-base truncate hover-text">{service.name}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Aboutus2;
