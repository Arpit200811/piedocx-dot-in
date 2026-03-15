import React from 'react';
import { motion } from 'framer-motion';
import { Search, PenTool, Code, Rocket, ShieldCheck, HeartPulse } from 'lucide-react';

const steps = [
  {
    icon: <Search className="w-8 h-8" />,
    title: "Discovery",
    desc: "We analyze your business ecosystem to find the perfect technical solution node."
  },
  {
    icon: <PenTool className="w-8 h-8" />,
    title: "Design",
    desc: "Engineering high-fidelity visual interfaces with human-centric logic."
  },
  {
    icon: <Code className="w-8 h-8" />,
    title: "Build",
    desc: "Translating blueprints into robust, scalable, and secure code artifacts."
  },
  {
    icon: <ShieldCheck className="w-8 h-8" />,
    title: "QA & Audit",
    desc: "Rigorous testing protocols to ensure zero-latency and maximum resilience."
  },
  {
    icon: <Rocket className="w-8 h-8" />,
    title: "Deployment",
    desc: "Launching your digital mission into the production stratosphere."
  }
];

const WorkingProcess = () => {
  return (
    <section className="py-24 px-6 bg-slate-50 dark:bg-slate-950 relative overflow-hidden transition-colors duration-500">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-24">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-block px-4 py-1.5 rounded-full bg-blue-600/10 border border-blue-600/20 mb-6"
          >
            <p className="text-blue-600 font-black uppercase tracking-[0.4em] text-[10px]">
              Strategic Roadmap
            </p>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic leading-[0.8] mb-4"
          >
            Our <span className="text-blue-600 relative inline-block">
              Working Flow.
              <span className="absolute bottom-2 left-0 w-full h-3 bg-blue-600/10 -z-10"></span>
            </span>
          </motion.h2>
          <p className="max-w-xl mx-auto text-slate-500 dark:text-slate-400 font-medium italic mt-6">
            A precision-engineered orchestration of discovery, design, and deployment.
          </p>
        </div>

        <div className="relative">
          {/* Connector Line - More visible Gradient */}
          <div className="absolute top-[40px] left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-600/20 to-transparent hidden lg:block"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 lg:gap-8">
            {steps.map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="relative group flex flex-col items-center text-center"
              >
                {/* Icon Node */}
                <div className="relative mb-12">
                   <div className="absolute -inset-4 bg-blue-600/5 rounded-[2.5rem] scale-0 group-hover:scale-110 transition-transform duration-500"></div>
                   <div className={`w-20 h-20 rounded-[2.2rem] bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-white/10 flex items-center justify-center text-slate-900 dark:text-blue-400 shadow-2xl group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-500 z-10 relative`}>
                     {step.icon}
                   </div>
                   
                   {/* Step Number Badge */}
                   <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-900 dark:bg-blue-600 text-white text-[10px] font-black flex items-center justify-center border-2 border-white dark:border-slate-900 z-20 shadow-lg">
                      0{idx + 1}
                   </div>
                </div>
                
                {/* Title and Description */}
                <div className="space-y-4">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter transition-colors group-hover:text-blue-600">
                    {step.title}
                  </h3>
                  <div className="w-8 h-1 bg-blue-600/20 mx-auto rounded-full group-hover:w-12 group-hover:bg-blue-600 transition-all"></div>
                  <p className="text-slate-500 dark:text-slate-400 font-medium text-xs leading-relaxed max-w-[200px] italic">
                    {step.desc}
                  </p>
                </div>

                {/* Vertical Progress Bar for Mobile */}
                <div className="lg:hidden mt-8 w-px h-12 bg-gradient-to-b from-blue-600 to-transparent opacity-20"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkingProcess;
