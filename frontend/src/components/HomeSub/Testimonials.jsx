import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight, User } from 'lucide-react';

const testimonials = [
  {
    name: "Dr. Vikram Seth",
    company: "Seth Medical Group",
    text: "Piedocx transformed our patient management system into a high-performance ecosystem. Their engineering precision is unmatched.",
    rating: 5,
    img: null
  },
  {
    name: "Rajesh Khanna",
    company: "Khanna EdTech",
    text: "The student dashboard they built for us is a masterpiece of UX. Engagement levels have skyrocketed by 40%.",
    rating: 5,
    img: null
  },
  {
    name: "Anjali Gupta",
    company: "Smart Homes Ltd.",
    text: "Their cloud architectures are resilient and scale effortlessly. Working with Piedocx has been a strategic game-changer.",
    rating: 5,
    img: null
  }
];

const Testimonials = () => {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((current + 1) % testimonials.length);
  const prev = () => setCurrent((current - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="py-24 px-6 bg-white dark:bg-slate-950 transition-colors duration-500 overflow-hidden relative">
      {/* Decorative Accents */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative z-10">
        <div className="flex-1 text-center lg:text-left">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-blue-600 font-extrabold uppercase tracking-[0.4em] text-[10px] mb-4"
          >
            Social Proof
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic leading-[0.9] mb-8"
          >
            Client <span className="text-blue-600 relative inline-block">
              Voices.
              <span className="absolute bottom-2 left-0 w-full h-3 bg-blue-600/10 -z-10"></span>
            </span>
          </motion.h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-lg leading-relaxed max-w-xl italic border-l-4 border-blue-600 pl-8 mb-10">
            Strategic feedback from industry leaders who have scaled their visions with our architectural lab.
          </p>

          <div className="flex justify-center lg:justify-start gap-4">
             <button onClick={prev} className="p-4 rounded-full border border-slate-200 dark:border-white/10 text-slate-400 hover:bg-blue-600 hover:text-white transition-all group">
                <ChevronLeft size={24} className="group-hover:scale-110 transition-transform" />
             </button>
             <button onClick={next} className="p-4 rounded-full border border-slate-200 dark:border-white/10 text-slate-400 hover:bg-blue-600 hover:text-white transition-all group">
                <ChevronRight size={24} className="group-hover:scale-110 transition-transform" />
             </button>
          </div>
        </div>

        <div className="flex-1 w-full relative">
           <AnimatePresence mode="wait">
              <motion.div 
                key={current}
                initial={{ opacity: 0, scale: 0.9, x: 50 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 1.1, x: -50 }}
                transition={{ duration: 0.5, ease: "circOut" }}
                className="bg-slate-50 dark:bg-slate-900 p-10 md:p-16 rounded-[4rem] border border-slate-200 dark:border-white/10 shadow-2xl relative"
              >
                 <div className="absolute top-8 right-12 text-blue-600 opacity-10">
                    <Quote size={80} />
                 </div>
                 
                 <div className="flex gap-1 mb-8">
                    {[...Array(testimonials[current].rating)].map((_, i) => (
                      <Star key={i} size={16} fill="#2563eb" className="text-blue-600" />
                    ))}
                 </div>

                 <p className="text-xl md:text-2xl font-black text-slate-900 dark:text-white italic tracking-tight leading-relaxed mb-10">
                   "{testimonials[current].text}"
                 </p>

                 <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-200 shadow-lg">
                       <User size={32} />
                    </div>
                    <div>
                       <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">{testimonials[current].name}</h4>
                       <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{testimonials[current].company}</p>
                    </div>
                 </div>
              </motion.div>
           </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
