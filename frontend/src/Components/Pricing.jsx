import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Link } from "react-router-dom";
import { FaRocket, FaStar, FaGem, FaCheckCircle } from "react-icons/fa";

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
      icon: <FaRocket />,
      color: "from-blue-500 to-blue-700",
      isPopular: false
    },
    {
      name: "Pro",
      price: 49,
      features: [
        "3 Websites",
        "Domain & Subdomain",
        "Advanced SEO",
        "24/7 Priority Support",
      ],
      link: "/contact",
      icon: <FaStar />,
      color: "from-indigo-600 to-purple-600",
      isPopular: true
    },
    {
      name: "Business",
      price: 99,
      features: [
        "Unlimited Websites",
        "Full Infrastructure",
        "Enterprise SEO",
        "Premium Support",
      ],
      link: "/contact",
      icon: <FaGem />,
      color: "from-blue-800 to-blue-950",
      isPopular: false
    },
  ];

  return (
    <section className="py-24 px-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16" data-aos="fade-down">
          <h2 className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-4">Pricing Plans</h2>
          <h3 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
            Invest in your <span className="text-premium">Growth.</span>
          </h3>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Transparent pricing with no hidden fees. Scalable solutions designed to grow alongside your business.
          </p>
        </div>

        <div className="grid gap-10 md:gap-8 grid-cols-1 md:grid-cols-3">
          {plans.map((plan, index) => (
            <div
              key={index}
              data-aos="fade-up"
              data-aos-delay={index * 100}
              className={`relative p-8 rounded-[2.5rem] transition-all duration-500 hover:-translate-y-2 border ${plan.isPopular ? 'bg-gray-900 border-gray-800 shadow-2xl md:scale-105 z-10' : 'bg-white border-gray-100 shadow-xl'}`}
            >
              {plan.isPopular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                  Most Popular
                </div>
              )}

              <div className="flex flex-col h-full">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center text-white text-2xl mb-8 shadow-lg`}>
                  {plan.icon}
                </div>

                <h4 className={`text-2xl font-bold mb-2 ${plan.isPopular ? 'text-white' : 'text-gray-900'}`}>
                  {plan.name}
                </h4>
                
                <div className="mb-8">
                   <span className={`text-5xl font-black ${plan.isPopular ? 'text-white' : 'text-gray-900'}`}>${plan.price}</span>
                   <span className={`text-sm ${plan.isPopular ? 'text-gray-400' : 'text-gray-500'}`}>/month</span>
                </div>

                <ul className="space-y-4 mb-10 flex-grow">
                  {plan.features.map((feature, i) => (
                    <li key={i} className={`flex items-center gap-3 text-sm ${plan.isPopular ? 'text-gray-300' : 'text-gray-600'}`}>
                      <FaCheckCircle className="text-blue-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  to={plan.link}
                  className={`block w-full py-4 rounded-2xl font-bold text-center transition-all duration-300 ${plan.isPopular ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-600/20' : 'bg-gray-900 text-white hover:bg-black shadow-lg shadow-gray-900/10'}`}
                >
                  Choose Plan
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
