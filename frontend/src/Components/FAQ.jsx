import React, { useEffect, useState } from "react";
import AOS from "aos";
import { FaPlus, FaMinus, FaSearch } from "react-icons/fa";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    window.scrollTo(0, 0);
  }, []);

  const faqs = [
    {
      q: "What services does Piedocx Technologies provide?",
      a: "We specialize in full-stack web development, mobile app development (Android/iOS), UI/UX design, digital marketing, and industrial training across multiple technologies like MERN, Python, Java, and .NET.",
      category: "Services"
    },
    {
      q: "Do you offer internship programs for students?",
      a: "Yes, we offer comprehensive industrial training and internship programs focused on practical learning with real-world projects. Students can learn MERN Stack, Python, Java, and many other latest technologies.",
      category: "Training"
    },
    {
      q: "Can you help me with Domain and Web Hosting?",
      a: "Absolutely! We provide high-speed, reliable web hosting services along with domain registration, SSL certificates, and technical support to keep your website running smoothly.",
      category: "Services"
    },
    {
      q: "What is the typical timeline for a software project?",
      a: "Project timelines depend on the complexity. A simple website might take 1-2 weeks, while a complex custom ERP or web application could take 4-12 weeks. We follow an agile process to deliver fast and reliable results.",
      category: "Process"
    },
    {
      q: "Where is Piedocx Technologies located?",
      a: "Our office is located at Plot no.5 Chandralok Colony, near Purania Chauraha, Aliganj, Lucknow, UP 226024. You are always welcome to visit us during business hours.",
      category: "General"
    },
    {
      q: "How can I apply for a job at Piedocx?",
      a: "You can visit our Careers page to see current openings or directly send your resume to info@piedocx.com. Our HR team will reach out to you if your profile matches our requirements.",
      category: "Careers"
    }
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
    faq.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white min-h-screen pt-14 md:pt-16 lg:pt-20 pb-16 px-6 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-600 mb-4" data-aos="fade-down">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600" data-aos="fade-up">
            Find answers to common questions about our services, training, and processes.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-12" data-aos="fade-up" data-aos-delay="100">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search your question here..." 
            className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-blue-50 focus:border-blue-500 focus:outline-none shadow-sm transition"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, i) => (
              <div 
                key={i} 
                className={`rounded-2xl border-2 transition-all duration-300 ${openIndex === i ? 'border-blue-500 bg-blue-50' : 'border-gray-100 hover:border-blue-200'}`}
                data-aos="fade-up"
                data-aos-delay={i * 50}
              >
                <button 
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                >
                  <span className={`font-bold text-lg ${openIndex === i ? 'text-blue-700' : 'text-gray-800'}`}>
                    {faq.q}
                  </span>
                  {openIndex === i ? <FaMinus className="text-blue-600 flex-shrink-0" /> : <FaPlus className="text-gray-400 flex-shrink-0" />}
                </button>
                
                {openIndex === i && (
                  <div className="px-6 pb-6 text-gray-700 leading-relaxed border-t border-blue-100 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-500 italic">
              No results found for "{searchQuery}". Try searching for something else.
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="mt-20 text-center bg-gray-50 p-10 rounded-3xl" data-aos="zoom-in">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Still have questions?</h2>
          <p className="text-gray-600 mb-6">If you couldn't find the answer you're looking for, feel free to contact our support team.</p>
          <a 
            href="mailto:info@piedocx.com" 
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
          >
            Email Us Today
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
