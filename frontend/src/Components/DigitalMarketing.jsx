import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import {
  FaBullhorn, FaChartLine, FaEnvelopeOpenText, FaSearch,
  FaPaintBrush, FaUsers, FaLaptopCode, FaEye, FaHeadset
} from 'react-icons/fa';

const DigitalMarketing = () => {
  useEffect(() => {
    AOS.init({ duration: 1200, once: true });
    setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }, 50);
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
          <h1>Digital Marketing Services</h1>
          <p>We create impactful digital journeys that convert your audience into loyal customers.</p>
        </header>

        <main>
          <article data-aos="fade-up">
            <div className="icon-box"><FaBullhorn /></div>
            <h2>Brand Strategy</h2>
            <p>Develop strong brand messaging & identity that resonate with your ideal audience.</p>
          </article>

          <article data-aos="fade-right" data-aos-delay="100">
            <div className="icon-box"><FaSearch /></div>
            <h2>SEO</h2>
            <p>Rank higher organically with smart SEO practices and continuous content optimization.</p>
          </article>

          <article data-aos="zoom-in" data-aos-delay="200">
            <div className="icon-box"><FaEnvelopeOpenText /></div>
            <h2>Email Marketing</h2>
            <p>Engage users with automated, segmented, and personalized email funnels.</p>
          </article>

          <article data-aos="flip-left" data-aos-delay="300">
            <div className="icon-box"><FaUsers /></div>
            <h2>Social Media Marketing</h2>
            <p>Build loyalty and buzz with storytelling, campaigns, and influencer partnerships.</p>
          </article>

          <article data-aos="fade-up" data-aos-delay="400">
            <div className="icon-box"><FaChartLine /></div>
            <h2>Analytics & Reporting</h2>
            <p>We turn data into insight to optimize your digital investment with precision.</p>
          </article>

          <article data-aos="zoom-in" data-aos-delay="500">
            <div className="icon-box"><FaPaintBrush /></div>
            <h2>Creative Design</h2>
            <p>Visually stunning creatives that drive clicks, engagement, and conversion.</p>
          </article>

          <article data-aos="fade-left" data-aos-delay="600">
            <div className="icon-box"><FaLaptopCode /></div>
            <h2>Landing Page Optimization</h2>
            <p>Design and test responsive pages that increase leads and reduce bounce.</p>
          </article>

          <article data-aos="zoom-in-up" data-aos-delay="700">
            <div className="icon-box"><FaEye /></div>
            <h2>Paid Ad Campaigns</h2>
            <p>Run scalable Google Ads and social campaigns with measurable ROAS.</p>
          </article>

          <article data-aos="fade-up" data-aos-delay="800">
            <div className="icon-box"><FaHeadset /></div>
            <h2>Strategy Consulting</h2>
            <p>Access expert insights, audits, and one-on-one digital growth sessions.</p>
          </article>
        </main>
      </div>
    </>
  );
};

export default DigitalMarketing;
