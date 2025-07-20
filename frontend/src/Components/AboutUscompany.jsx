import { useEffect } from "react";
import AOS from "aos";
import {
  FaUserCheck,
  FaSyncAlt,
  FaBullseye,
  FaEye,
  FaCode,
  FaMobileAlt,
  FaCloud,
  FaShieldAlt,
  FaCogs,
  FaRocket,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import CountUp from "react-countup";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "aos/dist/aos.css";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";

const AboutUsCompany = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const features = [
    { title: "Client-First Approach", icon: <FaUserCheck /> },
    { title: "Cutting-Edge Tech", icon: <FaRocket /> },
    { title: "Transparent Workflow", icon: <FaSyncAlt /> },
    { title: "Agile Processes", icon: <FaCogs /> },
  ];

  const services = [
    { icon: <FaCode size={32} />, title: "Web Development", desc: "Responsive, modern, and scalable websites." },
    { icon: <FaMobileAlt size={32} />, title: "App Development", desc: "iOS & Android apps that drive results." },
    { icon: <FaCloud size={32} />, title: "Cloud Solutions", desc: "Cloud-native software built to scale." },
    { icon: <FaShieldAlt size={32} />, title: "Cybersecurity", desc: "Security-first development and compliance." },
    { icon: <FaCogs size={32} />, title: "Software Engineering", desc: "Robust backend and APIs that perform." },
    { icon: <FaRocket size={32} />, title: "Product Launch", desc: "From MVP to scale with precision." },
  ];

  const faqs = [
    {
      q: "What makes your software development approach unique?",
      a: "We blend agile methodology with design thinking to ensure each solution is user-centric, scalable, and business-driven.",
    },
    {
      q: "How do you ensure product quality and reliability?",
      a: "Through rigorous testing cycles, continuous integration, and industry-standard QA practices, we ensure products are stable and high-performing.",
    },
    {
      q: "Can you integrate AI/ML into business applications?",
      a: "Yes, we specialize in integrating advanced AI and machine learning capabilities tailored to your business use-cases.",
    },
    {
      q: "How do you maintain transparency during development?",
      a: "We provide real-time updates, sprint demos, and direct communication channels to keep clients in the loop at every step.",
    },
    {
      q: "Do you help startups with MVPs and scaling?",
      a: "Absolutely. We assist in rapid MVP development and help scale products based on real-time user feedback and metrics.",
    },
    {
      q: "What cloud platforms do you support?",
      a: "We work with AWS, Microsoft Azure, Google Cloud, and other platforms to provide robust and secure cloud solutions.",
    },
    {
      q: "Can I hire a dedicated development team?",
      a: "Yes, we offer flexible engagement models including dedicated team hiring, staff augmentation, and fixed-bid projects.",
    },
    {
      q: "What is your average project turnaround time?",
      a: "Timelines vary by scope, but we’re known for rapid development cycles with MVPs typically delivered in 4–6 weeks.",
    },
    {
      q: "How do you handle data privacy and compliance?",
      a: "We follow GDPR, HIPAA, and other international data standards to ensure complete privacy, compliance, and trust.",
    },
    {
      q: "Do you offer post-launch marketing or SEO support?",
      a: "While our core is development, we partner with digital agencies to provide branding, SEO, and go-to-market strategy support.",
    },
  ];

  const testimonials = [
    {
      name: "Ananya Kapoor",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      title: "CTO, FinEdge",
      quote: "Their MVP delivery speed helped us raise funding within 3 months. Thanks to the expertise of Piedocx Technologies Pvt Ltd, Lucknow.",
    },
    {
      name: "Rahul Verma",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      title: "Founder, HealthSync",
      quote: "Collaborating with them was seamless. The team delivered high-quality code and kept us in the loop constantly.",
    },
    {
      name: "Sophia Mehta",
      image: "https://randomuser.me/api/portraits/women/65.jpg",
      title: "Marketing Lead, GoDigital",
      quote: "They felt like a true extension of our startup team. Fast, reliable, smart — just like you'd expect from Piedocx Technologies, Lucknow.",
    },
    {
      name: "Nikhil Roy",
      image: "https://randomuser.me/api/portraits/men/53.jpg",
      title: "Strategic Partner, CodeBridge",
      quote: "A flawless integration with our enterprise systems was made possible by the team at Piedocx Technologies Pvt Ltd based in Lucknow.",
    },
    {
      name: "Shruti Jain",
      image: "https://randomuser.me/api/portraits/women/45.jpg",
      title: "Marketing Lead, Agency360",
      quote: "Their professionalism and technical expertise remind me why we chose Piedocx Technologies Pvt Ltd, Lucknow, for this crucial project.",
    },
    {
      name: "Arun Malhotra",
      image: "https://randomuser.me/api/portraits/men/50.jpg",
      title: "VP Engineering, Titan Solutions",
      quote: "Together with Piedocx Technologies Pvt Ltd, Lucknow, we delivered success to more than 10 clients seamlessly.",
    },
    {
      name: "Neha Verma",
      image: "https://randomuser.me/api/portraits/women/40.jpg",
      title: "IT Head, Enterprise Corp",
      quote: "It’s rare to find a tech partner like Piedocx Technologies Pvt Ltd from Lucknow — reliable, innovative, and client-focused.",
    },
  ];


  return (
    <main className="bg-white font-sans scroll-smooth text-black">
     

      {/* Hero */}
      <header className="bg-blue-500 text-white text-center py-16  px-1 shadow-xl">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-3" data-aos="fade-down">
          Empowering Digital Innovation
        </h1>
        <p className="text-xl max-w-3xl mx-auto" data-aos="fade-up">
          Full-cycle software development company delivering world-class solutions across web, mobile, and cloud platforms.
        </p>
      </header>

      {/* Who We Are */}
      <section className="py-10 px-4 text-center" data-aos="fade-up">
        <h2 className="text-4xl font-bold mb-2">Who We Are</h2>
        <p className="max-w-4xl mx-auto text-lg">
          We’re a team of engineers, designers, and problem solvers building cutting-edge software products. Our approach blends innovation, scalability, and deep technical expertise.
        </p>
        <div className="flex justify-center flex-wrap gap-10 mt-12">
          {[
            { label: "Projects Delivered", value: 25 },
            { label: "Tech Experts", value: 15 },
            { label: "Global Clients", value: 35 },
            { label: "Years in Industry", value: 5 },
          ].map((stat, idx) => (
            <div key={idx} className="transform hover:scale-110 transition text-center">
              <h3 className="text-3xl font-extrabold text-blue-500">
                <CountUp end={stat.value} duration={3} delay={1} suffix="+" />
              </h3>
              <p className="text-lg mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="bg-white py-10 px-4 relative overflow-hidden" data-aos="fade-up">
        <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/white-diamond.png')] pointer-events-none"></div>
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-10 text-[#1877F2]">
          🚀 Our Creative Services
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-6xl mx-auto z-10 relative">
          {services.map((item, i) => (
            <article
              key={i}
              className="group p-6 bg-white border rounded-2xl shadow-xl transition transform hover:-translate-y-2 hover:shadow-2xl duration-300"
              data-aos="zoom-in"
              data-aos-delay={i * 100}
            >
              <div className="text-white bg-gradient-to-r from-blue-500 to-purple-600 w-16 h-16 mx-auto flex items-center justify-center rounded-full mb-4 group-hover:rotate-12 transition duration-300">
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-10 px-4 bg-white" data-aos="fade-up">
      <h2 className="text-4xl sm:text-5xl font-bold text-center text-blue-500 mb-16 underline decoration-blue-300 decoration-4 underline-offset-8">
        Mission & Vision
      </h2>

      <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">
        {/* Mission Card */}
        <div
          className="group bg-white border-2 border-blue-500 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-2 relative overflow-hidden"
          data-aos="zoom-in"
        >
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-100 rounded-full z-0 group-hover:scale-125 transition-transform duration-500"></div>

          <div className="relative z-10">
            <div className="text-4xl text-blue-500 mb-4">
              <FaBullseye />
            </div>
            <h3 className="text-2xl font-semibold text-blue-500 mb-4">
              Our Mission
            </h3>
            <p className="text-gray-700 leading-relaxed">
              To deliver transformative digital products that enhance business outcomes and delight users.
            </p>
          </div>
        </div>

        {/* Vision Card */}
        <div
          className="group bg-white border-2 border-blue-500 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-2 relative overflow-hidden"
          data-aos="zoom-in"
          data-aos-delay="150"
        >
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-100 rounded-full z-0 group-hover:scale-125 transition-transform duration-500"></div>

          <div className="relative z-10">
            <div className="text-4xl text-blue-500 mb-4">
              <FaEye />
            </div>
            <h3 className="text-2xl font-semibold text-blue-500 mb-4">
              Our Vision
            </h3>
            <p className="text-gray-700 leading-relaxed">
              To become a globally trusted tech partner known for innovation and excellence.
            </p>
          </div>
        </div>
      </div>
    </section>

      {/* Why Choose Us */}
      <section className="bg-blue-50 py-12 px-5 text-center" data-aos="fade-up">
      <h2 className="text-4xl sm:text-5xl font-bold text-blue-500 mb-10 underline underline-offset-8 decoration-4 decoration-blue-300">
        Why Choose Us?
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {features.map((feature, i) => (
          <div
            key={i}
            className="bg-white border border-blue-200 rounded-2xl p-8 shadow-md hover:shadow-xl transition duration-300 transform hover:-translate-y-2 group"
            data-aos="zoom-in"
            data-aos-delay={i * 100}
          >
            <div className="text-blue-500 text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold text-black group-hover:text-blue-500 transition-colors duration-300">
              {feature.title}
            </h3>
          </div>
        ))}
      </div>
    </section>

      {/* FAQs */}
      <section className="py-8 px-3 bg-white" data-aos="fade-up">
        <h2 className="text-4xl font-bold text-center mb-8">FAQs</h2>
        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq, i) => (
            <details key={i} className="group bg-blue-50 p-5 rounded-lg shadow-md">
              <summary className="cursor-pointer text-lg font-medium text-blue-500 flex justify-between items-center">
                {faq.q}
                <span className="transition-200 duration-300  group-open:rotate-180">▼</span>
              </summary>
              <p className="mt-2 leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Testimonials Slider */}
       <section className="bg-gradient-to-br from-blue-500 via-blue-500 to-blue-700 text-white py-10 px-2" data-aos="fade-up">
      <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">What Our Clients Say</h2>
      <p className="text-center text-lg text-blue-100 mb-6 max-w-2xl mx-auto">
        Discover how businesses grow faster with Piedocx Technologies Pvt Ltd, Lucknow
      </p>

      <div className="max-w-6xl mx-auto">
        <Swiper
          modules={[ Autoplay]}
          slidesPerView={1}
          spaceBetween={30}
          loop={true}
          pagination={{ clickable: true }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {testimonials.map((client, i) => (
           <SwiperSlide key={i} className="flex justify-center">
  <blockquote className="flex flex-col justify-between bg-white/10 backdrop-blur-xl p-4 rounded-2xl shadow-xl text-left hover:scale-[1.03] transition-all duration-300 w-full h-[200px] max-w-[380px] border border-white/20 relative overflow-hidden">
    <div className="absolute top-2 right-3 text-white text-4xl opacity-10 transform rotate-6 pointer-events-none">
      “
    </div>
    <p className="italic text-xs md:text-sm leading-snug text-white/90 line-clamp-3 overflow-hidden mb-4">
      {client.quote}
    </p>
    <div className="flex items-center gap-3 mt-auto">
      <img
        src={client.image}
        alt={client.name}
        className="w-10 h-10 rounded-full border-2 border-white shadow"
      />
      <div>
        <h4 className="font-semibold text-white text-sm">{client.name}</h4>
        <p className="text-xs text-blue-100">{client.title}</p>
      </div>
    </div>
  </blockquote>
</SwiperSlide>

          ))}
        </Swiper>
      </div>
    </section>


      {/* CTA */}
      <section className="py-8 text-center bg-white" data-aos="fade-up">
        <h2 className="text-3xl font-bold mb-2">Let’s Build the Future Together</h2>
        <p className="max-w-xl mx-auto mb-3">
          Whether you’re launching a startup or scaling an enterprise, we’re ready to partner and create impactful digital products.
        </p>
        <Link
          to="/contact"
          className="inline-block bg-blue-500 text-white px-8 py-3 rounded-lg shadow hover:bg-blue-600"
        >
          Contact Us
        </Link>
      </section>
    </main>
  );
};

export default AboutUsCompany;
