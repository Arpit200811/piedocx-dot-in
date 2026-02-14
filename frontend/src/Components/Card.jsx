import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { Link } from 'react-router-dom';
import {
  FaLaptopCode,
  FaMobileAlt,
  FaBullhorn,
  FaPaintBrush,
  FaGlobe,
  FaServer,
} from 'react-icons/fa';

function Services() {
  const services = [
    {
      title: "Full Stack Development",
      icon: <FaLaptopCode />,
      desc: "Scalable MERN stack applications with high performance. We build everything from pixel-perfect UIs to robust server-side logic.",
      link: "/services/full-stack",
      gradient: "from-blue-600 to-blue-700"
    },
    {
      title: "Mobile App Development",
      icon: <FaMobileAlt />,
      desc: "Cross-platform iOS and Android apps using React Native and Flutter. Smooth animations and native-like performance.",
      link: "/services/android-ios",
      gradient: "from-blue-500 to-indigo-600"
    },
    {
      title: "Digital Marketing",
      icon: <FaBullhorn />,
      desc: "Result-driven SEO and social media strategies to boost your brand visibility and ROI with data analytics.",
      link: "/services/digital-marketing",
      gradient: "from-blue-400 to-blue-600"
    },
    {
      title: "Graphic Designing",
      icon: <FaPaintBrush />,
      desc: "Creative brand identities, logos, and UI/UX designs that communicate your vision clearly and attractively.",
      link: "/services/graphic-design",
      gradient: "from-blue-700 to-indigo-800"
    },
    {
      title: "Web Development",
      icon: <FaGlobe />,
      desc: "SEO-optimized, responsive websites using the latest technologies like Next.js and React for maximum speed.",
      link: "/services/web-development",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      title: "Hosting & Domain",
      icon: <FaServer />,
      desc: "Secure cloud hosting with 99.9% uptime, free SSL, and professional business email setup with 24/7 support.",
      link: "/services/domain-web-hosting",
      gradient: "from-blue-800 to-indigo-900"
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-24 bg-white">
      <div className="text-center mb-20">
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-blue-600 font-black uppercase tracking-[0.4em] text-[10px] mb-4"
        >
          Industrial Expertise
        </motion.p>
        <motion.h3 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase italic leading-[0.9]"
        >
          Solutions for the <br/> <span className="text-blue-600 underline decoration-blue-50 decoration-8 underline-offset-8">Digital Era.</span>
        </motion.h3>
      </div>

      <div className="relative">
        {/* Swiper Container with custom styling */}
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={40}
          loop={true}
          pagination={{ clickable: true, dynamicBullets: true }}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="!pb-20"
        >
          {services.map((card, index) => (
            <SwiperSlide key={index}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative h-full min-h-[450px] p-10 rounded-[3.5rem] bg-white border border-blue-50 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_80px_-20px_rgba(37,99,235,0.15)] transition-all duration-700 overflow-hidden"
              >
                {/* Visual Glassmorphism Background Accent */}
                <div className={`absolute -top-20 -right-20 w-48 h-48 bg-gradient-to-br ${card.gradient} opacity-[0.03] group-hover:opacity-10 transition-all duration-700 rounded-full blur-3xl`}></div>
                
                <div className="relative z-10 flex flex-col h-full">
                  {/* Icon Node */}
                  <div className={`w-16 h-16 mb-10 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center text-white text-3xl shadow-xl shadow-blue-600/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                    {card.icon}
                  </div>

                  <h4 className="text-2xl font-black text-slate-900 mb-4 uppercase italic tracking-tighter group-hover:text-blue-600 transition-colors">
                    {card.title}
                  </h4>

                  <p className="text-slate-500 font-medium text-sm leading-relaxed mb-10 flex-grow italic border-l-2 border-blue-50 pl-6">
                    {card.desc}
                  </p>

                  <div className="mt-auto">
                    <Link
                      to={card.link}
                      className="group/link inline-flex items-center gap-4 py-4 px-8 bg-blue-50 text-blue-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                    >
                      Initialize Link
                      <span className="transform group-hover/link:translate-x-2 transition-transform">→</span>
                    </Link>
                  </div>
                </div>
                
                {/* Interactive Base Accent */}
                <div className={`absolute bottom-0 left-0 h-2 bg-gradient-to-r ${card.gradient} w-0 group-hover:w-full transition-all duration-1000`}></div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
        
        {/* Custom Navigation indicators/dots styling overrides via style tag */}
        <style>{`
          .swiper-pagination-bullet { width: 12px; height: 12px; background: #e2e8f0; opacity: 1; transition: all 0.3s; margin: 0 6px !important; }
          .swiper-pagination-bullet-active { width: 40px; border-radius: 6px; background: #2563eb; }
        `}</style>
      </div>
    </section>
  );
}

export default Services;
