import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  FaMobileAlt,
  FaDatabase,
  FaCloud,
  FaTools,
  FaLock,
  FaAndroid,
} from "react-icons/fa";
import {
  SiFlutter,
  SiFirebase,
  SiDart,
  SiGooglecloud,
  SiKotlin,
  SiGradle,
  SiJetbrains,
} from "react-icons/si";

const FlutterKotlinServices = () => {
  useEffect(() => {
    AOS.init({ duration: 1200, once: true });
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  const services = [
    {
      title: "Flutter Development",
      description:
        "Cross-platform mobile apps with high performance using Flutter SDK.",
      icon: <SiFlutter />,
      animation: "flip-left",
    },
    {
      title: "Dart Programming",
      description:
        "Efficient coding with Dart for smooth and reactive mobile apps.",
      icon: <SiDart />,
      animation: "fade-up-right",
    },
    {
      title: "Firebase Integration",
      description:
        "Real-time database, authentication, and cloud functions with Firebase.",
      icon: <SiFirebase />,
      animation: "zoom-in-up",
    },
    {
      title: "Kotlin Development",
      description:
        "Modern, concise, and powerful Android app development with Kotlin.",
      icon: <SiKotlin />,
      animation: "flip-up",
    },
    {
      title: "Android Native Apps",
      description:
        "High-performance Android apps using Kotlin & Jetpack libraries.",
      icon: <FaAndroid />,
      animation: "fade-down",
    },
    {
      title: "Kotlin Multiplatform",
      description:
        "Share code across Android, iOS, and backend with Kotlin Multiplatform.",
      icon: <SiJetbrains />,
      animation: "zoom-out",
    },
    {
      title: "Cloud Deployment",
      description: "Deploy and scale apps using Firebase, AWS, and Google Cloud.",
      icon: <SiGooglecloud />,
      animation: "zoom-in-left",
    },
    {
      title: "Database Integration",
      description: "SQLite, Room, Firestore, and MySQL integration for apps.",
      icon: <FaDatabase />,
      animation: "fade-left",
    },
    {
      title: "Performance & Tools",
      description:
        "Optimize apps with DevTools, Gradle, Jetpack Compose, and debugging tools.",
      icon: <FaTools />,
      animation: "flip-right",
    },
  ];

  return (
    <div className="relative min-h-screen py-20 bg-gradient-to-r from-[#163F81]/10 via-[#163F81]/20 to-[#163F81]/30">
      <div className="max-w-7xl mx-auto px-6">
        {/* Title Section */}
        <h1
          className="text-4xl md:text-5xl font-extrabold text-center text-[#163F81] mb-6 tracking-wide"
          data-aos="fade-down"
        >
          Flutter & Kotlin Services
        </h1>
        <p
          className="text-center text-gray-700 max-w-2xl mx-auto mb-14"
          data-aos="fade-up"
        >
          We build modern cross-platform apps using Flutter & Kotlin, 
          combining the power of Dart, Jetpack, Firebase, and Cloud solutions.
        </p>

        {/* Services Grid */}
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

export default FlutterKotlinServices;
