import { useEffect } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import {
    ShieldCheck,
    Lock,
    Key,
    Eye,
    ShieldAlert,
    Network,
    ArrowRight,
    Fingerprint,
    Activity,
    Zap
} from "lucide-react";

const SecuritySolutions = () => {
    useEffect(() => {
        AOS.init({ duration: 1000, once: true });
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    const features = [
        {
            title: "Penetration Testing",
            desc: "Simulating high-frequency attacks to identify vulnerabilities before malicious nodes do.",
            icon: <Network className="w-5 h-5" />,
            delay: 0
        },
        {
            title: "Identity & Access (IAM)",
            desc: "Multi-layer authentication architectures using OAuth2, OpenID, and biometric DNA.",
            icon: <Fingerprint className="w-5 h-5" />,
            delay: 50
        },
        {
            title: "Encrypted Ecosystems",
            desc: "End-to-end data encryption (AES-256) for rest and transit, ensuring absolute privacy.",
            icon: <Lock className="w-5 h-5" />,
            delay: 100
        },
        {
            title: "Governance & Compliance",
            desc: "Aligning your digital artifacts with SOC2, GDPR, and ISO security standards.",
            icon: <ShieldAlert className="w-5 h-5" />,
            delay: 150
        },
        {
            title: "Zero-Trust Architecture",
            desc: "Building internal logic where every request is verified, regardless of the source node.",
            icon: <ShieldCheck className="w-5 h-5" />,
            delay: 200
        },
        {
            title: "Threat Intelligence",
            desc: "Live monitoring of global threat feeds to proactively harden your enterprise infrastructure.",
            icon: <Eye className="w-5 h-5" />,
            delay: 250
        }
    ];

    return (
        <main className="bg-white min-h-screen font-sans selection:bg-blue-100 selection:text-blue-600 overflow-x-hidden pt-0">

            {/* Compact Hero */}
            <section className="relative pt-14 md:pt-16 lg:pt-20 pb-12 px-6 overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-900/[0.02] transform -skew-x-12 origin-top-right"></div>

                <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
                    <div data-aos="fade-right">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 mb-4 text-[10px] font-black uppercase tracking-widest">
                            Security Node
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-6 tracking-tighter italic">
                            Fortifying Your <br /> <span className="text-blue-600 underline decoration-blue-100 underline-offset-4">Digital DNA.</span>
                        </h1>
                        <p className="text-base text-slate-600 leading-relaxed mb-8 max-w-lg font-medium">
                            We build impenetrable perimeters. Protect your enterprise artifacts with high-fidelity security engineering and zero-defect logic.
                        </p>
                        <div className="flex gap-4">
                            <Link to="/contact" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg flex items-center gap-2">
                                Harden My Node <ArrowRight size={16} />
                            </Link>
                            <Link to="/services" className="px-6 py-3 bg-white text-slate-900 border border-slate-200 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all">
                                The Vault
                            </Link>
                        </div>
                    </div>

                    {/* Security Visual Element */}
                    <div className="relative scale-90 md:scale-100" data-aos="zoom-in">
                        <div className="absolute -inset-4 bg-emerald-100 rounded-full blur-3xl opacity-20"></div>
                        <div className="relative bg-slate-900 rounded-[2.5rem] p-8 border border-slate-800 shadow-2xl overflow-hidden group max-w-md mx-auto">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                                    <div className="w-2 h-2 rounded-full bg-emerald-400 opacity-50"></div>
                                    <div className="w-2 h-2 rounded-full bg-emerald-400 opacity-20"></div>
                                </div>
                                <p className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest">Status: Fortified</p>
                            </div>

                            <div className="flex flex-col items-center justify-center py-6">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl animate-pulse"></div>
                                    <ShieldCheck className="text-emerald-500 relative z-10" size={80} />
                                </div>
                                <div className="mt-8 grid grid-cols-2 gap-3 w-full">
                                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 w-[98%]"></div>
                                    </div>
                                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 w-[95%]"></div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-800/50 rounded-xl p-3 border border-white/5 font-mono text-[10px] text-emerald-400 mt-6">
                                &gt; intrusion_detection: online<br />
                                &gt; firewall.rules(strict)<br />
                                &gt; threats_neutralized: 1,245
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
                <div className="max-w-5xl mx-auto rounded-[3rem] bg-slate-900 p-12 text-center text-white relative shadow-2xl overflow-hidden">
                    <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,rgba(52,211,153,0.05),transparent)] pointer-events-none"></div>
                    <div className="relative z-10" data-aos="zoom-up">
                        <h3 className="text-3xl md:text-4xl font-black mb-6 tracking-tighter italic uppercase text-emerald-500">Secure Your Logic.</h3>
                        <p className="text-slate-400 text-base mb-10 max-w-lg mx-auto font-medium">
                            Don't wait for a breach. Connect with our security architects for a full node audit today.
                        </p>
                        <Link to="/contact" className="inline-block px-10 py-4 bg-emerald-500 text-white rounded-2xl font-black text-sm hover:scale-105 transition-all shadow-xl shadow-emerald-500/20">
                            Request Node Audit
                        </Link>
                    </div>
                </div>
            </section>

        </main>
    );
};

export default SecuritySolutions;
