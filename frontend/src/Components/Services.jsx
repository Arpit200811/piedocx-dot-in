import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import {
  FaLaptopCode,
  FaMobileAlt,
  FaBullhorn,
  FaPaintBrush,
  FaGlobe,
  FaServer,
  FaCogs,
  FaProjectDiagram,
  FaWpforms,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Services = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, easing: 'ease-in-out', once: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const services = [
    {
      title: "Full Stack Development",
      path: "/Full-Stackdev",
      icon: <FaLaptopCode />,
      color: "text-blue-600",
    },
    {
      title: "Android & iOS App Development",
      path: "/Android-iOS",
      icon: <FaMobileAlt />,
      color: "text-green-600",
    },
    {
      title: "Digital Marketing",
      path: "/DigitalMarketing",
      icon: <FaBullhorn />,
      color: "text-pink-500",
    },
    {
      title: "Graphic Designing",
      path: "/Graphic-design",
      icon: <FaPaintBrush />,
      color: "text-yellow-500",
    },
    {
      title: "Web Development",
      path: "/Web-Development",
      icon: <FaGlobe />,
      color: "text-indigo-600",
    },
    {
      title: "Domain & Web Hosting",
      path: "/Domain & Web Hosting",
      icon: <FaServer />,
      color: "text-red-500",
    },
    {
      title: "Custom Software Solutions",
      path: "/Custom-Software-Development",
      icon: <FaCogs />,
      color: "text-purple-600",
    },
    {
      title: "ERP Solutions",
      path: "/ERP-Solutions",
      icon: <FaProjectDiagram />,
      color: "text-cyan-600",
    },
    {
      title: "CMS Solutions",
      path: "/cms-Solution",
      icon: <FaWpforms />,
      color: "text-orange-500",
    },
  ];

  return (
    <>
      {/* Header */}
      <header className="bg-blue-500 text-white text-center py-14 px-6 shadow-xl">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6" data-aos="fade-down">
          Our Expertise, Your Growth
        </h1>
        <p className="text-xl max-w-3xl mx-auto" data-aos="fade-up">
          Discover our wide range of professional services — from web and mobile app development to cloud solutions, UI/UX design, and digital transformation strategies.
        </p>
      </header>

      {/* Services Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-12 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <Link
              key={index}
              to={service.path}
              className={`relative group overflow-hidden bg-white/70 backdrop-blur-xl rounded-3xl shadow-lg transform transition-transform duration-[1500ms] ease-in-out hover:scale-105 hover:-rotate-1 hover:shadow-2xl w-full h-[260px] p-6`}
              data-aos="fade-up"
              data-aos-delay={`${index * 100}`}
            >
              {/* Background Slide */}
              <div className="absolute inset-0 bg-blue-500 translate-y-full group-hover:translate-y-0 transition-transform duration-[2000ms] ease-in-out z-0" />

              {/* Content */}
              <div className="relative z-10">
                <div
                  className={`flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-gray-100 group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-500 transition duration-700 text-4xl ${service.color} group-hover:text-white`}
                >
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-white transition duration-700 mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-700 group-hover:text-white transition duration-700 text-sm">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellat officiis, eius quos.
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
};

export default Services;
