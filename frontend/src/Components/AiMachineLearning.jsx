import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { 
  Brain, 
  Sparkles, 
  LineChart, 
  MessageSquare, 
  Scan, 
  Workflow,
  ArrowRight
} from "lucide-react";

const AiMachineLearning = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const features = [
    {
      title: "Predictive Analytics",
      desc: "Forecast trends and customer behaviors with high-accuracy regression models.",
      icon: <LineChart className="w-5 h-5" />,
      delay: 0
    },
    {
      title: "NLP Engines",
      desc: "Sentiment analysis and chatbots powered by transformer architectures (BERT/GPT).",
      icon: <MessageSquare className="w-5 h-5" />,
      delay: 50
    },
    {
      title: "Computer Vision",
      desc: "Automated quality control and object detection using advanced CNNs.",
      icon: <Scan className="w-5 h-5" />,
      delay: 100
    },
    {
      title: "Auto-ML Pipelines",
      desc: "Self-optimizing model training workflows that improve over time.",
      icon: <Workflow className="w-5 h-5" />,
      delay: 150
    },
    {
      title: "Generative AI",
      desc: "Creative content generation (text, image, code) using state-of-the-art LLMs.",
      icon: <Sparkles className="w-5 h-5" />,
      delay: 200
    },
    {
      title: "Deep Learning",
      desc: " Solving complex pattern recognition problems with multi-layered neural nets.",
      icon: <Brain className="w-5 h-5" />,
      delay: 250
    }
  ];

  return (
    <main className="bg-white min-h-screen font-sans selection:bg-blue-100 selection:text-blue-600 overflow-x-hidden pt-0">
      
      {/* Compact Hero */}
      <section className="relative pt-14 md:pt-16 lg:pt-20 pb-12 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-50 opacity-50 transform -skew-x-12 origin-top-right"></div>
        
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <div data-aos="fade-right">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 mb-4 text-[10px] font-black uppercase tracking-widest">
              Artificial Intelligence
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-6 tracking-tighter italic">
              Cognitive <br /> <span className="text-blue-600 underline decoration-blue-100 underline-offset-4">Digital Intelligence.</span>
            </h1>
            <p className="text-base text-slate-600 leading-relaxed mb-8 max-w-lg font-medium">
              Transform raw data into actionable foresight. We build adaptive neural networks that learn, predict, and automate complex decisions.
            </p>
            <div className="flex gap-4">
              <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg flex items-center gap-2">
                Start Training <ArrowRight size={16} />
              </button>
              <button className="px-6 py-3 bg-white text-slate-900 border border-slate-200 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all">
                Our Models
              </button>
            </div>
          </div>

          {/* Compact UI Element */}
          <div className="relative scale-90 md:scale-100" data-aos="zoom-in">
             <div className="absolute -inset-4 bg-blue-100 rounded-full blur-3xl opacity-20"></div>
             <div className="relative bg-slate-900 rounded-[2.5rem] p-8 border border-slate-800 shadow-2xl overflow-hidden group max-w-md mx-auto">
                <div className="flex items-center justify-between mb-8">
                   <div className="flex gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                      <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
                      <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                   </div>
                   <p className="text-[10px] font-mono text-slate-500">model_v1.0.weights</p>
                </div>
                
                {/* Neural Network Visualization (Simplified) */}
                <div className="relative h-32 flex items-center justify-between px-4">
                   {/* Layer 1 */}
                   <div className="space-y-2">
                      {[1,2,3].map(i => <div key={i} className="w-3 h-3 bg-white/20 rounded-full animate-pulse"></div>)}
                   </div>
                   {/* Layer 2 */}
                   <div className="space-y-4">
                      {[1,2].map(i => <div key={i} className="w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>)}
                   </div>
                   {/* Layer 3 */}
                   <div className="space-y-2">
                      {[1,2,3].map(i => <div key={i} className="w-3 h-3 bg-white/20 rounded-full animate-pulse delay-75"></div>)}
                   </div>
                   
                   {/* Connecting Lines (CSS only visuals) */}
                   <div className="absolute inset-0 z-[-1] opacity-20 border-t border-b border-blue-500/30 transform scale-y-50"></div>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-3 border border-white/5 font-mono text-[10px] text-blue-300">
                   &gt; Accuracy: 99.8%<br/>
                   &gt; Epochs: 10,000<br/>
                   &gt; Status: Converged
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Tighter Grid */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div 
              key={idx} 
              className="group p-8 rounded-[2rem] bg-slate-50 hover:bg-white border border-transparent hover:border-blue-100 transition-all duration-500 shadow-sm hover:shadow-xl hover:shadow-blue-600/5"
              data-aos="fade-up"
              data-aos-delay={feature.delay}
            >
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-6 shadow-sm group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110 transition-all border border-slate-100 text-blue-600">
                {feature.icon}
              </div>
              <h4 className="text-xl font-black text-slate-800 mb-2 group-hover:text-blue-700 transition-colors uppercase italic tracking-tighter">{feature.title}</h4>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Refined CTA */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto rounded-[3rem] bg-blue-600 p-12 text-center text-white relative shadow-2xl overflow-hidden">
           <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.1),transparent)] pointer-events-none"></div>
           <div className="relative z-10" data-aos="zoom-up">
              <h3 className="text-3xl md:text-4xl font-black mb-6 tracking-tighter italic uppercase">Unlock Hidden Value.</h3>
              <p className="text-blue-100 text-base mb-10 max-w-lg mx-auto font-medium">
                 Let our algorithms find the patterns you're missing. Scale your intelligence today.
              </p>
              <button className="px-10 py-4 bg-white text-blue-600 rounded-2xl font-black text-sm hover:scale-105 transition-all shadow-xl">
                 Audit Your Data
              </button>
           </div>
        </div>
      </section>

    </main>
  );
};

export default AiMachineLearning;
