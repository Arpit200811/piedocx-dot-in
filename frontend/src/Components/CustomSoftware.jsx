import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  FaCode,
  FaPuzzlePiece,
  FaClipboardCheck,
  FaExpandArrowsAlt,
  FaStar,
  FaHandshake,
  FaCogs,
  FaPlug,
  FaShieldAlt,
} from "react-icons/fa";

const CustomSoftware = () => {
  useEffect(() => {
    AOS.init({ duration: 1200, once: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;600&display=swap');

        * { box-sizing: border-box; }

        body, html, #root {
          margin: 0;
          padding: 0;
          font-family: 'Poppins', sans-serif;
          background: #f0f4f8;
          color: #111827;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 4rem 1rem;
        }

        header {
          text-align: center;
          padding-bottom: 3rem;
        }

        header h1 {
          font-size: 3rem;
          font-weight: 600;
          color: #2563eb;
        }

        header h1::after {
          content: '';
          width: 60px;
          height: 4px;
          background: #3b82f6;
          display: block;
          margin: 0.5rem auto 0;
          border-radius: 3px;
          animation: underline 2s infinite alternate;
        }

        @keyframes underline {
          0% { width: 60px; }
          100% { width: 120px; background-color: #1e40af; }
        }

        header p {
          font-size: 1.2rem;
          max-width: 640px;
          margin: 1rem auto 0;
          font-weight: 300;
          color: #4b5563;
        }

        main {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
        }

        article {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 1.5rem;
          padding: 2rem 1.5rem;
          text-align: center;
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.05);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        article:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(37, 99, 235, 0.15);
        }

        .icon-box {
          background: #3b82f6;
          width: 70px;
          height: 70px;
          margin: 0 auto 1rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 5px 15px rgba(59, 130, 246, 0.3);
        }

        .icon-box svg {
          font-size: 2rem;
          color: #ffffff;
        }

        article h2 {
          font-size: 1.3rem;
          margin-bottom: 0.7rem;
          font-weight: 600;
          color: #2563eb;
        }

        article h3 {
          font-size: 1.1rem;
          font-weight: 600;
          color: #1e40af;
          margin-bottom: 0.5rem;
        }

        article p {
          font-size: 1rem;
          color: #374151;
          font-weight: 300;
        }

        @media (max-width: 600px) {
          header h1 {
            font-size: 2.3rem;
          }
        }
      `}</style>

      <div className="container">
        <header data-aos="fade-down">
          <h1>Custom Software Solutions</h1>
          <p>
            Personalized software solutions that grow with your business and give you a unique edge.
          </p>
        </header>

        <main>
          <article data-aos="fade-up" data-aos-delay="0">
            <div className="icon-box"><FaCode /></div>
            <h2>Custom Software</h2>
            <p>Tailored software designed specifically for your business needs and goals.</p>
          </article>

          <article data-aos="fade-up" data-aos-delay="100">
            <div className="icon-box"><FaPuzzlePiece /></div>
            <h3>Tailored Fit</h3>
            <p>Built to solve your specific processes or workflows better than generic solutions.</p>
          </article>

          <article data-aos="fade-up" data-aos-delay="200">
            <div className="icon-box"><FaClipboardCheck /></div>
            <h3>Unique Requirements</h3>
            <p>Customized for your special features, performance, or system integration needs.</p>
          </article>

          <article data-aos="fade-up" data-aos-delay="300">
            <div className="icon-box"><FaExpandArrowsAlt /></div>
            <h3>Scalable & Flexible</h3>
            <p>Evolves with your business and adapts to growing demands over time.</p>
          </article>

          <article data-aos="fade-up" data-aos-delay="400">
            <div className="icon-box"><FaStar /></div>
            <h3>Competitive Advantage</h3>
            <p>Empowers your team with tools built around your unique operations and strategy.</p>
          </article>

          <article data-aos="fade-up" data-aos-delay="500">
            <div className="icon-box"><FaHandshake /></div>
            <h3>Full Ownership</h3>
            <p>You fully own and control your custom software — no third-party limitations.</p>
          </article>

          <article data-aos="fade-up" data-aos-delay="600">
            <div className="icon-box"><FaCogs /></div>
            <h3>Efficiency Boost</h3>
            <p>Eliminates repetitive manual tasks and boosts team productivity.</p>
          </article>

          <article data-aos="fade-up" data-aos-delay="700">
            <div className="icon-box"><FaPlug /></div>
            <h3>Integration Ready</h3>
            <p>Easily connects with your existing tools like CRM, ERP, or payment systems.</p>
          </article>

          <article data-aos="fade-up" data-aos-delay="800">
            <div className="icon-box"><FaShieldAlt /></div>
            <h3>Secure by Design</h3>
            <p>Built with custom security layers to protect your critical business data.</p>
          </article>
        </main>
      </div>
    </>
  );
};

export default CustomSoftware;
