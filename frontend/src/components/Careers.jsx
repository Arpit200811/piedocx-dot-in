import React, { useEffect } from "react";
import AOS from "aos";
import { Link } from "react-router-dom";
import { FaBriefcase, FaGraduationCap, FaCode, FaRocket } from "react-icons/fa";

const Careers = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    window.scrollTo(0, 0);
  }, []);

  const openings = [
    {
      title: "Full Stack Developer",
      type: "Full Time / Internship",
      location: "Lucknow (On-site)",
      description: "Working with MERN Stack (MongoDB, Express, React, Node.js).",
      icon: <FaCode className="text-blue-500" size={24} />,
    },
    {
      title: "UI/UX Designer",
      type: "Full Time",
      location: "Lucknow (On-site)",
      description: "Focus on creating modern, clean, and interactive user interfaces.",
      icon: <FaRocket className="text-purple-500" size={24} />,
    },
    {
      title: "Technical Trainer",
      type: "Full Time",
      location: "Lucknow (On-site)",
      description: "Mentoring students in Python, Java, and Web Technologies.",
      icon: <FaGraduationCap className="text-green-500" size={24} />,
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      {/* Hero Section */}
      <section className="bg-blue-600 pt-14 md:pt-16 lg:pt-20 pb-20 px-6 text-center text-white">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4" data-aos="fade-down">
          Join the Piedocx Team
        </h1>
        <p className="text-xl max-w-2xl mx-auto opacity-90" data-aos="fade-up">
          Be a part of a fast-growing tech company where innovation meets excellence. We are always looking for passionate individuals to join us.
        </p>
      </section>

      {/* Why Join Us */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900" data-aos="fade-up">Why Work With Us?</h2>
          <div className="w-16 h-1 bg-blue-500 mx-auto mt-2"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Innovative Culture", desc: "Work on cutting-edge technologies and real-world projects." },
            { title: "Growth Opportunities", desc: "Clear career paths and continuous learning environment." },
            { title: "Dynamic Environment", desc: "Collaborate with experts and young bright minds." }
          ].map((item, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition text-center border border-gray-100" data-aos="zoom-in" data-aos-delay={i * 100}>
              <h3 className="text-xl font-bold mb-3 text-blue-600">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Current Openings */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900" data-aos="fade-up">Current Openings</h2>
            <p className="text-gray-500 mt-2">Find your next big opportunity</p>
          </div>

          <div className="space-y-6">
            {openings.map((job, i) => (
              <div key={i} className="group p-6 rounded-2xl border-2 border-gray-100 hover:border-blue-500 transition-all duration-300 flex flex-col md:flex-row items-center justify-between gap-6" data-aos="fade-up" data-aos-delay={i * 100}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-blue-50 transition">
                    {job.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition">{job.title}</h3>
                    <div className="flex flex-wrap gap-3 mt-1">
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">{job.type}</span>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">{job.location}</span>
                    </div>
                  </div>
                </div>
                <Link to="/contact" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
                  Apply Now
                </Link>
              </div>
            ))}
          </div>
          
          <div className="mt-16 bg-blue-50 p-8 rounded-3xl text-center" data-aos="zoom-in">
            <h3 className="text-2xl font-bold text-blue-900 mb-4">Don't see a role for you?</h3>
            <p className="text-blue-800 mb-6">Send us your resume at <strong>info@piedocx.com</strong> and we'll keep you in mind for future openings.</p>
            <Link to="/contact" className="inline-block border-2 border-blue-600 text-blue-600 px-8 py-2 rounded-lg font-bold hover:bg-blue-600 hover:text-white transition">
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Careers;
