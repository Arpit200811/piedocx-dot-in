import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FaServer, FaDatabase, FaCloud, FaDocker, FaGitAlt, FaLaptopCode, FaCodeBranch } from 'react-icons/fa';
import { SiDotnet, SiBlazor, SiKubernetes, SiGraphql } from 'react-icons/si';

const DotNetCoreServices = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, []);

  const services = [
    {
      title: "ASP.NET Core Development",
      description: "Build high-performance, cross-platform web applications and APIs using ASP.NET Core framework.",
      icon: <SiDotnet />,
    },
    {
      title: "C# Programming",
      description: "Write robust, scalable, and maintainable code using the powerful C# language for all types of applications.",
      icon: <FaLaptopCode />,
    },
    {
      title: "Entity Framework Core",
      description: "Efficiently manage database operations and perform ORM-based data access with EF Core.",
      icon: <FaDatabase />,
    },
    {
      title: "Blazor Web Apps",
      description: "Create interactive client-side web apps with C# using Blazor for modern UI development.",
      icon: <SiBlazor />,
    },
    {
      title: "SignalR & Real-time Apps",
      description: "Develop real-time applications like chat, notifications, and live dashboards using SignalR.",
      icon: <FaCodeBranch />,
    },
    {
      title: "REST & GraphQL APIs",
      description: "Build robust RESTful and GraphQL APIs for seamless integration with front-end and mobile apps.",
      icon: <SiGraphql />,
    },
    {
      title: "Cloud & Azure Deployment",
      description: "Deploy scalable .NET applications on Azure Cloud with monitoring, security, and performance optimization.",
      icon: <FaCloud />,
    },
    {
      title: "Microservices Architecture",
      description: "Design distributed, loosely coupled services for scalable and maintainable applications.",
      icon: <FaServer />,
    },
    {
      title: "Docker & Kubernetes",
      description: "Containerize your applications and orchestrate deployments using Docker and Kubernetes.",
      icon: <SiKubernetes />,
    },
   
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-blue-700 mb-12" data-aos="fade-down">
           .NET Core Services
        </h1>
        <p className="text-center text-gray-600 mb-12" data-aos="fade-down" data-aos-delay="200">
          We leverage the latest .NET Core technologies to build scalable, high-performance, and modern web applications.
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

export default DotNetCoreServices;
