import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  FaJava,
  FaDatabase,
  FaServer,
  FaCloud,
  FaTools,
  FaLock,
} from "react-icons/fa";
import { SiSpring, SiHibernate, SiJenkins } from "react-icons/si";

const AdvanceJavaServices = () => {
  useEffect(() => {
    AOS.init({ duration: 1200, once: true });
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  const services = [
    {
      title: "Spring Framework",
      description:
        "Build enterprise-grade applications with Spring Boot, Spring Security, and Spring Cloud.",
      icon: <SiSpring />,
      animation: "flip-left",
    },
    {
      title: "Hibernate & JPA",
      description:
        "Efficient ORM solutions with Hibernate & JPA for database interaction and data management.",
      icon: <SiHibernate />,
      animation: "fade-up-right",
    },
    {
      title: "Microservices Architecture",
      description:
        "Develop scalable microservices with Java, Spring Boot, and RESTful APIs.",
      icon: <FaServer />,
      animation: "zoom-in-up",
    },
    {
      title: "Secure Authentication",
      description:
        "Implement JWT, OAuth2, and Spring Security for safe and secure Java applications.",
      icon: <FaLock />,
      animation: "flip-up",
    },
    {
      title: "CI/CD with Jenkins",
      description:
        "Automate your deployments using Jenkins pipelines for Java enterprise projects.",
      icon: <SiJenkins />,
      animation: "fade-down",
    },
    {
      title: "Database Connectivity",
      description:
        "Seamless JDBC, MySQL, PostgreSQL, and Oracle DB integration with Java.",
      icon: <FaDatabase />,
      animation: "zoom-out",
    },
    {
      title: "Cloud Native Java",
      description:
        "Deploy Java apps on AWS, Azure, and Google Cloud with modern DevOps practices.",
      icon: <FaCloud />,
      animation: "zoom-in-left",
    },
    {
      title: "Performance & Tools",
      description:
        "Use Maven, Gradle, and advanced profiling tools to optimize Java applications.",
      icon: <FaTools />,
      animation: "fade-left",
    },
    {
      title: "Core Java Mastery",
      description:
        "Advanced OOP, multithreading, concurrency, and Java 17+ features for enterprise apps.",
      icon: <FaJava />,
      animation: "flip-right",
    },
  ];

  return (
    <div className="relative bg-gradient-to-r from-orange-50 via-yellow-100 to-orange-200 min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Title Section */}
        <h1
          className="text-4xl md:text-5xl font-extrabold text-center text-orange-700 mb-6 tracking-wide"
          data-aos="fade-down"
        >
          Advance Java Services
        </h1>
        <p
          className="text-center text-gray-700 max-w-2xl mx-auto mb-14"
          data-aos="fade-up"
        >
          We deliver enterprise-level Java solutions using Spring, Hibernate, 
          and cloud-native technologies for scalable and secure applications.
        </p>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {services.map((service, index) => (
            <div
              key={index}
              className="relative group rounded-2xl p-8 shadow-lg bg-white/30 backdrop-blur-lg border border-white/40 
              transition-transform transform hover:-translate-y-2 hover:shadow-2xl hover:border-orange-400"
              data-aos={service.animation}
              data-aos-delay={index * 120}
            >
              {/* Icon */}
              <div className="text-5xl text-orange-600 mb-6 flex justify-center group-hover:scale-110 transition-transform duration-300">
                {service.icon}
              </div>

              {/* Title */}
              <h2 className="text-xl font-semibold text-center text-gray-800 mb-3 relative inline-block after:content-[''] after:block after:h-[3px] after:w-0 after:bg-orange-500 after:transition-all after:duration-300 group-hover:after:w-full mx-auto">
                {service.title}
              </h2>

              {/* Description */}
              <p className="text-gray-700 text-center leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdvanceJavaServices;
