import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import {
  FaReact,
  FaNodeJs,
  FaDatabase,
  FaRocket,
  FaTools,
  FaCodeBranch,
  FaBug,
  FaRobot,
} from 'react-icons/fa';

const FullStackPage = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;600&display=swap');
        * { box-sizing: border-box; }
        html, body, #root {
          margin: 0;
          padding: 0;
          height: 100%;
          font-family: 'Poppins', sans-serif;
          background-color: #f0f4f8;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1rem;
          color: #000000;
        }
        header {
          text-align: center;
          padding: 4rem 1rem 2rem;
        }
        header h1 {
          font-size: 3rem;
          font-weight: 600;
          color: #2563eb;
        }
        header p {
          font-size: 1.3rem;
          font-weight: 300;
          color: #555;
          max-width: 600px;
          margin: 0 auto;
        }
        main {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 2rem;
          padding-top: 3rem;
        }
        article {
          background: #ffffff;
          border-radius: 12px;
          padding: 2rem;
          text-align: center;
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.05);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        article:hover {
          transform: translateY(-6px);
          box-shadow: 0 10px 30px rgba(37, 99, 235, 0.25);
        }
        .icon {
          font-size: 3rem;
          color: #2563eb;
          margin-bottom: 1rem;
        }
        article h2 {
          font-size: 1.4rem;
          margin-bottom: 1rem;
          font-weight: 600;
          color: #2563eb;
        }
        article p {
          font-size: 1rem;
          font-weight: 300;
          color: #444;
        }

        @media (max-width: 600px) {
          header h1 {
            font-size: 2rem;
          }
        }
      `}</style>

      <div className="container">
        <header data-aos="fade-down" role="banner">
          <h1>Full Stack Development</h1>
          <p>Crafting sleek, scalable, and robust applications from frontend to backend</p>
        </header>

        <main role="region" aria-label="Full Stack Services">
          <article data-aos="fade-up">
            <div className="icon" aria-hidden="true"><FaReact /></div>
            <h2>Frontend</h2>
            <p>Design seamless user interfaces using React and modern styling techniques.</p>
          </article>

          <article data-aos="fade-up" data-aos-delay="100">
            <div className="icon" aria-hidden="true"><FaNodeJs /></div>
            <h2>Backend</h2>
            <p>Build scalable backend systems using Node.js and Express.js.</p>
          </article>

          <article data-aos="fade-up" data-aos-delay="200">
            <div className="icon" aria-hidden="true"><FaDatabase /></div>
            <h2>Database</h2>
            <p>Manage data effectively with MongoDB and PostgreSQL.</p>
          </article>

          <article data-aos="fade-up" data-aos-delay="300">
            <div className="icon" aria-hidden="true"><FaRocket /></div>
            <h2>Deployment</h2>
            <p>Deploy apps using Docker, CI/CD pipelines, and cloud platforms.</p>
          </article>

          <article data-aos="zoom-in" data-aos-delay="400">
            <div className="icon" aria-hidden="true"><FaTools /></div>
            <h2>Dev Tools</h2>
            <p>Leverage tools like VS Code, Postman, and browser dev tools for productivity.</p>
          </article>

          <article data-aos="zoom-in" data-aos-delay="500">
            <div className="icon" aria-hidden="true"><FaCodeBranch /></div>
            <h2>Version Control</h2>
            <p>Track and collaborate using Git and GitHub workflows.</p>
          </article>

          <article data-aos="zoom-in" data-aos-delay="600">
            <div className="icon" aria-hidden="true"><FaBug /></div>
            <h2>Testing & Debugging</h2>
            <p>Ensure reliability with tools like Jest, Mocha, and real-time debugging.</p>
          </article>

          <article data-aos="flip-left" data-aos-delay="700">
            <div className="icon" aria-hidden="true"><FaRobot /></div>
            <h2>AI Integration</h2>
            <p>Enhance your apps with AI — from chatbots to smart recommendations — using OpenAI, LangChain, and real-time LLM APIs.</p>
          </article>
        </main>
      </div>
    </>
  );
};

export default FullStackPage;
