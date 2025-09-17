import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FaDatabase, FaCloud, FaDocker, FaGitAlt, FaLaptopCode, FaCodeBranch } from 'react-icons/fa';
import { SiPhp, SiLaravel, SiSymfony, SiGraphql } from 'react-icons/si';

const PhpCoreServices = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, []);

  const services = [
    {
      title: "PHP 8+ Development",
      description: "Build fast, secure, and scalable applications using the latest PHP 8+ features.",
      icon: <SiPhp />,
    },
    {
      title: "Laravel Framework",
      description: "Develop modern web apps with Laravel, using MVC architecture, routing, and powerful ORM (Eloquent).",
      icon: <SiLaravel />,
    },
    {
      title: "Symfony Framework",
      description: "Use Symfony for enterprise-grade, modular, and maintainable PHP applications.",
      icon: <SiSymfony />,
    },
    {
      title: "REST & GraphQL APIs",
      description: "Build robust APIs for seamless integration with web and mobile applications.",
      icon: <SiGraphql />,
    },
    {
      title: "MySQL / PostgreSQL",
      description: "Efficiently manage relational databases with MySQL or PostgreSQL for dynamic data handling.",
      icon: <FaDatabase />,
    },
    {
      title: "Composer & Dependency Management",
      description: "Manage project dependencies and packages efficiently using Composer.",
      icon: <FaCodeBranch />,
    },
    {
      title: "MVC Architecture",
      description: "Design maintainable and scalable applications following MVC patterns for clean code structure.",
      icon: <FaLaptopCode />,
    },
    {
      title: "Docker & Cloud Deployment",
      description: "Containerize PHP applications and deploy them on cloud platforms using Docker and CI/CD pipelines.",
      icon: <FaDocker />,
    },
    {
      title: "Cloud Hosting & Optimization",
      description: "Deploy PHP apps to cloud hosting platforms like AWS, DigitalOcean, or Azure with optimized performance.",
      icon: <FaCloud />,
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-blue-500 mb-12" data-aos="fade-down">
           PHP Core Services
        </h1>
        <p className="text-center text-gray-600 mb-12" data-aos="fade-down" data-aos-delay="200">
          We leverage the latest PHP technologies to build modern, scalable, and secure web applications.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <article
              key={index}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 text-center"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="text-5xl text-blue-500 mb-4 flex justify-center">
                {service.icon}
              </div>
              <h2 className="text-xl font-semibold mb-2">{service.title}</h2>
              <p className="text-gray-700">{service.description}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PhpCoreServices;
