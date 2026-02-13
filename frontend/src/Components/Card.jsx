import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
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
  FaCogs,
  FaProjectDiagram,
  FaWpforms,
} from 'react-icons/fa';

function Services() {
  useEffect(() => {
    AOS.init({ duration: 1000, easing: 'ease-in-out', once: true });
  }, []);

  const services = [
    {
      title: "Full Stack Development",
      icon: <FaLaptopCode />,
      desc: "Scalable MERN stack applications with high performance. We build everything from pixel-perfect UIs to robust server-side logic.",
      link: "/services/full-stack",
      gradient: "from-blue-600 to-indigo-600"
    },
    {
      title: "Mobile App Development",
      icon: <FaMobileAlt />,
      desc: "Cross-platform iOS and Android apps using React Native and Flutter. Smooth animations and native-like performance.",
      link: "/services/android-ios",
      gradient: "from-indigo-600 to-purple-600"
    },
    {
      title: "Digital Marketing",
      icon: <FaBullhorn />,
      desc: "Result-driven SEO and social media strategies to boost your brand visibility and ROI with data analytics.",
      link: "/services/digital-marketing",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      title: "Graphic Designing",
      icon: <FaPaintBrush />,
      desc: "Creative brand identities, logos, and UI/UX designs that communicate your vision clearly and attractively.",
      link: "/services/graphic-design",
      gradient: "from-pink-600 to-rose-600"
    },
    {
      title: "Web Development",
      icon: <FaGlobe />,
      desc: "SEO-optimized, responsive websites using the latest technologies like Next.js and React for maximum speed.",
      link: "/services/web-development",
      gradient: "from-emerald-500 to-teal-600"
    },
    {
      title: "Hosting & Domain",
      icon: <FaServer />,
      desc: "Secure cloud hosting with 99.9% uptime, free SSL, and professional business email setup with 24/7 support.",
      link: "/services/domain-web-hosting",
      gradient: "from-indigo-700 to-blue-800"
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="text-center mb-16" data-aos="fade-up">
        <h2 className="text-blue-600 font-bold uppercase tracking-[0.2em] text-sm mb-4">Our Expertise</h2>
        <h3 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
          Solutions for every <span className="text-premium">Digital Need.</span>
        </h3>
      </div>

      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={30}
        loop={true}
        pagination={{ clickable: true }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="pb-16"
      >
        {services.map((card, index) => (
          <SwiperSlide key={index}>
            <div
              className="group relative h-full min-h-[400px] p-8 rounded-[2rem] bg-white border border-gray-100 shadow-xl shadow-gray-200/50 hover:shadow-blue-900/10 transition-all duration-500 overflow-hidden"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              {/* Corner Accent */}
              <div className={`absolute -top-12 -right-12 w-24 h-24 bg-gradient-to-br ${card.gradient} opacity-5 group-hover:opacity-20 transition-opacity duration-500 rounded-full`}></div>

              <div className="relative z-10 flex flex-col h-full">
                {/* Icon Circle */}
                <div className={`w-16 h-16 mb-8 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center text-white text-3xl shadow-lg shadow-blue-600/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                  {card.icon}
                </div>

                <h4 className="text-2xl font-bold text-gray-900 mb-4 transition-colors duration-300">
                  {card.title}
                </h4>

                <p className="text-gray-600 leading-relaxed mb-8 flex-grow">
                  {card.desc}
                </p>

                <div className="mt-auto">
                  <Link
                    to={card.link}
                    className="group/link inline-flex items-center gap-2 font-bold text-blue-600 hover:text-blue-700 transition-all"
                  >
                    Details
                    <span className="w-8 h-1 bg-blue-100 group-hover/link:w-12 transition-all duration-300 rounded-full"></span>
                    <span className="transform group-hover/link:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              </div>
              
              {/* Bottom Line Accent */}
              <div className={`absolute bottom-0 left-0 h-1.5 bg-gradient-to-r ${card.gradient} w-0 group-hover:w-full transition-all duration-700`}></div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

export default Services;
