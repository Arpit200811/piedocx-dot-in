import React from 'react';
import { Briefcase, Code, ExternalLink, Github, Star, Layout, Database, Smartphone } from 'lucide-react';

const projects = [
    {
        title: "E-Commerce Microservices",
        category: "Cloud Architecture",
        description: "A scalable ecommerce platform built with Node.js microservices and RabbitMQ.",
        tags: ["Node.js", "Docker", "MongoDB"],
        icon: Database,
        color: "blue"
    },
    {
        title: "AI Image Synthesizer",
        category: "Machine Learning",
        description: "Generative AI tool that creates vector illustrations from textual prompts.",
        tags: ["Python", "TensorFlow", "React"],
        icon: Star,
        color: "purple"
    },
    {
        title: "FinTech Dashboard",
        category: "Frontend Design",
        description: "Premium glassmorphic dashboard for tracking global cryptocurrency assets.",
        tags: ["Next.js", "Tailwind", "Framer"],
        icon: Layout,
        color: "emerald"
    },
    {
        title: "HealthConnect App",
        category: "Mobile Dev",
        description: "Cross-platform mobile application for real-time patient-doctor consultation.",
        tags: ["React Native", "Firebase", "WebRTC"],
        icon: Smartphone,
        color: "red"
    }
];

const DashboardProject = () => {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
                        Project <span className="text-blue-600">Portfolio</span>
                    </h2>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2 ml-1">
                        Synthesizing Innovation into code
                    </p>
                </div>
                
                <div className="flex bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm">
                    {['All', 'Web', 'Mobile', 'AI'].map((tab) => (
                        <button key={tab} className="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:bg-slate-50 text-slate-400 hover:text-slate-900 first:bg-slate-900 first:text-white first:shadow-lg">
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Project Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
                {projects.map((proj, idx) => (
                    <div key={idx} className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all group relative overflow-hidden">
                        {/* Background Accent */}
                        <div className={`absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[5rem] -mr-8 -mt-8 transition-transform group-hover:scale-110`}></div>
                        
                        <div className="relative z-10 space-y-6">
                            <div className="flex items-start justify-between">
                                <div className={`p-4 bg-white rounded-2xl shadow-xl border border-slate-50 text-blue-600`}>
                                    <proj.icon size={28} />
                                </div>
                                <div className="flex gap-2">
                                    <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-900 hover:text-white transition-all">
                                        <Github size={16} />
                                    </button>
                                    <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-blue-600 hover:text-white transition-all">
                                        <ExternalLink size={16} />
                                    </button>
                                </div>
                            </div>

                            <div>
                                <span className={`text-[10px] font-black text-blue-600 uppercase tracking-widest italic`}>{proj.category}</span>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-1 group-hover:text-blue-600 transition-colors uppercase">{proj.title}</h3>
                                <p className="text-slate-500 text-sm font-medium mt-3 leading-relaxed">
                                    {proj.description}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-2 pt-2">
                                {proj.tags.map(tag => (
                                    <span key={tag} className="px-3 py-1.5 bg-slate-50 text-slate-500 rounded-lg text-[9px] font-black uppercase tracking-wider border border-slate-100">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom Call to Action */}
            <div className="bg-slate-900 rounded-[2.5rem] p-10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] -mr-48 -mt-48 transition-transform group-hover:scale-150 duration-1000"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="text-center md:text-left">
                        <h4 className="text-2xl font-black text-white italic uppercase tracking-tight">Got a Visionary <span className="text-blue-500">Project?</span></h4>
                        <p className="text-slate-400 text-sm mt-2 max-w-sm">
                            Our team of elite developers and architects are ready to bring your most complex digital ideas to life.
                        </p>
                    </div>
                    <button className="px-10 py-5 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-600 hover:text-white transition-all shadow-2xl active:scale-95">
                        Start Collaboration
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DashboardProject;