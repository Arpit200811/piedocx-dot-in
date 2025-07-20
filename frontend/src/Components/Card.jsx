import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
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
      icon: <FaLaptopCode className="text-white text-base" />,
      desc: "We build scalable, maintainable, and fast full-stack web apps using the MERN stack. Whether it’s dashboards, portals, or SaaS, we engineer complete solutions from UI to backend APIs.",
      link: "/services/full-stack",
    },
    {
      title: "Mobile App Development",
      icon: <FaMobileAlt className="text-white text-base" />,
      desc: "Our team creates hybrid and native mobile apps using React Native, Flutter, and Kotlin. With focus on smooth animations, offline support, and excellent UX, your app stands out on both Android and iOS.",
      link: "/services/android-ios",
    },
    {
      title: "Digital Marketing",
      icon: <FaBullhorn className="text-white text-base" />,
      desc: "SEO, paid ads, content marketing, social media strategy — we handle it all to bring your business growth through result-driven digital presence. Track ROI with real-time reporting dashboards.",
      link: "/services/DigitalMarketing",
    },
    {
      title: "Graphic Designing",
      icon: <FaPaintBrush className="text-white text-base" />,
      desc: "Brand logos, social creatives, UI/UX designs, posters, flyers — our creative team ensures consistency and style across your entire brand identity.",
      link: "/services/Graphic-design",
    },
    {
      title: "Web Development",
      icon: <FaGlobe className="text-white text-base" />,
      desc: "Responsive and SEO-optimized websites using React, Next.js, WordPress, and more. We focus on accessibility, performance, and fast loading pages.",
      link: "/services/Web-Development",
    },
    {
      title: "Hosting & Domain",
      icon: <FaServer className="text-white text-base" />,
      desc: "Reliable cloud hosting, cPanel, VPS, DNS, email setup, SSL, backups, and free technical support. We also handle custom domain registration & renewals.",
      link: "/services/Domain & Web Hosting",
    },
    {
      title: "Custom Software",
      icon: <FaCogs className="text-white text-base" />,
      desc: "We build automation tools, custom ERPs, inventory systems, and cloud-based software. From requirement analysis to deployment and training, we handle everything end-to-end.",
      link: "/services/Custom-Software-Development",
    },
    {
      title: "ERP Solutions",
      icon: <FaProjectDiagram className="text-white text-base" />,
      desc: "Manage inventory, billing, HR, sales, accounts, and payroll in one centralized ERP platform. Custom dashboards, mobile support, and data export available.",
      link: "/services/ERP-Solutions",
    },
    {
      title: "CMS Solutions",
      icon: <FaWpforms className="text-white text-base" />,
      desc: "We offer WordPress, Strapi, and headless CMS with admin panels that make content editing easy without any coding. Secure and scalable architecture.",
      link: "/services/cms-Solution",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 pt-8 pb-4">
      <div
        className="mb-6 flex items-center before:flex-1 before:border-t after:flex-1 after:border-t"
        data-aos="fade-up"
      >
        <h3 className="mx-4 text-xl md:text-2xl font-bold text-center text-gray-800 capitalize">
          Our Services
        </h3>
      </div>

      <Swiper
        modules={[Autoplay]}
        spaceBetween={16}
        loop={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {services.map((card, index) => (
          <SwiperSlide key={index}>
            <div
              className="group relative p-4 m-2 rounded-xl bg-[#f9f9fc] shadow-[0_5px_25px_rgba(0,0,0,0.09)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition-all duration-700 ease-in-out overflow-hidden hover:scale-[1.015] h-[250px] flex flex-col justify-between"
              data-aos="fade-up"
              data-aos-delay={`${index * 100}`}
            >
              {/* Super Slow Background Hover Animation */}
              <div className="absolute inset-0 overflow-hidden z-0 rounded-xl">
                <div className="absolute bottom-0 left-0 w-full h-0 bg-gradient-to-t from-blue-500 to-blue-500 group-hover:h-full transition-all duration-[2000ms] ease-in-out"></div>
              </div>

              {/* Content */}
              <div className="relative z-10 flex flex-col h-full justify-between">
                {/* Icon */}
                <div className="w-9 h-9 mb-2 rounded-full bg-gradient-to-tr from-indigo-500 to-blue-500 flex items-center justify-center shadow transform transition-transform duration-500 group-hover:rotate-15 group-hover:scale-110">
                  {card.icon}
                </div>

                {/* Title */}
                <h4 className="text-sm font-semibold text-gray-900 group-hover:text-white transition-colors duration-500">
                  {card.title}
                </h4>

                {/* Description */}
                <p className="text-[16px] text-gray-900 group-hover:text-white line-clamp-4 group-hover:line-clamp-none transition-all duration-500 mt-1">
                  {card.desc}
                </p>

                {/* Button */}
                <div className="mt-2">
                  <Link
                    to={card.link}
                    className="inline-block text-[12px] font-semibold text-indigo-600 group-hover:text-white underline underline-offset-4 transition-all duration-500"
                  >
                    Learn More →
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

export default Services;
