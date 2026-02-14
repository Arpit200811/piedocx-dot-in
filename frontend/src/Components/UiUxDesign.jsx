import { useEffect } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import {
    Palette,
    MousePointer2,
    Layout,
    Smartphone,
    Layers,
    PenTool,
    ArrowRight,
    Shapes,
    Figma,
    Zap
} from "lucide-react";

const UiUxDesign = () => {
    useEffect(() => {
        AOS.init({ duration: 1000, once: true });
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    const features = [
        {
            title: "UI Systems",
            desc: "Developing atomic design systems that ensure absolute consistency across all digital touchpoints.",
            icon: <Layers className="w-5 h-5" />,
            delay: 0
        },
        {
            title: "User Experience (UX)",
            desc: "Mapping psychological user journeys to minimize friction and maximize conversion artifacts.",
            icon: <MousePointer2 className="w-5 h-5" />,
            delay: 50
        },
        {
            title: "Interactive Prototypes",
            desc: "High-fidelity clickable blueprints that breathe life into logic before a single line of code.",
            icon: <Layout className="w-5 h-5" />,
            delay: 100
        },
        {
            title: "Mobile First Design",
            desc: "Responsive architectures that prioritize ergonomic fluidity for the portable digital landscape.",
            icon: <Smartphone className="w-5 h-5" />,
            delay: 150
        },
        {
            title: "Visual Branding",
            desc: "Crafting modern, vibrant aesthetics that align your brand with the elite engineering lab feel.",
            icon: <Palette className="w-5 h-5" />,
            delay: 200
        },
        {
            title: "Motion & Kinetics",
            desc: "Cinematic transitions and micro-animations that make interfaces feel alive and responsive.",
            icon: <Zap className="w-5 h-5" />,
            delay: 250
        }
    ];

    return (
        <main className="bg-white min-h-screen font-sans selection:bg-blue-100 selection:text-blue-600 overflow-x-hidden pt-0">

            {/* Compact Hero */}
            <section className="relative pt-14 md:pt-16 lg:pt-20 pb-12 px-6 overflow-hidden">
                <div className="absolute top-0 left-0 w-1/3 h-full bg-slate-50 opacity-50 transform skew-x-12 origin-top-left"></div>

                <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
                    <div data-aos="fade-right">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 mb-4 text-[10px] font-black uppercase tracking-widest">
                            Design Bureau
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-6 tracking-tighter italic">
                            Bespoke Digital <br /> <span className="text-blue-600 underline decoration-blue-100 underline-offset-4">Experiences.</span>
                        </h1>
                        <p className="text-base text-slate-600 leading-relaxed mb-8 max-w-lg font-medium">
                            We bridge the gap between abstract requirements and cinematic visual artifacts. Engineering with a designer's soul.
                        </p>
                        <div className="flex gap-4">
                            <Link to="/contact" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg flex items-center gap-2">
                                Start Design <ArrowRight size={16} />
                            </Link>
                            <Link to="/services" className="px-6 py-3 bg-white text-slate-900 border border-slate-200 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all">
                                The Portfolio
                            </Link>
                        </div>
                    </div>

                    {/* Design Visual Element */}
                    <div className="relative scale-90 md:scale-100" data-aos="zoom-in">
                        <div className="absolute -inset-4 bg-violet-100 rounded-full blur-3xl opacity-20"></div>
                        <div className="relative bg-white rounded-[3rem] p-8 border border-slate-200 shadow-2xl overflow-hidden group max-w-md mx-auto">
                            <div className="flex items-center gap-2 mb-8">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white shadow-lg">
                                    <Shapes size={20} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase text-slate-900">Atomic System v4</p>
                                    <p className="text-[8px] font-bold text-slate-400">Design Tokens: Active</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-4 gap-3 mb-8">
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                                    <div key={i} className={`h-8 rounded-lg ${i % 3 === 0 ? 'bg-blue-600 shadow-lg shadow-blue-200' : 'bg-slate-100'}`}></div>
                                ))}
                            </div>

                            <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3].map(i => <div key={i} className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white"></div>)}
                                </div>
                                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest italic">Live Prototyping</p>
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
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.1),transparent)] pointer-events-none"></div>
                    <div className="relative z-10" data-aos="zoom-up">
                        <h3 className="text-3xl md:text-4xl font-black mb-6 tracking-tighter italic uppercase">Transform Your Interface.</h3>
                        <p className="text-blue-100 text-base mb-10 max-w-lg mx-auto font-medium">
                            Experience high-fidelity design that scales with your ambition. Let's blueprint your vision.
                        </p>
                        <Link to="/contact" className="inline-block px-10 py-4 bg-white text-blue-600 rounded-2xl font-black text-sm hover:scale-105 transition-all shadow-xl">
                            Book Design Session
                        </Link>
                    </div>
                </div>
            </section>

        </main>
    );
};

export default UiUxDesign;
