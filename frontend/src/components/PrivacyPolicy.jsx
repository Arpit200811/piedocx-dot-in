import React, { useEffect } from "react";
import AOS from "aos";

const PrivacyPolicy = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white min-h-screen pt-14 md:pt-16 lg:pt-20 pb-12 px-6 sm:px-12 lg:px-24 text-gray-800 font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-blue-600 mb-8 border-b-4 border-blue-100 pb-2" data-aos="fade-down">
          Privacy Policy
        </h1>
        
        <p className="text-lg mb-6 leading-relaxed" data-aos="fade-up">
          At <strong>Piedocx Technologies Pvt. Ltd.</strong>, we value your privacy. This Privacy Policy explains how we collect, use, and protect your personal information when you use our website and services.
        </p>

        <section className="mb-10" data-aos="fade-up" data-aos-delay="100">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
            1. Information Collection
          </h2>
          <p className="leading-relaxed">
            We collect information that you provide directly to us, such as when you fill out a contact form, register for a training program, or subscribe to our newsletter. This may include your name, email address, phone number, and professional details.
          </p>
        </section>

        <section className="mb-10" data-aos="fade-up" data-aos-delay="200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
            2. How We Use Your Information
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>To provide and manage our services, including software development and industrial training.</li>
            <li>To communicate with you regarding updates, offers, and support.</li>
            <li>To improve our website functionality and user experience.</li>
            <li>To comply with legal obligations and prevent fraudulent activities.</li>
          </ul>
        </section>

        <section className="mb-10" data-aos="fade-up" data-aos-delay="300">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
            3. Data Security
          </h2>
          <p className="leading-relaxed">
            We implement industry-standard security measures to safeguard your personal data from unauthorized access, disclosure, or alteration. However, please note that no method of transmission over the internet is 100% secure.
          </p>
        </section>

        <section className="mb-10" data-aos="fade-up" data-aos-delay="400">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
            4. Third-Party Sharing
          </h2>
          <p className="leading-relaxed">
            We do not sell or rent your personal information to third parties. We may share data with trusted partners who assist us in operating our website or conducting our business, as long as those parties agree to keep this information confidential.
          </p>
        </section>

        <section className="mb-10" data-aos="fade-up" data-aos-delay="500">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
            5. Contact Us
          </h2>
          <p className="leading-relaxed">
            If you have any questions about this Privacy Policy, please contact us at: <br />
            <strong>Email:</strong> info@piedocx.com <br />
            <strong>Phone:</strong> +91 6307503700, +91 8114247881
          </p>
        </section>

        <footer className="mt-12 text-sm text-gray-500 italic">
          Last Updated: February 2025
        </footer>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
