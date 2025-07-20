import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Link } from "react-router-dom";
import { FaRocket, FaStar, FaGem } from "react-icons/fa";

const Pricing = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true, easing: "ease-in-out" });
  }, []);

  const plans = [
    {
      name: "Starter",
      price: 19,
      features: ["1 Website", "Custom Domain", "Basic SEO", "Limited Support"],
      link: "/contact",
      icon: (
        <FaRocket
          size={36}
          className="text-[#1E3A8A] mb-4 group-hover:text-white transition duration-700"
        />
      ),
      aos: "fade-right",
    },
    {
      name: "Pro",
      price: 49,
      features: [
        "3 Websites",
        "Custom Domain & Subdomain",
        "Advanced SEO",
        "24/7 Support",
      ],
      link: "/contact",
      icon: (
        <FaStar
          size={36}
          className="text-[#1E3A8A] mb-4 group-hover:text-white transition duration-700"
        />
      ),
      aos: "fade-up",
    },
    {
      name: "Business",
      price: 99,
      features: [
        "Unlimited Websites",
        "Custom Domain & Subdomain",
        "Enterprise SEO",
        "Premium Support",
      ],
      link: "/contact",
      icon: (
        <FaGem
          size={36}
          className="text-[#1E3A8A] mb-4 group-hover:text-white transition duration-700"
        />
      ),
      aos: "fade-left",
    },
  ];

  return (
    <section className="bg-white py-8 min-h-[80vh]">
      {/* Header */}
      <div className="text-center mb-8" data-aos="fade-down">
        <h2 className="text-4xl md:text-5xl font-extrabold text-[#1E293B] mb-3">
          Our Pricing Plans
        </h2>
        <p className="text-[#3B82F6] text-lg max-w-xl mx-auto">
          Choose a plan that fits your needs and scale confidently.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
        {plans.map((plan, index) => (
          <div
            key={index}
            data-aos={plan.aos}
            className="group relative overflow-hidden border-2 border-[#1E3A8A] rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-700 hover:-translate-y-2 bg-white"
          >
            {/* Hover background scroll - blue-400 */}
            <div className="absolute bottom-[-100%] left-0 w-full h-full bg-[#60A5FA] transition-all duration-[1500ms] group-hover:bottom-0 z-0 rounded-2xl" />

            {/* Card Content */}
            <div className="relative z-10 flex flex-col items-center text-center">
              {plan.icon}
              <h3 className="text-2xl font-semibold text-[#1E293B] group-hover:text-white transition duration-700">
                {plan.name}
              </h3>
              <p className="mt-1 text-[#1E293B] group-hover:text-white transition duration-700">
                <span className="text-4xl font-extrabold">${plan.price}</span>
                <span className="text-sm font-medium text-[#3B82F6] group-hover:text-white">
                  {" "}
                  /month
                </span>
              </p>
              <ul className="mt-3 mb-4 space-y-1.5">
                {plan.features.map((feature, i) => (
                  <li
                    key={i}
                    className="text-[#4B5563] group-hover:text-white transition duration-700"
                  >
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                to={plan.link}
                className="inline-block w-full px-6 py-3 bg-[#3B82F6] text-white font-semibold rounded-full hover:bg-[#1E40AF] hover:scale-105 transition duration-300"
              >
                Get Started
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Pricing;
