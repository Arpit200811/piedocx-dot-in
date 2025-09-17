import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  FaPython,
  FaDatabase,
  FaCloud,
  FaDocker,
  FaGitAlt,
  FaLaptopCode,
  FaRobot,
} from "react-icons/fa";
import {
  SiDjango,
  SiFlask,
  SiTensorflow,
  SiFastapi,
  SiPandas,
} from "react-icons/si";

const PythonServices = () => {
  useEffect(() => {
    AOS.init({ duration: 1200, once: true });
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  const services = [
    {
      title: "Python Core Development",
      description:
        "Develop powerful applications using Python’s simplicity, scalability, and vast ecosystem of libraries.",
      icon: <FaPython />,
      animation: "flip-left",
    },
    {
      title: "Django Framework",
      description:
        "Build secure, scalable, and high-performance web apps using Django framework.",
      icon: <SiDjango />,
      animation: "zoom-in",
    },
    {
      title: "Flask & FastAPI",
      description:
        "Develop lightweight and high-performance APIs with Flask and FastAPI.",
      icon: <SiFlask />,
      animation: "fade-up-right",
    },
    {
      title: "Data Science & Pandas",
      description:
        "Perform data cleaning, analysis, and visualization using Pandas and NumPy libraries.",
      icon: <SiPandas />,
      animation: "zoom-in-up",
    },
    {
      title: "Machine Learning & AI",
      description:
        "Leverage AI & ML with TensorFlow, Scikit-learn, and deep learning frameworks.",
      icon: <SiTensorflow />,
      animation: "flip-up",
    },
    {
      title: "Automation & Scripting",
      description:
        "Automate repetitive tasks, write system scripts, and improve workflows using Python.",
      icon: <FaLaptopCode />,
      animation: "fade-left",
    },
    {
      title: "Database Integration",
      description:
        "Seamlessly integrate with MySQL, PostgreSQL, MongoDB, and SQLite databases.",
      icon: <FaDatabase />,
      animation: "zoom-out",
    },
    {
      title: "Cloud & Docker Deployment",
      description:
        "Deploy Python apps using Docker containers and scale them on cloud platforms like AWS, Azure, and GCP.",
      icon: <FaDocker />,
      animation: "fade-down",
    },
   
    {
      title: "AI-Powered Bots",
      description:
        "Develop intelligent chatbots and automation tools using Python and NLP libraries.",
      icon: <FaRobot />,
      animation: "zoom-in-left",
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-6">
        <h1
          className="text-4xl md:text-5xl font-bold text-center text-blue-600 mb-12"
          data-aos="fade-down"
        >
           Python Services
        </h1>
        <p
          className="text-center text-gray-600 mb-12"
          data-aos="fade-down"
          data-aos-delay="200"
        >
          We use the latest Python technologies to deliver AI, web, and data-driven solutions for modern businesses.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <article
              key={index}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transform hover:scale-105 transition duration-300 text-center"
              data-aos={service.animation}
              data-aos-delay={index * 120}
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

export default PythonServices;
