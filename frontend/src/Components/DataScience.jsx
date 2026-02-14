import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import {
    Database,
    BarChart,
    Brain,
    Search,
    Activity,
    DatabaseBackup,
    ArrowRight,
    TrendingUp,
    Cpu,
    Layers
} from "lucide-react";

const DataScience = () => {
    useEffect(() => {
        AOS.init({ duration: 1000, once: true });
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    const features = [
        {
            title: "ML Model Synthesis",
            desc: "Architecting predictive neural networks and regression models tailored to enterprise datasets.",
            icon: <Brain className="w-5 h-5" />,
            delay: 0
        },
        {
            title: "Data Pipelines (ETL)",
            desc: "Robust automated flows to extract, transform, and load massive data streams into warehouse nodes.",
            icon: <DatabaseBackup className="w-5 h-5" />,
            delay: 50
        },
        {
            title: "Big Data Analytics",
            desc: "Extracting high-frequency insights from terabytes of raw data using Apache Spark and Hadoop.",
            icon: <BarChart className="w-5 h-5" />,
            delay: 100
        },
        {
            title: "NLP & Vision",
            desc: "Teaching systems to read, see, and understand logic patterns through advanced computer vision.",
            icon: <Search className="w-5 h-5" />,
            delay: 150
        },
        {
            title: "Real-time Monitoring",
            desc: "Live dashboards that track business health and anomalies with mathematical precision.",
            icon: <Activity className="w-5 h-5" />,
            delay: 200
        },
        {
            title: "Predictive Ops",
            desc: "Forecasting market shifts and equipment maintenance before they impact your core logic.",
            icon: <TrendingUp className="w-5 h-5" />,
            delay: 250
        }
    ];

    return (
        <main className="bg-white min-h-screen font-sans selection:bg-blue-100 selection:text-blue-600 overflow-x-hidden pt-0">

            {/* Compact Hero */}
            <section className="relative pt-14 md:pt-16 lg:pt-20 pb-12 px-6 overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50 opacity-50 transform -skew-x-12 origin-top-right"></div>

                <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
                    <div data-aos="fade-right">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 mb-4 text-[10px] font-black uppercase tracking-widest">
                            intelligence Node
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-6 tracking-tighter italic">
                            Empowering <br /> <span className="text-blue-600 underline decoration-blue-100 underline-offset-4">Data Evidence.</span>
                        </h1>
                        <p className="text-base text-slate-600 leading-relaxed mb-8 max-w-lg font-medium">
                            We translate raw data streams into strategic momentum. Scalable, high-fidelity analytics for the modern enterprise.
                        </p>
                        <div className="flex gap-4">
                            <Link to="/contact" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg flex items-center gap-2">
                                Analyze My Data <ArrowRight size={16} />
                            </Link>
                            <Link to="/services" className="px-6 py-3 bg-white text-slate-900 border border-slate-200 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all">
                                The Lab
                            </Link>
                        </div>
                    </div>

                    {/* Data Visual Element */}
                    <div className="relative scale-90 md:scale-100" data-aos="zoom-in">
                        <div className="absolute -inset-4 bg-blue-100 rounded-full blur-3xl opacity-20"></div>
                        <div className="relative bg-slate-900 rounded-[2.5rem] p-8 border border-slate-800 shadow-2xl overflow-hidden group max-w-md mx-auto">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                                    <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                                    <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                                </div>
                                <p className="text-[10px] font-mono text-slate-500">model_accuracy: 99.4%</p>
                            </div>
                            <div className="space-y-6">
                                <div className="flex items-end gap-2 h-24">
                                    {[40, 70, 45, 90, 60, 80].map((h, i) => (
                                        <div key={i} className="flex-1 bg-blue-500/20 rounded-t-lg relative overflow-hidden">
                                            <motion.div
                                                initial={{ height: 0 }}
                                                animate={{ height: `${h}%` }}
                                                transition={{ duration: 1.5, delay: i * 0.1 }}
                                                className="absolute bottom-0 inset-x-0 bg-blue-500"
                                            ></motion.div>
                                        </div>
                                    ))}
                                </div>
                                <div className="bg-slate-800/50 rounded-xl p-3 border border-white/5 font-mono text-[10px] text-blue-300">
                                    &gt; cluster.compute(active)<br />
                                    &gt; predicting_outcomes...<br />
                                    &gt; insights: identified
                                </div>
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
                    <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.1),transparent)] pointer-events-none"></div>
                    <div className="relative z-10" data-aos="zoom-up">
                        <h3 className="text-3xl md:text-4xl font-black mb-6 tracking-tighter italic uppercase">Unlock Hidden Intelligence.</h3>
                        <p className="text-blue-100 text-base mb-10 max-w-lg mx-auto font-medium">
                            Stop guessing and start predicting. Connect your data to our intelligence lab.
                        </p>
                        <Link to="/contact" className="inline-block px-10 py-4 bg-white text-blue-600 rounded-2xl font-black text-sm hover:scale-105 transition-all shadow-xl">
                            Schedule Data Audit
                        </Link>
                    </div>
                </div>
            </section>

        </main>
    );
};

export default DataScience;
