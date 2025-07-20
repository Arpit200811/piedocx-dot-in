import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import {
  FaPaintBrush, FaChartLine, FaEnvelopeOpenText, FaSearch,
  FaLaptopCode, FaUsers, FaBullhorn, FaEye, FaHeadset
} from 'react-icons/fa';

const GraphicsDev = () => {
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
          <h1>Graphic Design Services</h1>
          <p>Transforming ideas into stunning visuals that captivate, communicate, and convert.</p>
        </header>

        <main>
          <article data-aos="fade-up">
            <div className="icon-box"><FaPaintBrush /></div>
            <h2>Logo Design</h2>
            <p>Crafting memorable logos that define your brand identity and values.</p>
          </article>

          <article data-aos="fade-right" data-aos-delay="100">
            <div className="icon-box"><FaBullhorn /></div>
            <h2>Branding Materials</h2>
            <p>Designing brochures, letterheads, and other branding assets that make a lasting impression.</p>
          </article>

          <article data-aos="zoom-in" data-aos-delay="200">
            <div className="icon-box"><FaEnvelopeOpenText /></div>
            <h2>Poster & Flyer Design</h2>
            <p>Eye-catching promotional designs for events, offers, or announcements.</p>
          </article>

          <article data-aos="flip-left" data-aos-delay="300">
            <div className="icon-box"><FaUsers /></div>
            <h2>Social Media Graphics</h2>
            <p>Visually consistent posts, stories, and banners tailored for all platforms.</p>
          </article>

          <article data-aos="fade-up" data-aos-delay="400">
            <div className="icon-box"><FaChartLine /></div>
            <h2>Infographics</h2>
            <p>Data-driven visual stories that simplify complex information into digestible graphics.</p>
          </article>

          <article data-aos="zoom-in" data-aos-delay="500">
            <div className="icon-box"><FaLaptopCode /></div>
            <h2>UI/UX Design</h2>
            <p>Modern and user-focused designs for websites and apps that enhance usability and appeal.</p>
          </article>

          <article data-aos="fade-left" data-aos-delay="600">
            <div className="icon-box"><FaSearch /></div>
            <h2>Visual Content Audit</h2>
            <p>Analyze and improve your current designs for better alignment with your brand.</p>
          </article>

          <article data-aos="zoom-in-up" data-aos-delay="700">
            <div className="icon-box"><FaEye /></div>
            <h2>Illustration Services</h2>
            <p>Custom artwork and illustrations tailored to your storytelling needs.</p>
          </article>

          <article data-aos="fade-up" data-aos-delay="800">
            <div className="icon-box"><FaHeadset /></div>
            <h2>Creative Consultation</h2>
            <p>One-on-one sessions to brainstorm, refine, and elevate your design ideas.</p>
          </article>
        </main>
      </div>
    </>
  );
};

export default GraphicsDev;
