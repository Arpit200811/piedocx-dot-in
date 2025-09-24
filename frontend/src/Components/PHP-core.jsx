import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FaDatabase, FaCloud, FaDocker, FaGitAlt, FaLaptopCode, FaCodeBranch } from 'react-icons/fa';
import { SiPhp, SiLaravel, SiSymfony, SiGraphql } from 'react-icons/si';

const PhpCoreServices = () => {
  useEffect(() => {
    AOS.init({ duration: 1200, once: true });
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, []);

  const services = [
    {
      title: "PHP 8+ Development",
      description: "Build fast, secure, and scalable applications using the latest PHP 8+ features.",
      icon: <SiPhp />,
      animation: "flip-left"
    },
    {
      title: "Laravel Framework",
      description: "Develop modern web apps with Laravel, using MVC architecture, routing, and powerful ORM (Eloquent).",
      icon: <SiLaravel />,
      animation: "zoom-in"
    },
    {
      title: "Symfony Framework",
      description: "Use Symfony for enterprise-grade, modular, and maintainable PHP applications.",
      icon: <SiSymfony />,
      animation: "fade-up-right"
    },
    {
      title: "REST & GraphQL APIs",
      description: "Build robust APIs for seamless integration with web and mobile applications.",
      icon: <SiGraphql />,
      animation: "zoom-in-up"
    },
    {
      title: "MySQL / PostgreSQL",
      description: "Efficiently manage relational databases with MySQL or PostgreSQL for dynamic data handling.",
      icon: <FaDatabase />,
      animation: "flip-up"
    },
    {
      title: "Composer & Dependency Management",
      description: "Manage project dependencies and packages efficiently using Composer.",
      icon: <FaCodeBranch />,
      animation: "fade-left"
    },
    {
      title: "MVC Architecture",
      description: "Design maintainable and scalable applications following MVC patterns for clean code structure.",
      icon: <FaLaptopCode />,
      animation: "zoom-out"
    },
    {
      title: "Docker & Cloud Deployment",
      description: "Containerize PHP applications and deploy them on cloud platforms using Docker and CI/CD pipelines.",
      icon: <FaDocker />,
      animation: "fade-down"
    },
    {
      title: "Cloud Hosting & Optimization",
      description: "Deploy PHP apps to cloud hosting platforms like AWS, DigitalOcean, or Azure with optimized performance.",
      icon: <FaCloud />,
      animation: "zoom-in-left"
    },
  ];

  return (
    <div className="relative bg-gradient-to-r from-[#163F81]/10 via-[#163F81]/20 to-[#163F81]/30 min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-6">
        <h1
          className="text-4xl md:text-5xl font-extrabold text-center text-[#163F81] mb-12 tracking-wide"
          data-aos="fade-down"
        >
          PHP Core Services
        </h1>
        <p
          className="text-center text-gray-700 mb-14 max-w-2xl mx-auto"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          We leverage the latest PHP technologies to build modern, scalable, and secure web applications.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {services.map((service, index) => (
            <div
              key={index}
              className="relative group rounded-2xl p-8 shadow-lg bg-white/30 backdrop-blur-lg border border-white/40
                transition-transform transform hover:-translate-y-2 hover:shadow-2xl hover:border-[#163F81]"
              data-aos={service.animation}
              data-aos-delay={index * 120}
            >
              <div className="text-5xl text-[#163F81] mb-6 flex justify-center group-hover:scale-110 transition-transform duration-300">
                {service.icon}
              </div>
              <h2
                className="text-xl font-semibold text-center text-gray-800 mb-3 relative inline-block
                  after:content-[''] after:block after:h-[3px] after:w-0 after:bg-[#163F81] after:transition-all after:duration-300 group-hover:after:w-full mx-auto"
              >
                {service.title}
              </h2>
              <p className="text-gray-700 text-center leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PhpCoreServices;
