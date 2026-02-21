import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { 
  Database, 
  Cloud, 
  Terminal, 
  Cpu, 
  Workflow, 
  Sparkles, 
  ArrowRight,
  Code2,
  Zap,
  ShieldCheck,
  Layers,
  GitBranch,
  Server,
  Layout,
  Lock,
  Activity
} from "lucide-react";

const AdvanceJavaServices = () => {
  useEffect(() => {
    AOS.init({ duration: 1200, once: true });
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  const services = [
    {
      title: "Spring Ecosystem",
      description: "Enterprise-grade logic with Spring Boot, Security, and Cloud orchestration.",
      icon: <Layers className="w-5 h-5 text-green-600" />,
      delay : 0
    },
    {
      title: "Hibernate & JPA",
      description: "Advanced ORM solutions and transaction management for complex data layers.",
      icon: <Database className="w-5 h-5 text-indigo-600" />,
      delay: 50
    },
    {
      title: "Microservices Core",
      description: "Developing resilient, distributed systems using Java and Spring Cloud Netflix.",
      icon: <Server className="w-5 h-5 text-blue-600" />,
      delay: 100
    },
    {
      title: "Cyber Security",
      description: "Implementing OAuth2, JWT, and zero-trust security for enterprise safety.",
      icon: <Lock className="w-5 h-5 text-rose-600" />,
      delay: 150
    },
    {
      title: "Cloud Native Java",
      description: "Deploying high-performance JVM apps on AWS and Azure cloud platforms.",
      icon: <Cloud className="w-5 h-5 text-blue-400" />,
      delay: 200
    },
    {
      title: "JVM Performance",
      description: "GC tuning, multithreading, and low-latency optimization for large-scale systems.",
      icon: <Activity className="w-5 h-5 text-emerald-600" />,
      delay: 250
    }
  ];

  return (
    <main className="bg-white min-h-screen font-sans pt-14 md:pt-16 lg:pt-20 pb-12 md:pb-16 selection:bg-blue-100 selection:text-blue-600">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Compact Header */}
        <div className="text-center mb-10 md:mb-16" data-aos="fade-down">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 mb-4 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] leading-none">
             Enterprise Systems
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter italic mb-4">
             Advance Java <span className="text-blue-600">Architectures.</span>
          </h1>
          <p className="max-w-xl mx-auto text-slate-500 font-medium text-sm md:text-base leading-relaxed">
             We deliver mission-critical Java solutions using Spring, Hibernate, and cloud-native frameworks for resilient enterprise performance.
          </p>
        </div>

        {/* Dense Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {services.map((service, index) => (
            <article
              key={index}
              className="group bg-slate-50 hover:bg-white border border-transparent hover:border-blue-100 rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8 transition-all duration-500 shadow-sm hover:shadow-xl hover:shadow-blue-600/5"
              data-aos="fade-up"
              data-aos-delay={service.delay}
            >
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl flex items-center justify-center mb-4 md:mb-6 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all border border-slate-100">
                {service.icon}
              </div>
              <h2 className="text-lg md:text-xl font-black text-slate-800 mb-2 group-hover:text-blue-700 transition-colors uppercase italic tracking-tighter leading-tight">
                {service.title}
              </h2>
              <p className="text-[13px] md:text-sm text-slate-500 font-medium leading-relaxed">
                {service.description}
              </p>
            </article>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 md:mt-20 p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] bg-slate-900 text-white text-center relative overflow-hidden shadow-2xl" data-aos="zoom-in">
           <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_20%_80%,rgba(37,99,235,0.08),transparent)]"></div>
           <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 text-center md:text-left">
              <div>
                <h3 className="text-xl md:text-2xl font-black tracking-tight italic mb-2 uppercase">Scale Your Enterprise.</h3>
                <p className="text-slate-400 text-[13px] md:text-sm max-w-sm">Connect with our senior Java architects and build your next-gen enterprise backend.</p>
              </div>
              <button className="w-full md:w-auto px-8 py-3.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg flex items-center justify-center gap-2">
                Consult Architects <ArrowRight size={16} />
              </button>
           </div>
        </div>

      </div>
    </main>
  );
};

export default AdvanceJavaServices;
