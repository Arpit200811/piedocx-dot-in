import React, { useEffect } from "react";
import AOS from "aos";

const RefundPolicy = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white min-h-screen pt-14 md:pt-16 lg:pt-20 pb-12 px-6 sm:px-12 lg:px-24 text-gray-800 font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-blue-600 mb-8 border-b-4 border-blue-100 pb-2" data-aos="fade-down">
          Refund & Cancellation Policy
        </h1>

        <p className="text-lg mb-6 leading-relaxed" data-aos="fade-up">
          Thank you for choosing <strong>Piedocx Technologies</strong> for your software and training needs. We aim to provide the best possible experience to our clients and students.
        </p>

        <section className="mb-10" data-aos="fade-up" data-aos-delay="100">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
            1. Training Programs
          </h2>
          <p className="leading-relaxed">
            Fees paid for training programs (Industrial Training, Internships, etc.) are generally non-refundable once the course has commenced. If a student wishes to cancel their enrollment before the batch start date, a partial refund may be processed after deducting registration charges.
          </p>
        </section>

        <section className="mb-10" data-aos="fade-up" data-aos-delay="200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
            2. Software Development Services
          </h2>
          <p className="leading-relaxed">
            For specialized software development projects, the refund terms are mentioned in the service agreement signed at the start of the project. Generally, payments for milestones already completed and approved are non-refundable.
          </p>
        </section>

        <section className="mb-10" data-aos="fade-up" data-aos-delay="300">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
            3. Cancellation Process
          </h2>
          <p className="leading-relaxed">
            Requests for cancellation must be sent in writing to <strong>info@piedocx.com</strong>. The date of receipt of the email will be considered for the calculation of any eligible refund amount.
          </p>
        </section>

        <div className="bg-blue-50 p-6 rounded-xl border-l-4 border-blue-500" data-aos="zoom-in" data-aos-delay="400">
          <h3 className="text-xl font-bold text-blue-800 mb-2">Note:</h3>
          <p className="text-blue-700">
            Piedocx Technologies reserves the right to modify this policy at any time. Any changes will be updated on this page.
          </p>
        </div>

        <footer className="mt-12 text-sm text-gray-500 italic">
          Last Updated: February 2025
        </footer>
      </div>
    </div>
  );
};

export default RefundPolicy;
