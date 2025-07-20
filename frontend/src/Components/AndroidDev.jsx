import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import {
  FaMobileAlt, FaAndroid, FaApple, FaReact,
  FaCloudUploadAlt, FaBug, FaTools, FaStore, FaTachometerAlt
} from 'react-icons/fa';

const AndroidDev = () => {
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
          height: 100%;
          font-family: 'Poppins', sans-serif;
          background-color: #f0f4f8;
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
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
        }

        header p {
          font-size: 1.2rem;
          font-weight: 300;
          color: #4b5563;
          max-width: 680px;
          margin: 0 auto;
        }

        main {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2.5rem;
        }

        article {
          background: #ffffff;
          border-radius: 1.5rem;
          padding: 2rem 1.5rem;
          text-align: center;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.05);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          border: 1px solid #e5e7eb;
        }

        article:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(37, 99, 235, 0.15);
        }

        .icon {
          font-size: 3rem;
          color: #3b82f6;
          margin-bottom: 1rem;
        }

        article h2 {
          font-size: 1.4rem;
          margin-bottom: 0.6rem;
          font-weight: 600;
          color: #2563eb;
        }

        article p {
          font-size: 1rem;
          font-weight: 300;
          color: #374151;
        }

        @media (max-width: 600px) {
          header h1 {
            font-size: 2.3rem;
          }
        }
      `}</style>

      <div className="container">
        <header data-aos="fade-down">
          <h1>Android & iOS App Development</h1>
          <p>Innovative, modern, and cross-platform mobile apps built with precision and performance</p>
        </header>

        <main>
          <article data-aos="fade-up">
            <div className="icon"><FaMobileAlt /></div>
            <h2>UI/UX Design</h2>
            <p>Craft elegant user experiences using Figma, Flutter widgets, and Material/Apple design systems.</p>
          </article>

          <article data-aos="fade-up" data-aos-delay="100">
            <div className="icon"><FaAndroid /></div>
            <h2>Android</h2>
            <p>Powerful native apps with Kotlin, Jetpack, and full Material Design compliance.</p>
          </article>

          <article data-aos="fade-up" data-aos-delay="200">
            <div className="icon"><FaApple /></div>
            <h2>iOS</h2>
            <p>Smooth iOS experiences with Swift, SwiftUI, and deep ecosystem integration.</p>
          </article>

          <article data-aos="fade-up" data-aos-delay="300">
            <div className="icon"><FaReact /></div>
            <h2>Cross-Platform</h2>
            <p>Single-codebase apps using Flutter or React Native with near-native performance.</p>
          </article>

          <article data-aos="zoom-in" data-aos-delay="400">
            <div className="icon"><FaCloudUploadAlt /></div>
            <h2>API Integration</h2>
            <p>Seamless real-time data via Firebase, REST APIs, and GraphQL with secure auth flows.</p>
          </article>

          <article data-aos="zoom-in" data-aos-delay="500">
            <div className="icon"><FaBug /></div>
            <h2>Testing</h2>
            <p>End-to-end and unit testing with tools like Espresso, Detox, and XCUITest.</p>
          </article>

          <article data-aos="zoom-in" data-aos-delay="600">
            <div className="icon"><FaTools /></div>
            <h2>Development Tools</h2>
            <p>Streamline dev cycles with Android Studio, Xcode, emulators, and Expo CLI.</p>
          </article>

          <article data-aos="flip-left" data-aos-delay="700">
            <div className="icon"><FaStore /></div>
            <h2>App Store Launch</h2>
            <p>Deploy confidently to Google Play & Apple App Store with signing, CI/CD, and analytics.</p>
          </article>

          <article data-aos="fade-up" data-aos-delay="800">
            <div className="icon"><FaTachometerAlt /></div>
            <h2>Performance Optimization</h2>
            <p>Improve app responsiveness and reduce load times using profiling tools, lazy loading, and efficient state management.</p>
          </article>
        </main>
      </div>
    </>
  );
};

export default AndroidDev;
