import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import {
  FaLaptopCode, FaMobileAlt, FaServer, FaSearch, FaShoppingCart,
  FaPaintBrush, FaCode, FaCogs, FaHeadset
} from 'react-icons/fa';

const WebDevelopment = () => {
  useEffect(() => {
    AOS.init({ duration: 1200, once: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
          margin-bottom: 0.6rem;
          font-weight: 600;
          color: #2563eb;
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
          <h1>Web Development Services</h1>
          <p>Building responsive, high-performance websites and applications tailored to your business goals.</p>
        </header>

        <main>
          <article data-aos="fade-up">
            <div className="icon-box"><FaLaptopCode /></div>
            <h2>Custom Web Development</h2>
            <p>Tailor-made websites and web apps using modern frameworks like React, Node.js, and MongoDB.</p>
          </article>

          <article data-aos="fade-right" data-aos-delay="100">
            <div className="icon-box"><FaMobileAlt /></div>
            <h2>Responsive Design</h2>
            <p>Optimized user interfaces that look great on all devices—from desktop to mobile.</p>
          </article>

          <article data-aos="zoom-in" data-aos-delay="200">
            <div className="icon-box"><FaServer /></div>
            <h2>Backend Development</h2>
            <p>Scalable server-side logic and API integration to power your applications.</p>
          </article>

          <article data-aos="flip-left" data-aos-delay="300">
            <div className="icon-box"><FaShoppingCart /></div>
            <h2>E-Commerce Solutions</h2>
            <p>Full-featured e-commerce platforms with secure payment and product management systems.</p>
          </article>

          <article data-aos="fade-up" data-aos-delay="400">
            <div className="icon-box"><FaPaintBrush /></div>
            <h2>UI/UX Design</h2>
            <p>Intuitive and visually appealing interfaces designed for excellent user experience.</p>
          </article>

          <article data-aos="zoom-in" data-aos-delay="500">
            <div className="icon-box"><FaCode /></div>
            <h2>Frontend Development</h2>
            <p>Modern, fast-loading, and interactive frontends using React, Vue, or Angular.</p>
          </article>

          <article data-aos="fade-left" data-aos-delay="600">
            <div className="icon-box"><FaSearch /></div>
            <h2>SEO Optimization</h2>
            <p>Enhance visibility on search engines with optimized site structure and content strategies.</p>
          </article>

          <article data-aos="zoom-in-up" data-aos-delay="700">
            <div className="icon-box"><FaCogs /></div>
            <h2>Maintenance & Support</h2>
            <p>Ongoing updates, bug fixes, and performance monitoring for your web apps.</p>
          </article>

          <article data-aos="fade-up" data-aos-delay="800">
            <div className="icon-box"><FaHeadset /></div>
            <h2>Tech Consultation</h2>
            <p>Expert advice on tech stack, system architecture, and digital transformation planning.</p>
          </article>
        </main>
      </div>
    </>
  );
};

export default WebDevelopment;
