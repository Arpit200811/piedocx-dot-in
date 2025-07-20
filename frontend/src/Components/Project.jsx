import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { base_url } from "../utils/info";

const Project = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");

  const submitResponse = async (e) => {
    e.preventDefault();

    const obj = { name, email, address, message };
    const url = `${base_url}/user`;

    try {
      const res = await axios.post(url, obj);
      Swal.fire(
        res.data.message,
        "Now you are our trusted customer",
        "success"
      );

      setName("");
      setEmail("");
      setAddress("");
      setMessage("");
    } catch (error) {
      Swal.fire("Internal server error!", error.message, "error");
    }
  };
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  const features = [
    {
      icon: (
        <svg
          className="h-7 w-7 text-gradient-from-sky-500-to-indigo-600"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Abstract AI brain with nodes */}
          <circle cx="12" cy="12" r="8" />
          <line x1="12" y1="4" x2="12" y2="20" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <circle cx="16" cy="8" r="1.5" />
          <circle cx="8" cy="8" r="1.5" />
          <circle cx="8" cy="16" r="1.5" />
          <circle cx="16" cy="16" r="1.5" />
        </svg>
      ),
      title: "AI-Powered Intelligence",
      description:
        "Unleash the power of adaptive AI to transform your workflow with smart automation and insights.",
    },
    {
      icon: (
        <svg
          className="h-7 w-7 text-gradient-from-purple-500-to-pink-600"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Puzzle pieces symbolizing integration */}
          <path d="M3 10h4v4H3z" />
          <path d="M7 6h4v4H7z" />
          <path d="M13 10h4v4h-4z" />
          <path d="M17 14h4v4h-4z" />
        </svg>
      ),
      title: "Seamless Ecosystem",
      description:
        "Connect effortlessly across platforms with fluid, plug-and-play integration to keep your tools in sync.",
    },
    {
      icon: (
        <svg
          className="h-7 w-7 text-gradient-from-green-400-to-teal-500"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Lightning bolt for speed */}
          <path d="M13 2L3 14h9l-1 8 10-12h-9z" />
        </svg>
      ),
      title: "Blazing Fast Performance",
      description:
        "Experience lightning-speed operations optimized for efficiency and reliability at scale.",
    },
    {
      icon: (
        <svg
          className="h-7 w-7 text-gradient-from-yellow-400-to-orange-500"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Shield for security */}
          <path d="M12 2L4 7v5c0 5 4 9 8 10 4-1 8-5 8-10V7l-8-5z" />
        </svg>
      ),
      title: "Rock-Solid Security",
      description:
        "Protect your data and operations with state-of-the-art encryption and robust security protocols.",
    },
    {
      icon: (
        <svg
          className="h-7 w-7 text-gradient-from-indigo-500-to-blue-600"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Globe for global reach */}
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15 15 0 0 1 0 20" />
          <path d="M12 2a15 15 0 0 0 0 20" />
        </svg>
      ),
      title: "Global Scalability",
      description:
        "Grow your impact worldwide with infrastructure designed for scale and resilience.",
    },
  ];

  const projects = [
    {
      id: 1,
      title: "Modern Web App",
      category: "Web Design",
      imgSrc:
        "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=80",
      link: "#",
    },
    {
      id: 2,
      title: "Mobile App UI",
      category: "App Development",
      imgSrc:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
      link: "#",
    },
    {
      id: 3,
      title: "Brand Identity",
      category: "Branding",
      imgSrc:
        "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80",
      link: "#",
    },
    // Add more projects as needed
  ];

  return (
    <>
      <section>
        <section className="py-10 px-4">
          <div className="container mx-auto max-w-7xl space-y-20">
            {/* ✅ Features Section */}

            <section className="bg-white text-black  px-4 sm:px-8 lg:px-16">
              {/* Heading */}

              <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen bg-blue-500 text-white py-6 px-6 sm:px-8 overflow-hidden">
                <div className="text-center max-w-6xl mx-auto">
                  <h2
                    className="relative inline-block text-3xl sm:text-5xl font-extrabold tracking-tight group"
                    data-aos="fade-up"
                  >
                    Our Latest Innovations
                    <span className="absolute bottom-0 left-1/2 h-1 w-0 bg-white rounded-full transition-all duration-500 group-hover:w-full group-hover:-translate-x-1/2 origin-left"></span>
                  </h2>

                  <p
                    className="max-w-3xl mx-auto mt-6 text-lg sm:text-xl text-white/90"
                    data-aos="fade-up"
                    data-aos-delay="100"
                  >
                    Discover cutting-edge solutions and enhancements designed to
                    elevate your software development experience.
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="grid lg:grid-cols-2 gap-12 items-center mt-16">
                {/* Features */}
                <div className="space-y-10">
                  {features.map((feature, index) => (
                    <div
                      className="flex items-start gap-4"
                      key={index}
                      data-aos="fade-right"
                      data-aos-delay={index * 100}
                    >
                      <div className="w-14 h-14 bg-blue-500 text-white flex items-center justify-center rounded-lg shadow-md text-xl">
                        {feature.icon}
                      </div>
                      <div>
                        <h4 className="text-xl font-semibold text-black">
                          {feature.title}
                        </h4>
                        <p className="mt-2 text-gray-700">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Image */}
                <div data-aos="fade-left">
                  <img
                    src="https://images.unsplash.com/photo-1516542076529-1ea3854896f2?auto=format&fit=crop&w=1080&q=80"
                    alt="Software Development"
                    className="w-full max-w-md mx-auto rounded-2xl shadow-2xl"
                  />
                </div>
              </div>
            </section>

            {/* ✅ Projects Section */}
            <section>
              <div className="text-center mb-5">
                <div className="text-center">
                  <h2 className="relative inline-block text-3xl p-2 font-bold sm:text-5xl group">
                    Portfolio Showcase
                    <span className="absolute bottom-0 left-1/2 h-1 w-0 bg-blue-500 rounded-full transition-all duration-300 group-hover:w-full group-hover:-translate-x-1/2  origin-left"></span>
                  </h2>
                </div>
                <p className="text-lg text-indigo-500 m-2 font-semibold">
                  Discover our latest projects and success stories
                </p>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-center mb-8">
                {["All", "Web Design", "App Development", "Branding"].map(
                  (category) => (
                    <button
                      key={category}
                      className="filter-button bg-indigo-500 hover:bg-pink-500 px-4 py-2 mr-2 mb-2 text-white rounded"
                    >
                      {category}
                    </button>
                  )
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="group portfolio-item relative hover:shadow-lg shadow-md rounded-lg overflow-hidden"
                  >
                    <a href={project.link}>
                      <img
                        className="w-full h-60 object-cover"
                        src={project.imgSrc}
                        alt={project.title}
                      />
                      <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-r from-indigo-500 to-pink-500 opacity-0 transition duration-300 ease-in-out group-hover:opacity-70"></div>
                      <div className="p-4 flex flex-col items-center justify-between relative z-10">
                        <h3 className="text-lg font-medium text-txt group-hover:text-gray-dark">
                          {project.title}
                        </h3>
                        <span className="text-sm font-bold text-pink-500 group-hover:text-indigo-500">
                          {project.category}
                        </span>
                      </div>
                    </a>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </section>

        <section className="mb-32">
          {/* Google Maps Embed */}

          {/* Form Section */}
          <div className="relative bg-gradient-to-br from-white via-blue-50 to-sky-100 py-12 px-4 md:px-10">
            <div
              className="max-w-7xl mx-auto bg-white/70 backdrop-blur-sm border border-gray-200 shadow-lg rounded-2xl p-6 md:p-10"
              data-aos="fade-up"
            >
              <div className="flex flex-wrap gap-y-10 lg:gap-y-0 items-start">
                {/* LEFT: Form Section */}
                <div className="w-full lg:w-5/12 px-3">
                  <h2 className="text-2xl md:text-3xl font-extrabold text-sky-600 mb-5">
                    Get in Touch
                  </h2>
                  <form onSubmit={submitResponse} className="space-y-4">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your Name"
                      className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-400 outline-none text-sm"
                      required
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-400 outline-none text-sm"
                      required
                    />
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Address"
                      className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-400 outline-none text-sm"
                      required
                    />
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows="3"
                      placeholder="Your Message"
                      className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-400 outline-none resize-none text-sm"
                      required
                    />
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white py-2.5 rounded-xl font-medium text-sm shadow-md hover:shadow-lg transition duration-300"
                    >
                      🚀 Send Message
                    </button>
                  </form>
                </div>

                {/* RIGHT: Contact Info + Floating Image */}
                <div className="w-full lg:w-7/12 px-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Technical Support */}
                  <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-4 flex items-start gap-3 hover:scale-[1.01] transition">
                    <div className="bg-sky-100 p-2 rounded-full shadow-inner">
                      <svg
                        className="w-5 h-5 text-sky-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14.25 9.75v-4.5..."
                        />
                      </svg>
                    </div>
                    <div className="text-sm text-gray-700">
                      <p className="font-semibold text-sky-700">
                        Technical Support
                      </p>
                      <a
                        href="mailto:info@piedocx.com"
                        className="block hover:text-sky-500"
                      >
                        info@piedocx.com
                      </a>
                      <a
                        href="tel:+916307503700"
                        className="block mt-1 hover:text-sky-500"
                      >
                        +91 6307503700
                      </a>
                      <a
                        href="tel:+918114247881"
                        className="block mt-1 hover:text-sky-500"
                      >
                        +91 8114247881
                      </a>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-4 flex items-start gap-3 hover:scale-[1.01] transition">
                    <div className="bg-sky-100 p-2 rounded-full shadow-inner">
                      <svg
                        className="w-5 h-5 text-sky-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 9h3.75M15 12..."
                        />
                      </svg>
                    </div>
                    <div className="text-sm text-gray-700">
                      <p className="font-semibold text-sky-700">Our Address</p>
                      <a
                        href="https://www.google.com/maps?q=piedocx+technologies+pvt+ltd..."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-sky-500 block"
                      >
                        Chandralok Colony, Near Purania,
                        <br />
                        Aliganj, Lucknow, UP – 226024
                      </a>
                    </div>
                  </div>

                  {/* Floating Image */}
                </div>
              </div>
            </div>

            {/* Floating Animation CSS */}
          </div>
        </section>
      </section>
    </>
  );
};

export default Project;
