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
      description: "Build scalable and efficient web applications with modern technologies including React, Node.js, MongoDB, and more.",
    },
    {
      title: "Android & iOS App Development",
      path: "/Android-iOS",
      icon: <FaMobileAlt />,
      color: "text-green-600",
      description: "Create responsive, user-friendly mobile apps for Android and iOS platforms with seamless performance.",
    },
    {
      title: "Digital Marketing",
      path: "/DigitalMarketing",
      icon: <FaBullhorn />,
      color: "text-pink-500",
      description: "Boost your online presence with targeted campaigns, SEO, social media marketing, and conversion optimization.",
    },
    {
      title: "Graphic Designing",
      path: "/Graphic-design",
      icon: <FaPaintBrush />,
      color: "text-yellow-500",
      description: "Craft stunning visuals, branding, and UI/UX designs that resonate with your audience and elevate your brand.",
    },
    {
      title: "Web Development",
      path: "/Web-Development",
      icon: <FaGlobe />,
      color: "text-indigo-600",
      description: "Develop dynamic websites with responsive layouts, fast loading times, and modern design standards.",
    },
    {
      title: "Domain & Web Hosting",
      path: "/Domain & Web Hosting",
      icon: <FaServer />,
      color: "text-red-500",
      description: "Secure reliable domain registration and hosting solutions with high uptime and performance for your website.",
    },
    {
      title: "Custom Software Solutions",
      path: "/Custom-Software-Development",
      icon: <FaCogs />,
      color: "text-purple-600",
      description: "Design tailor-made software solutions to streamline your business processes and improve efficiency.",
    },
    {
      title: "ERP Solutions",
      path: "/ERP-Solutions",
      icon: <FaProjectDiagram />,
      color: "text-cyan-600",
      description: "Integrate enterprise resource planning systems to manage your business operations seamlessly.",
    },
    {
      title: "CMS Solutions",
      path: "/cms-Solution",
      icon: <FaWpforms />,
      color: "text-orange-500",
      description: "Implement content management systems like WordPress, Joomla, or custom CMS for easy website updates.",
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
                  {service.description}
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
