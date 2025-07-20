import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Typewriter from 'typewriter-effect';

const sliderData = [
  {
    title: 'Innovate with Piedocx Technologies',
    subtitle: 'Crafting modern digital solutions!',
    description:
      'We deliver scalable web, mobile, and AI-driven applications tailored to your business needs.',
    image: 'slider1.jpg',
  },
  {
    title: 'Empowering Startups & Enterprises',
    subtitle: 'With full-stack development expertise!',
    description:
      'At Piedocx Technologies, we use MERN stack and cloud-first strategies to build powerful, production-ready platforms.',
    image: 'slider2.jpg',
  },
  {
    title: 'Transform Ideas into Products',
    subtitle: 'With agile, data-driven development!',
    description:
      'From MVPs to enterprise-grade solutions, Piedocx helps you go from concept to launch quickly and efficiently.',
    image: 'slider3.jpg',
  },
  {
    title: 'Let’s Build the Future Together',
    subtitle: 'With Piedocx as your tech partner!',
    description:
      'Collaborate with a team that values innovation, performance, and long-term scalability.',
    image: 'slider4.jpg',
  },
];

// Floating animation
const FloatingAnimationStyles = () => (
  <style>{`
    @keyframes floatUpDown {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-10px);
      }
    }
    .animate-float {
      animation: floatUpDown 4s ease-in-out infinite;
    }
  `}</style>
);

const Slider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === sliderData.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <FloatingAnimationStyles />

      <div className="w-full max-w-[1440px] px-4 sm:px-6 md:px-8 mt-20">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-6 md:gap-10">
          
          {/* Text Section */}
          <div className="flex-1 flex flex-col justify-center space-y-4 text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-500 leading-snug">
              {sliderData[current].title}
            </h1>

            {/* Typewriter Subtitle */}
            <div
              className="text-xl sm:text-2xl text-blue-600 font-semibold min-h-[48px] flex items-center justify-center lg:justify-start"
            >
              <Typewriter
                key={current}
                options={{
                  strings: [sliderData[current].subtitle],
                  autoStart: true,
                  loop: false,
                  delay: 40,
                  deleteSpeed: 20,
                }}
              />
            </div>

            {/* Description */}
            <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed min-h-[72px]">
              {sliderData[current].description}
            </p>

            {/* Button - stays fixed in vertical layout */}
            <div className="pt-2">
              <Link
                to="/contact"
                className="inline-block px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-md text-base sm:text-lg font-medium transition duration-300"
              >
                Explore More
              </Link>
            </div>
          </div>

          {/* Image Section */}
          <div className="flex-1 flex justify-center items-center">
            <div className="w-[220px] sm:w-[280px] md:w-[320px] lg:w-[400px]">
              <img
                src={sliderData[current].image}
                alt="Slide visual"
                className="w-full h-auto object-contain animate-float transition-transform duration-500 ease-in-out hover:scale-105 rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Slider;
