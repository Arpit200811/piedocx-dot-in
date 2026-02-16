import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Typewriter from 'typewriter-effect';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';

import { DeveloperIllustration, AppIllustration, CloudIllustration, TeamIllustration } from './Illustrations';

const sliderData = [
  {
    title: 'Enterprise Software Solutions',
    subtitle: 'Building the backbone of modern business!',
    description: 'We engineer complex, scalable enterprise applications that drive efficiency and growth for global organizations.',
    component: <DeveloperIllustration />,
    color: 'from-blue-600 to-indigo-700'
  },
  {
    title: 'Custom Web & Mobile Apps',
    subtitle: 'From concept to multi-platform launch!',
    description: 'Our expert team delivers high-performance, user-centric mobile and web ecosystems designed for the modern user.',
    component: <AppIllustration />,
    color: 'from-blue-700 to-blue-900'
  },
  {
    title: 'Cloud-Native Engineering',
    subtitle: 'Scalable architectures that grow with you!',
    description: 'Leveraging cutting-edge cloud tech and microservices to build resilient systems that never experience downtime.',
    component: <CloudIllustration />,
    color: 'from-blue-500 to-sky-600'
  },
  {
    title: 'Dedicated Agile Teams',
    subtitle: 'Your vision, our engineering excellence!',
    description: 'Partner with elite developers who integrate seamlessly into your workflow to accelerate product delivery.',
    component: <TeamIllustration />,
    color: 'from-blue-800 to-indigo-950'
  }
];

const Slider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === sliderData.length - 1 ? 0 : prev + 1));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full min-h-[600px] md:min-h-[750px] overflow-hidden bg-white flex items-center pt-14 md:pt-16 lg:pt-20">

      {/* Dynamic Design Layer */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-full h-full opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]"></div>
        <div className="absolute -top-20 -left-20 w-[600px] h-[600px] bg-blue-100 rounded-full blur-[120px] opacity-40 animate-pulse"></div>
        <div className="absolute bottom-20 right-0 w-[400px] h-[400px] bg-indigo-100 rounded-full blur-[100px] opacity-30 animate-pulse-slow"></div>

        {/* Animated Particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -40, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 5 + i,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute bg-blue-400/20 rounded-full"
            style={{
              width: Math.random() * 20 + 5,
              height: Math.random() * 20 + 5,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

          {/* Enhanced Content Engine */}
          <div className="flex-1 max-w-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={`content-${current}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
                className="space-y-8"
              >
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-blue-50 border border-blue-100/50 shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Enterprise Ready</span>
                </div>

                <h1 className="text-4xl md:text-7xl font-black text-slate-900 leading-[1.05] tracking-tight group">
                  {sliderData[current].title.split(' ').map((word, i) => (
                    <span key={i} className={`inline-block mr-3 ${['Software', 'Enterprise', 'Solutions', 'Custom', 'Mobile', 'Cloud-Native', 'Dedicated', 'Agile'].includes(word) ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600' : ''}`}>
                      {word}
                    </span>
                  ))}
                </h1>

                <div className="min-h-[30px] text-xl md:text-2xl font-black text-blue-500 uppercase italic flex items-center gap-3">
                  <div className="w-8 h-[2px] bg-blue-500/30"></div>
                  <Typewriter
                    key={current}
                    options={{
                      strings: [sliderData[current].subtitle],
                      autoStart: true,
                      loop: false,
                      delay: 30,
                    }}
                  />
                </div>

                <p className="text-base md:text-xl text-slate-600 leading-relaxed font-medium max-w-xl border-l-4 border-blue-600/10 pl-6 bg-slate-50/50 py-4 rounded-r-3xl">
                  {sliderData[current].description}
                </p>

                <div className="flex flex-wrap items-center gap-5 pt-4">
                  <Link
                    to="/contact"
                    className="group relative px-10 py-5 bg-slate-900 rounded-3xl overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-slate-900/10"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span className="relative z-10 flex items-center gap-3 font-black text-sm uppercase tracking-widest text-white">
                      Initiate Project <ArrowRight size={18} />
                    </span>
                  </Link>
                  <Link
                    to="/services"
                    className="px-10 py-5 bg-white border-2 border-slate-100 rounded-3xl font-black text-sm uppercase tracking-widest text-slate-900 hover:bg-slate-50 hover:border-slate-200 transition-all flex items-center gap-3"
                  >
                    Capabilities
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Visual Projection Frame */}
          <div className="flex-1 w-full flex justify-center items-center relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={`image-${current}`}
                initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 1.1, rotate: 2 }}
                transition={{ duration: 0.8, ease: "circOut" }}
                className="relative group p-4 w-full h-full flex justify-center"
              >
                {/* Decorative Frame Elements */}
                <div className="absolute inset-0 bg-blue-100 rounded-[4rem] group-hover:bg-blue-200 blur-3xl opacity-20 transition-colors duration-1000"></div>
                <div className="absolute -inset-10 border border-blue-100 rounded-[5rem] opacity-50 group-hover:scale-110 transition-transform duration-1000"></div>

                <div className="relative w-full max-w-[400px] md:max-w-xl mx-auto drop-shadow-[0_35px_35px_rgba(0,0,0,0.1)] hover:drop-shadow-[0_35px_35px_rgba(37,99,235,0.1)] transition-all animate-float">
                  {sliderData[current].component}
                </div>

                {/* Floating Meta Tag */}
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="absolute bottom-10 right-0 md:right-10 bg-white shadow-2xl rounded-3xl p-5 border border-slate-100 backdrop-blur-md flex items-center gap-4 animate-float-slow"
                >
                  <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20"><Star fill="white" size={20} /></div>
                  <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Efficiency</p><p className="font-black text-slate-900 leading-none">99.9% Up</p></div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Modern Control Interface */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-6 bg-white/40 backdrop-blur-xl px-8 py-4 rounded-[2.5rem] border border-white shadow-2xl shadow-blue-900/5">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] font-mono mr-4">0{current + 1} / 0{sliderData.length}</p>
        <div className="flex gap-4">
          {sliderData.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`group relative h-2.5 rounded-full transition-all duration-700 ${current === i ? 'w-12 bg-blue-600' : 'w-2.5 bg-slate-200 hover:bg-slate-300'}`}
            >
              <div className={`absolute inset-0 bg-blue-600 rounded-full transition-opacity ${current === i ? 'opacity-100' : 'opacity-0'}`}></div>
            </button>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-30px) rotate(1deg); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.1); }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float 12s ease-in-out infinite reverse;
        }
        .animate-pulse-slow {
          animation: pulse-slow 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Slider;
