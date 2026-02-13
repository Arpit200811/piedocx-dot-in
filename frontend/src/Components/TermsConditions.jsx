import React, { useEffect } from "react";
import AOS from "aos";

const TermsConditions = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white min-h-screen pt-14 md:pt-16 lg:pt-20 pb-12 px-6 sm:px-12 lg:px-24 text-gray-800 font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-blue-600 mb-8 border-b-4 border-blue-100 pb-2" data-aos="fade-down">
          Terms & Conditions
        </h1>

        <p className="text-lg mb-6 leading-relaxed" data-aos="fade-up">
          Welcome to <strong>Piedocx Technologies</strong>. By accessing this website, we assume you accept these terms and conditions. Do not continue to use Piedocx.in if you do not agree to all of the terms and conditions stated on this page.
        </p>

        <section className="mb-10" data-aos="fade-up" data-aos-delay="100">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">1. License</h2>
          <p className="leading-relaxed">
            Unless otherwise stated, Piedocx Technologies and/or its licensors own the intellectual property rights for all material on Piedocx.in. All intellectual property rights are reserved. You may access this from Piedocx.in for your own personal use subjected to restrictions set in these terms and conditions.
          </p>
        </section>

        <section className="mb-10" data-aos="fade-up" data-aos-delay="200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">2. User Responsibilities</h2>
          <p className="leading-relaxed mb-4">You must not:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Republish material from Piedocx.in</li>
            <li>Sell, rent, or sub-license material from Piedocx.in</li>
            <li>Reproduce, duplicate, or copy material from Piedocx.in</li>
            <li>Redistribute content from Piedocx Technologies (unless content is specifically made for redistribution)</li>
          </ul>
        </section>

        <section className="mb-10" data-aos="fade-up" data-aos-delay="300">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Training & Certification</h2>
          <p className="leading-relaxed">
            Participation in our training programs is subject to enrollment criteria and payment of fees. Certificates are issued only upon successful completion of the course requirements and attendance standards set by our technical team.
          </p>
        </section>

        <section className="mb-10" data-aos="fade-up" data-aos-delay="400">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Limitation of Liability</h2>
          <p className="leading-relaxed">
            In no event shall Piedocx Technologies, nor any of its officers, directors, and employees, be held liable for anything arising out of or in any way connected with your use of this Website whether such liability is under contract. 
          </p>
        </section>

        <section className="mb-10" data-aos="fade-up" data-aos-delay="500">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Governing Law</h2>
          <p className="leading-relaxed">
            These Terms will be governed by and interpreted in accordance with the laws of the State of Uttar Pradesh, India, and you submit to the non-exclusive jurisdiction of the state and federal courts located in India for the resolution of any disputes.
          </p>
        </section>

        <footer className="mt-12 text-sm text-gray-500 italic">
          Last Updated: February 2025
        </footer>
      </div>
    </div>
  );
};

export default TermsConditions;
