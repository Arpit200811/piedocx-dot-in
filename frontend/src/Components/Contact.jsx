// import { useState, useEffect } from "react";
// import "aos/dist/aos.css";
// import { Link } from "react-router-dom";


// const faqs = [
//   {
//     question: "What services does your software development company offer?",
//     answer:
//       "We offer a full range of software development services including web and mobile app development, UI/UX design, custom software solutions, enterprise application development, cloud integration, API development, software maintenance, and quality assurance testing. We also provide consulting services to help you choose the best tech stack and development approach for your project.",
//   },
//   {
//     question: "What technologies and platforms do you specialize in?",
//     answer:
//       "Our team has expertise in a wide variety of technologies including JavaScript (React, Node.js, Vue.js), Python (Django, Flask), PHP (Laravel), Java, .NET, as well as mobile technologies like Flutter, React Native, and Kotlin/Swift. We also work with cloud platforms such as AWS, Azure, and Google Cloud, and offer DevOps services for CI/CD automation.",
//   },
//   {
//     question: "How do you handle project management and communication?",
//     answer:
//       "We follow agile methodologies (Scrum/Kanban) for project management and use tools like Jira, Trello, or ClickUp to track progress. Regular meetings (daily stand-ups, weekly reviews) ensure transparency. Communication is handled via Slack, email, and video calls. A dedicated project manager ensures your requirements are met throughout the development cycle.",
//   },
//   {
//     question: "What is your typical software development process?",
//     answer:
//       "Our process includes: 1) Requirement gathering and analysis, 2) Wireframing and UI/UX design, 3) Architecture and tech stack planning, 4) Development in sprints, 5) QA testing and bug fixing, 6) Deployment, and 7) Post-launch support and maintenance. We involve clients at every major milestone to ensure alignment with their vision.",
//   },
//   {
//     question: "How long does it take to complete a software project?",
//     answer:
//       "The duration depends on the scope and complexity of the project. A basic MVP may take 4–8 weeks, whereas a full-scale enterprise application could take 3–6 months or longer. After understanding your requirements, we provide a detailed project timeline and delivery milestones.",
//   },
//   {
//     question: "What are your pricing models?",
//     answer:
//       "We offer flexible pricing models including fixed-price (for clearly defined projects), time and material (for dynamic or evolving scopes), and dedicated team engagement (for long-term collaboration). Our goal is to provide cost-effective solutions tailored to your needs and budget.",
//   },
//   {
//     question: "Do you offer post-launch support and maintenance?",
//     answer:
//       "Yes, we provide comprehensive post-launch support which includes performance monitoring, bug fixes, updates, feature enhancements, and technical support. We offer monthly maintenance packages as well as ad-hoc support based on your business needs.",
//   },
//   {
//     question: "Can you help with software modernization or migration?",
//     answer:
//       "Absolutely. We help modernize legacy systems by migrating them to modern technologies, refactoring outdated codebases, improving performance and scalability, and ensuring security compliance. Whether you're moving to the cloud or upgrading your tech stack, we've got you covered.",
//   },
//   {
//     question: "How do you ensure the security of the software you build?",
//     answer:
//       "Security is a top priority. We follow secure coding practices, conduct regular vulnerability assessments, and implement features like encryption, authentication (OAuth2, JWT), and secure APIs. We also comply with industry standards such as GDPR and HIPAA when applicable.",
//   },
//   {
//     question: "Can you work with clients from different time zones?",
//     answer:
//       "Yes, we have experience working with clients globally across various time zones. We ensure overlap during business hours for meetings and use collaborative tools to maintain clear and consistent communication regardless of location.",
//   },
// ];

// const Contact = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     message: "",
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [notification, setNotification] = useState("");
//   const [activeFAQ, setActiveFAQ] = useState(null);

//   const handleChange = (e) => {
//     const { id, value } = e.target;
//     setFormData((prev) => ({ ...prev, [id]: value }));
//   };
// useEffect(() => {
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   }, []);
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     // Simulate API call
//     setTimeout(() => {
//       setIsSubmitting(false);
//       setNotification("Message sent successfully! 🎉");
//       setFormData({ name: "", email: "", message: "" });

//       setTimeout(() => setNotification(""), 3000);
//     }, 1500);
//   };

//   const toggleFAQ = (index) => {
//     setActiveFAQ(activeFAQ === index ? null : index);
//   };

//   return (
//     <div className="bg-white min-h-screen font-sans">
//       {/* Header */}

//       <header className="relative mt-15 flex flex-col items-center justify-center min-h-[120px] px-6 sm:px-12 bg-blue-500 text-white rounded-b-[2rem] shadow-lg overflow-hidden">
//   <h1 className="relative text-5xl font-extrabold tracking-widest drop-shadow-md">
//     Contact Us
//     <span className="absolute bottom-0 left-0 w-0 h-1 bg-black transition-all duration-500 group-hover:w-full"></span>
//   </h1>
//   <p className="mt-4 text-lg italic text-white relative group cursor-pointer select-none">
//     We’d love to hear from you!
//     <span className="block w-12 h-1 bg-white rounded-full mt-1 mx-auto transition-all duration-300 group-hover:w-20"></span>
//   </p>
//   <div className="absolute top-4 left-4 w-3 h-3 bg-black rounded-full opacity-60 animate-pulse"></div>
//   <div className="absolute bottom-6 right-6 w-4 h-4 bg-white rounded-full opacity-40 animate-bounce"></div>
// </header>

//       {/* Contact Info */}

//      <section
//   className="relative text-center py-16 px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto overflow-hidden"
//   data-aos="fade-up"
// >
//   {/* Decorative background blobs */}
//   <div className="absolute -top-10 -left-10 w-60 h-60 bg-blue-300 opacity-20 rounded-full filter blur-3xl z-0"></div>
//   <div className="absolute bottom-0 -right-10 w-72 h-72 bg-purple-300 opacity-20 rounded-full filter blur-3xl z-0"></div>

//   {/* Title Section */}
//   <div className="relative z-10 mb-12">
//     <h2 className="text-3xl sm:text-4xl font-extrabold text-black tracking-wide inline-block relative">
//       Get In Touch
//       <span className="block w-20 h-1 bg-blue-500 mt-3 mx-auto rounded-full animate-pulse"></span>
//     </h2>
//     <p className="text-gray-700 max-w-2xl mx-auto mt-4 text-base sm:text-lg leading-relaxed">
//       Have questions or ideas? Let's make something amazing together.
//     </p>
//   </div>

//   {/* Contact Cards */}
//   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 relative z-10">
//     {[
//       {
//         title: "Call Us",
//         lines: [
//           <Link key="1" to="tel:+916307503700" className="text-blue-600 hover:underline">+91 6307503700</Link>,
//           <Link key="2" to="tel:+918114247881" className="text-blue-600 hover:underline">+91 8114247881</Link>,
//         ],
//         icon: "📞",
//       },
//       {
//         title: "Email Us",
//         lines: [
//           <Link key="1" to="mailto:info@piedocx.com" className="text-blue-600 hover:underline">info@piedocx.com</Link>,
//         ],
//         icon: "📧",
//       },
//       {
//         title: "Visit Us",
//         lines: [
//           "Plot No.5 Chandralok Colony, New, near Purania Chauraha, Sector E, Aliganj, Lucknow, UP 226024",
//         ],
//         icon: "📍",
//       },
//     ].map(({ title, lines, icon }, idx) => (
//       <div
//         key={idx}
//         className="backdrop-blur-lg bg-white/80 border border-black/10 shadow-xl rounded-3xl p-8 transform hover:scale-105 transition-all duration-300 group"
//         data-aos="zoom-in"
//         data-aos-delay={idx * 100}
//       >
//         <div className="text-4xl mb-4 text-blue-500 animate-wiggle-slow">{icon}</div>
//         <h3 className="text-xl font-semibold text-black group-hover:text-blue-600 transition-colors">
//           {title}
//         </h3>
//         <div className="mt-3 space-y-1 text-sm sm:text-base text-gray-800">
//           {lines.map((line, i) => (
//             <p key={i}>{line}</p>
//           ))}
//         </div>
//       </div>
//     ))}
//   </div>

//   <style>{`
//     @keyframes wiggle-slow {
//       0%, 100% { transform: rotate(-2deg); }
//       50% { transform: rotate(2deg); }
//     }
//     .animate-wiggle-slow {
//       animation: wiggle-slow 3s ease-in-out infinite;
//     }
//   `}</style>
// </section>

//       {/* Location Section */}
//       <section className="relative mt-10 sm:mt-16 max-w-7xl mx-auto px-6 sm:px-8">
//   <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-10 tracking-wide">
//     🌍 Our Location
//   </h2>

//   <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-10">
    
//     {/* Vector image with animation */}
//     <div className="flex-1 max-w-xs sm:max-w-sm md:max-w-md relative">
//       <img
//         src="contact1.jpg"
//         alt="Decorative Vector"
//         className="w-full rounded-2xl shadow-lg animate-float-smooth"
//       />
//     </div>

//     {/* Map with glassmorphism */}
//     <div className="flex-1 w-full rounded-3xl shadow-2xl border border-white/20 backdrop-blur-sm bg-white/30 overflow-hidden transition-transform duration-300 hover:scale-105">
//       <iframe
//         src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1779.223549687897!2d80.9473454387043!3d26.889302194165253!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3999575c2996f68b%3A0xb2d359cc67ce5fe5!2sPiedocx%20Technologies%20Pvt.%20Ltd.!5e0!3m2!1sen!2sin!4v1747816835191!5m2!1sen!2sin"
//         width="100%"
//         height="450"
//         style={{ border: 0 }}
//         allowFullScreen=""
//         loading="lazy"
//         referrerPolicy="no-referrer-when-downgrade"
//         title="Company Location"
//       ></iframe>
//     </div>
//   </div>

//   {/* Optional animated background bubbles or shapes */}
//   <div className="absolute -z-10 top-0 left-0 w-full h-full overflow-hidden">
//     <div className="absolute top-10 left-10 w-40 h-40 bg-gradient-to-tr from-purple-300 to-pink-300 opacity-30 rounded-full filter blur-3xl animate-pulse-slow" />
//     <div className="absolute bottom-0 right-10 w-64 h-64 bg-gradient-to-tr from-blue-200 to-teal-200 opacity-20 rounded-full filter blur-2xl animate-pulse-slow" />
//   </div>

//   {/* Custom animations */}
//   <style>{`
//     @keyframes float-smooth {
//       0%, 100% {
//         transform: translateY(0);
//       }
//       50% {
//         transform: translateY(-15px);
//       }
//     }
//     .animate-float-smooth {
//       animation: float-smooth 5s ease-in-out infinite;
//     }

//     @keyframes pulse-slow {
//       0%, 100% {
//         opacity: 0.2;
//         transform: scale(1);
//       }
//       50% {
//         opacity: 0.4;
//         transform: scale(1.1);
//       }
//     }
//     .animate-pulse-slow {
//       animation: pulse-slow 8s ease-in-out infinite;
//     }
//   `}</style>
// </section>


//       {/* Contact Form */}
//       <section className="relative bg-gradient-to-br from-white via-blue-50 to-blue-100 py-10 sm:py-16 px-4 sm:px-8 max-w-6xl mx-auto rounded-3xl shadow-2xl mt-10 sm:mt-16 border border-blue-200 overflow-hidden">
//   {/* Float Animation Style */}
//   <style>
//     {`
//       @keyframes float {
//         0%, 100% { transform: translateY(0); }
//         50% { transform: translateY(-12px); }
//       }
//       .animate-float {
//         animation: float 3s ease-in-out infinite;
//       }
//     `}
//   </style>

//   <div className="flex flex-col sm:flex-row items-center gap-10 relative z-10">
//     {/* Animated Lottie */}
//     <div className="w-full sm:w-1/2 flex justify-center relative animate-float">
//       {/* Glow effect */}
//       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-100 rounded-full blur-2xl opacity-40 z-0"></div>

//       {/* Lottie animation */}
//       <lottie-player
//         src="https://assets5.lottiefiles.com/packages/lf20_h9kdsx3e.json"
//         background="transparent"
//         speed="1"
//         style={{ width: "100%", maxWidth: "350px", height: "auto" }}
//         loop
//         autoplay
//       ></lottie-player>
//     </div>

//     {/* Contact Form */}
//     <div className="w-full sm:w-1/2 relative">
//       <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-700 text-center sm:text-left mb-8 tracking-tight">
//         Let's Connect!
//       </h2>

//       <form onSubmit={handleSubmit} className="space-y-3">
//         {/* Name */}
//         <div className="relative">
//           <input
//             type="text"
//             id="name"
//             value={formData.name}
//             onChange={handleChange}
//             placeholder=" "
//             required
//             className="peer w-full border border-blue-300 rounded-lg px-4 pt-5 pb-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base transition"
//           />
//           <label
//             htmlFor="name"
//             className="absolute left-4 top-2 text-blue-600 text-xs sm:text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-600"
//           >
//             Full Name
//           </label>
//         </div>

//         {/* Email */}
//         <div className="relative">
//           <input
//             type="email"
//             id="email"
//             value={formData.email}
//             onChange={handleChange}
//             placeholder=" "
//             required
//             className="peer w-full border border-blue-300 rounded-lg px-4 pt-5 pb-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base transition"
//           />
//           <label
//             htmlFor="email"
//             className="absolute left-4 top-2 text-blue-600 text-xs sm:text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-600"
//           >
//             Email Address
//           </label>
//         </div>

//         {/* Message */}
//         <div className="relative">
//           <textarea
//             id="message"
//             value={formData.message}
//             onChange={handleChange}
//             placeholder=" "
//             rows={5}
//             required
//             className="peer w-full border border-blue-300 rounded-lg px-4 pt-5 pb-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm sm:text-base transition"
//           ></textarea>
//           <label
//             htmlFor="message"
//             className="absolute left-4 top-2 text-blue-600 text-xs sm:text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-600"
//           >
//             Your Message
//           </label>
//         </div>

//         {/* Submit Button */}
//         <button
//           type="submit"
//           disabled={isSubmitting}
//           className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition disabled:opacity-60 disabled:cursor-not-allowed"
//         >
//           <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
//           {!isSubmitting && (
//             <svg
//               className="w-5 h-5"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M14 5l7 7m0 0l-7 7m7-7H3"
//               />
//             </svg>
//           )}
//         </button>
//       </form>

//       {/* Notification */}
//       {notification && (
//         <div className="absolute top-4 right-4 bg-blue-600 text-white px-5 py-2.5 rounded-xl shadow-md animate-fadeInOut text-sm pointer-events-none">
//           {notification}
//         </div>
//       )}
//     </div>
//   </div>
// </section>

//       {/* FAQ Section */}
//       <section className="py-10 sm:py-14 px-4 sm:px-6 max-w-6xl mx-auto">
//         <h2 className="text-xl sm:text-2xl font-bold text-center mb-6 sm:mb-8 text-black">
//           Frequently Asked Questions
//         </h2>
//         <div className="space-y-2 sm:space-y-3">
//           {faqs.map((faq, index) => (
//             <div
//               key={index}
//               className="border border-blue-300 rounded-lg p-4 sm:p-5 cursor-pointer bg-white shadow-sm hover:shadow-md transition"
//               onClick={() => toggleFAQ(index)}
//               aria-expanded={activeFAQ === index}
//               aria-controls={`faq-answer-${index}`}
//             >
//               <h3 className="flex justify-between items-center text-black font-semibold text-sm sm:text-base">
//                 {faq.question}
//                 <span className="text-blue-500 font-bold text-lg">
//                   {activeFAQ === index ? "−" : "+"}
//                 </span>
//               </h3>
//               {activeFAQ === index && (
//                 <p
//                   id={`faq-answer-${index}`}
//                   className="mt-2 text-black text-sm sm:text-base leading-relaxed"
//                 >
//                   {faq.answer}
//                 </p>
//               )}
//             </div>
//           ))}
//         </div>
//       </section>

//       <style>{`
//         @keyframes fadeInOut {
//           0%, 100% { opacity: 0; transform: translateY(-10px);}
//           10%, 90% { opacity: 1; transform: translateY(0);}
//         }
//         .animate-fadeInOut {
//           animation: fadeInOut 3s ease forwards;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Contact;





import { useState, useEffect } from "react";
import "aos/dist/aos.css";
import { Link } from "react-router-dom";
import "@lottiefiles/lottie-player";

const faqs = [
  {
    question: "What services does your software development company offer?",
    answer:
      "We offer web & mobile app development, UI/UX design, enterprise software solutions, cloud integration, API development, QA testing, and consulting.",
  },
  {
    question: "Which technologies do you specialize in?",
    answer:
      "We specialize in React, Node.js, Vue.js, Python, Django, Laravel, Flutter, React Native, Kotlin/Swift, and cloud platforms like AWS, Azure, Google Cloud.",
  },
  {
    question: "Do you offer post-launch support?",
    answer:
      "Yes, we provide maintenance, updates, performance monitoring, and feature enhancements with monthly or ad-hoc packages.",
  },
];

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState("");
  const [activeFAQ, setActiveFAQ] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setNotification("Message sent successfully! 🎉");
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setNotification(""), 3000);
    }, 1500);
  };

  const toggleFAQ = (index) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  return (
    <div className="bg-white font-sans min-h-screen relative overflow-hidden">
      {/* Header */}
      <header className="relative flex flex-col items-center justify-center min-h-[140px] bg-blue-600 text-white rounded-b-[2rem] shadow-xl overflow-hidden">
        <h1 className="text-5xl font-extrabold tracking-wide relative drop-shadow-md">
          Contact Us
        </h1>
        <p className="mt-3 text-lg italic">We’d love to hear from you!</p>
        <div className="absolute top-4 left-4 w-3 h-3 bg-white rounded-full opacity-50 animate-pulse"></div>
        <div className="absolute bottom-6 right-6 w-4 h-4 bg-white rounded-full opacity-40 animate-bounce"></div>
      </header>

      {/* Contact Info Cards */}
      <section className="max-w-7xl mx-auto px-6 py-16 relative" data-aos="fade-up">
        {/* Background blobs */}
        <div className="absolute -top-10 -left-10 w-60 h-60 bg-blue-300 opacity-20 rounded-full filter blur-3xl z-0"></div>
        <div className="absolute bottom-0 -right-10 w-72 h-72 bg-purple-300 opacity-20 rounded-full filter blur-3xl z-0"></div>

        <div className="relative z-10 mb-12 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-black">
            Get In Touch
          </h2>
          <p className="text-gray-700 mt-4 max-w-2xl mx-auto">
            Have questions or ideas? Let's make something amazing together.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 relative z-10">
          {[
            {
              title: "Call Us",
              lines: [
                <Link key="1" to="tel:+916307503700" className="text-blue-600 hover:underline">
                  +91 6307503700
                </Link>,
                <Link key="2" to="tel:+918114247881" className="text-blue-600 hover:underline">
                  +91 8114247881
                </Link>,
              ],
              icon: "📞",
            },
            {
              title: "Email Us",
              lines: [
                <Link key="1" to="mailto:info@piedocx.com" className="text-blue-600 hover:underline">
                  info@piedocx.com
                </Link>,
              ],
              icon: "📧",
            },
            {
              title: "Visit Us",
              lines: ["Plot No.5 Chandralok Colony, Sector E, Aliganj, Lucknow, UP 226024"],
              icon: "📍",
            },
          ].map(({ title, lines, icon }, idx) => (
            <div
              key={idx}
              className="backdrop-blur-lg bg-white/70 border border-black/10 shadow-xl rounded-3xl p-8 transform hover:scale-105 transition-all duration-300"
            >
              <div className="text-4xl mb-4 text-blue-500 animate-wiggle">{icon}</div>
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <div className="space-y-1 text-gray-800">
                {lines.map((line, i) => <p key={i}>{line}</p>)}
              </div>
            </div>
          ))}
        </div>

        <style>{`
          @keyframes wiggle {
            0%,100%{transform:rotate(-2deg);}
            50%{transform:rotate(2deg);}
          }
          .animate-wiggle{
            animation: wiggle 3s ease-in-out infinite;
          }
        `}</style>
      </section>

      {/* Contact Form + Lottie */}
      <section className="max-w-6xl mx-auto px-6 py-16 rounded-3xl bg-gradient-to-br from-white via-blue-50 to-blue-100 shadow-2xl relative">
        <div className="flex flex-col sm:flex-row gap-10 items-center relative z-10">
          {/* Lottie */}
          <div className="sm:w-1/2 relative animate-float">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-100 rounded-full blur-2xl opacity-40 z-0"></div>
            <lottie-player
              src="https://assets5.lottiefiles.com/packages/lf20_h9kdsx3e.json"
              background="transparent"
              speed="1"
              style={{ width: "100%", maxWidth: "350px" }}
              loop
              autoplay
            ></lottie-player>
          </div>

          {/* Form */}
          <div className="sm:w-1/2 w-full">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-700 text-center sm:text-left mb-8">
              Let's Connect!
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 relative">
              {["name", "email", "message"].map((field, idx) => (
                <div key={idx} className="relative">
                  {field !== "message" ? (
                    <input
                      type={field === "email" ? "email" : "text"}
                      id={field}
                      value={formData[field]}
                      onChange={handleChange}
                      placeholder=" "
                      required
                      className="peer w-full border border-blue-300 rounded-lg px-4 pt-5 pb-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm sm:text-base"
                    />
                  ) : (
                    <textarea
                      id="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder=" "
                      rows={5}
                      required
                      className="peer w-full border border-blue-300 rounded-lg px-4 pt-5 pb-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm sm:text-base transition"
                    ></textarea>
                  )}
                  <label
                    htmlFor={field}
                    className="absolute left-4 top-2 text-blue-600 text-xs sm:text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-500 peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-600"
                  >
                    {field === "name" ? "Full Name" : field === "email" ? "Email Address" : "Your Message"}
                  </label>
                </div>
              ))}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition disabled:opacity-60"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>

              {notification && (
                <div className="absolute top-0 right-0 mt-[-2rem] bg-blue-600 text-white px-5 py-2.5 rounded-xl shadow-md animate-fadeInOut text-sm pointer-events-none">
                  {notification}
                </div>
              )}
            </form>
          </div>
        </div>

        <style>{`
          @keyframes float {
            0%,100%{transform:translateY(0);}
            50%{transform:translateY(-12px);}
          }
          .animate-float{animation: float 3s ease-in-out infinite;}
          @keyframes fadeInOut {
            0%,100%{opacity:0;transform:translateY(-10px);}
            10%,90%{opacity:1;transform:translateY(0);}
          }
          .animate-fadeInOut{animation:fadeInOut 3s ease forwards;}
        `}</style>
      </section>

      {/* FAQ */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-center mb-8">FAQs</h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="border border-blue-300 rounded-xl p-4 cursor-pointer bg-white shadow-sm hover:shadow-md transition"
              onClick={() => toggleFAQ(idx)}
            >
              <div className="flex justify-between items-center font-semibold">
                {faq.question}
                <span className="text-blue-500 text-lg">{activeFAQ === idx ? "−" : "+"}</span>
              </div>
              {activeFAQ === idx && <p className="mt-2 text-gray-700">{faq.answer}</p>}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Contact;
