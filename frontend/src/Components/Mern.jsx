import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FaReact, FaNodeJs, FaDatabase, FaServer, FaCss3Alt, FaDocker, FaGitAlt, FaLaptopCode } from 'react-icons/fa';
import { SiNextdotjs, SiGraphql, SiRedux, SiTypescript } from 'react-icons/si';

const MernStackServices = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, []);

  const services = [
    {
      title: "React.js Development",
      description: "Build dynamic, high-performance front-end interfaces using React.js, the most popular JS library for modern web apps.",
      icon: <FaReact />,
    },
    {
      title: "Next.js & SSR",
      description: "Create SEO-friendly, server-side rendered applications with Next.js for better performance and fast loading.",
      icon: <SiNextdotjs />,
    },
    {
      title: "Node.js Backend",
      description: "Develop scalable backend services and APIs using Node.js and Express.js for robust server-side solutions.",
      icon: <FaNodeJs />,
    },
    {
      title: "MongoDB & Data Management",
      description: "Manage your data efficiently with MongoDB, enabling fast queries and flexible NoSQL database solutions.",
      icon: <FaDatabase />,
    },
    {
      title: "TypeScript & GraphQL",
      description: "Add type safety and advanced API queries to your applications using TypeScript and GraphQL.",
      icon: <SiTypescript />,
    },
    {
      title: "State Management with Redux",
      description: "Maintain predictable application state with Redux and integrate it seamlessly into your React apps.",
      icon: <SiRedux />,
    },
    {
      title: "Tailwind CSS & Modern UI",
      description: "Build responsive, clean, and highly customizable user interfaces with Tailwind CSS.",
      icon: <FaCss3Alt />,
    },
    {
      title: "Docker & CI/CD",
      description: "Deploy applications using Docker containers and implement CI/CD pipelines for faster development cycles.",
      icon: <FaDocker />,
    },
    {
      title: "Version Control & Collaboration",
      description: "Use Git for source control and collaborate efficiently with your team on modern web projects.",
      icon: <FaGitAlt />,
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-blue-700 mb-12" data-aos="fade-down">
          MERN Stack Services
        </h1>
        <p className="text-center text-gray-600 mb-12" data-aos="fade-down" data-aos-delay="200">
          We leverage the latest technologies in MERN Stack development to build fast, scalable, and modern web applications.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <article
              key={index}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 text-center"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="text-5xl text-blue-600 mb-4 flex justify-center">
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

export default MernStackServices;
