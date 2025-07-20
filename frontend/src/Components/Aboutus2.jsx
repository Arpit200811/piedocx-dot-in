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
    AOS.init({ duration: 1000, easing: "ease-in-out", once: true });
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
    <section className="max-w-screen-xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center gap-12 bg-white rounded-2xl">
      <style>
        {`
          @keyframes floatY {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-15px); }
          }

          .hover-box {
            position: relative;
            overflow: hidden;
            z-index: 1;
            transition: transform 1.5s ease-in-out;
          }

          .hover-box:hover {
            transform: translateY(-10px);
          }

          .hover-box::before {
            content: "";
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 0%;
            background: #3b82f6;
            z-index: -1;
            transition: height 1.6s ease;
          }

          .hover-box:hover::before {
            height: 100%;
          }
        `}
      </style>

      {/* Left Image */}
      <div className="md:w-1/2 flex justify-center">
        <img
          src="/choose-2.png"
          alt="Tech Illustration"
          className="w-full max-w-md"
          style={{
            animation: "floatY 3s ease-in-out infinite",
            background: "transparent",
          }}
        />
      </div>

      {/* Right Content */}
      <div className="md:w-1/2 space-y-2" data-aos="fade-left">
        <h2 className="text-2xl sm:text-3xl font-bold text-blue-600 leading-tight">
          Tech Soul for your Business
        </h2>
        <p className="text-gray-600 text-sm">
          We provide full-spectrum IT solutions tailored for your success — from web & app development to digital marketing. Unlock growth through scalable, smart, and secure digital strategies.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {services.map((service, index) => (
            <Link to={service.link} key={index}>
              <div
                className="hover-box p-4 bg-white rounded-xl flex items-center gap-3 text-base font-medium text-gray-600 border border-blue-500 hover:text-white transition-all duration-300"
                data-aos="fade-up"
              >
                <span className="text-xl">{service.icon}</span>
                <span>{service.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Aboutus2;
