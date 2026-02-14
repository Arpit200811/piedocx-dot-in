import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Laptop, Smartphone, TrendingUp, Palette,
  Globe, Server, Settings, Activity, Layout,
  ArrowRight, Code2, Database, ShieldCheck,
  Cloud, Cpu, Zap, CheckCircle, Box,
  Layers, Search, Rocket, MoveUpRight, Wifi,
  Brain, Link2, ChevronRight, Globe2, LayoutGrid
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from './SEO';
import AOS from 'aos';
import 'aos/dist/aos.css';

const ServicesRow = ({ title, items }) => (
  <div className="py-20 border-b border-blue-50">
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex items-center gap-4 mb-12">
        <div className="w-12 h-1 bg-blue-600 rounded-full"></div>
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase italic tracking-tighter">{title}</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((item, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -10 }}
            className="bg-white rounded-[2.5rem] p-8 border border-blue-50 shadow-sm hover:shadow-2xl hover:shadow-blue-600/5 transition-all group"
          >
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
              {item.icon}
            </div>
            <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter mb-4">{item.title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-6 font-medium">{item.description}</p>
            <div className="flex flex-wrap gap-2 mb-8">
              {item.tech.map((t, i) => (
                <span key={i} className="px-3 py-1 bg-blue-50 text-[10px] font-black text-blue-600 rounded-lg uppercase tracking-widest">{t}</span>
              ))}
            </div>
            <Link to={item.path} className="flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-widest group-hover:gap-4 transition-all">
              Launch Node <MoveUpRight size={14} />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

const Services = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const services = [
    {
      title: "Web Engineering",
      path: "/services/full-stack",
      icon: <Laptop size={28} />,
      color: "from-blue-500 to-indigo-600",
      description: "High-performance web ecosystems built with React, Next.js, and Node.js. Scalable, secure, and optimized.",
      tech: ["React", "Next.js", "Node.js", "AWS"],
      features: ["E-commerce", "SaaS Apps", "Corporate"]
    },
    {
      title: "Mobile Architecture",
      path: "/services/android-ios",
      icon: <Smartphone size={28} />,
      color: "from-blue-400 to-cyan-600",
      description: "Cross-platform mastery. Native feel with Flutter and Kotlin for seamless iOS and Android deployment.",
      tech: ["Flutter", "Kotlin", "Swift", "Firebase"],
      features: ["iOS", "Android", "Hybrid"]
    },
    {
      title: "IoT & Intelligence",
      path: "/services/iot",
      icon: <Cpu size={28} />,
      color: "from-indigo-500 to-blue-700",
      description: "Bridging the physical and digital. Real-time smart systems powered by AI and edge computing.",
      tech: ["MQTT", "Python", "Raspberry Pi", "Azure IoT"],
      features: ["Smart Hubs", "ML at Edge", "Real-time"]
    },
    {
      title: "AI & Neural Systems",
      path: "/services/ai-ml",
      icon: <Brain size={28} />,
      color: "from-blue-600 to-violet-500",
      description: "Predictive algorithms and generative models that automate business logic and user experiences.",
      tech: ["Python", "TensorFlow", "PyTorch", "OpenAI"],
      features: ["NLP", "Generative AI", "Vision"]
    },
    {
      title: "Cloud Infrastructure",
      path: "/services/domain-web-hosting",
      icon: <Cloud size={28} />,
      color: "from-cyan-400 to-blue-500",
      description: "Serverless architectures, Kubernetes orchestration, and global CDN deployments for zero-downtime.",
      tech: ["AWS", "Azure", "GCP", "Kubernetes"],
      features: ["Scalability", "Security", "DevOps"]
    },
    {
      title: "Cyber Security",
      path: "/services/security",
      icon: <ShieldCheck size={28} />,
      color: "from-blue-700 to-indigo-900",
      description: "Advanced penetration testing, encryption, and security audits to ensure your digital assets remain impenetrable.",
      tech: ["Metasploit", "Nmap", "Wireshark", "Vault"],
      features: ["Security Audits", "Encryptions", "Hardening"]
    },
    {
      title: "Blockchain & Web3",
      path: "/services/blockchain",
      icon: <Link2 size={28} />,
      color: "from-blue-600 to-indigo-800",
      description: "Developing decentralized trust-less ecosystems, smart contracts, and high-performance DeFi protocols.",
      tech: ["Solidity", "EtherJS", "Rust", "Hyperledger"],
      features: ["Smart Contracts", "Tokenomics", "DApps"]
    },
    {
      title: "Data Engineering",
      path: "/services/data-science",
      icon: <Database size={28} />,
      color: "from-cyan-500 to-blue-800",
      description: "Building resilient data pipelines and real-time processing hubs for massive enterprise datasets.",
      tech: ["Apache Spark", "Kafka", "PostgreSQL", "BigQuery"],
      features: ["ELT/ETL", "Analytics", "Warehousing"]
    },
    {
      title: "Design Systems",
      path: "/services/ui-ux",
      icon: <Palette size={28} />,
      color: "from-blue-400 to-violet-500",
      description: "Crafting scalable UI libraries and intuitive user experiences that maintain brand uniformity across all nodes.",
      tech: ["Figma", "Adobe XD", "Tailwind CSS", "Storybook"],
      features: ["UI/UX", "Branding", "Prototyping"]
    },
    {
      title: "Digital Marketing",
      path: "/services/digital-marketing",
      icon: <TrendingUp size={28} />,
      color: "from-blue-500 to-indigo-600",
      description: "Data-driven marketing strategies to scale your brand reach and optimize conversion funnels.",
      tech: ["SEO", "SEM", "Analytics", "Growth"],
      features: ["SEO", "Ads", "Content Strategy"]
    },
    {
      title: "Custom Software",
      path: "/services/custom-software",
      icon: <Settings size={28} />,
      color: "from-slate-700 to-slate-900",
      description: "Developing bespoke software solutions tailored to your specific enterprise operational workflows.",
      tech: ["Java", "Python", "Go", "Azure"],
      features: ["Enterprise", "B2B", "Scale"]
    },
    {
      title: "ERP Solutions",
      path: "/services/erp-solutions",
      icon: <LayoutGrid size={28} />,
      color: "from-indigo-600 to-blue-800",
      description: "Streamlining complex business processes with integrated resource planning and management modules.",
      tech: ["SAP", "Oracle", "Python", "SQL"],
      features: ["Resource Mgmt", "Odoo", "Custom ERP"]
    }
  ];

  return (
    <main className="bg-white font-sans selection:bg-blue-600 selection:text-white pt-24 overflow-x-hidden">
      <SEO
        title="Our Capabilities | Piedocx Digital Engineering"
        description="Comprehensive software engineering services specializing in Web, Mobile, AI, and Cloud solutions with a Modern Light aesthetic."
      />

      {/* 1. Creative Hero Section */}
      <section className="relative px-6 py-12 md:py-24 overflow-hidden">
        {/* Animated Background Mesh */}
        <div className="absolute top-0 right-0 w-[60%] h-full bg-blue-50/[0.4] rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-indigo-50/[0.3] rounded-full blur-[100px] -z-10 -translate-x-1/4 translate-y-1/4"></div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="w-12 h-[2px] bg-blue-600"></span>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400">Engineering Horizon</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[0.9] mb-8 uppercase italic">
              Digital <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">Velocity.</span>
            </h1>
            <p className="text-base text-slate-500 font-medium leading-relaxed max-w-lg mb-10 border-l-4 border-blue-600 pl-6 bg-blue-50/50 py-4 rounded-r-2xl">
              We architect high-performance digital ecosystems where code precision meeting human-centric design. Experience the future of software engineering.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/contact" className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 hover:scale-105 transition-all shadow-2xl shadow-blue-600/30">
                Start Mission
              </Link>
              <div className="flex items-center gap-3 px-6 py-4 rounded-2xl border border-blue-100 bg-white/50 backdrop-blur-md">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nodes Active</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative w-[500px] h-[500px] mx-auto">
              {/* Outer Orbit */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border border-blue-100 rounded-full"
              >
                <div className="absolute top-0 right-1/4 w-12 h-12 bg-white rounded-2xl shadow-xl border border-blue-50 flex items-center justify-center -rotate-12 translate-x-1/2">
                  <Code2 size={20} className="text-blue-600" />
                </div>
              </motion.div>

              {/* Middle Orbit */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute inset-16 border border-blue-50 rounded-full"
              >
                <div className="absolute bottom-0 left-1/4 w-10 h-10 bg-white rounded-xl shadow-xl border border-blue-50 flex items-center justify-center rotate-12 translate-y-1/2">
                  <Zap size={18} className="text-blue-500" />
                </div>
              </motion.div>

              {/* Central Core */}
              <div className="absolute inset-32 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(37,99,235,0.4)] animate-pulse">
                <div className="text-center group cursor-pointer">
                  <Box size={50} className="text-white mx-auto mb-2 group-hover:rotate-45 transition-transform" />
                  <p className="text-[10px] font-black text-white/80 uppercase tracking-widest leading-tight">Innovation<br />Node</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Unified Capabilities Grid */}
      <ServicesRow title="Our Capabilities" items={services} />

      {/* 3. The Engineering Loop (Discovery -> Plan -> Lab -> Deploy) */}
      <section className="py-24 px-6 md:px-12 bg-blue-50/30 overflow-hidden relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <p className="text-blue-600 font-black uppercase tracking-[0.4em] text-[10px] mb-4">Precision Workflow</p>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 uppercase italic tracking-tighter">The Engineering Loop</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: "01", name: "Inquiry", desc: "Logic discovery & requirement mapping.", icon: <Search size={22} /> },
              { step: "02", name: "Blueprint", desc: "High-fidelity architecture & UI nodes.", icon: <Layers size={22} /> },
              { step: "03", name: "Synthesis", desc: "Modular, high-performance clean code.", icon: <Code2 size={22} /> },
              { step: "04", name: "Deployment", desc: "Scaling for global enterprise reach.", icon: <Rocket size={22} /> }
            ].map((p, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.02 }}
                className="bg-white p-10 rounded-[3rem] border border-white shadow-xl hover:shadow-2xl hover:shadow-blue-600/5 transition-all relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-[4rem] flex items-center justify-center transition-colors group-hover:bg-blue-600">
                  <span className="text-2xl font-black text-blue-600 group-hover:text-white transition-colors">{p.step}</span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-6 font-black group-hover:bg-blue-100 transition-colors">
                  {p.icon}
                </div>
                <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter mb-3">{p.name}</h3>
                <p className="text-slate-500 text-xs font-bold leading-relaxed uppercase tracking-wide italic">{p.desc}</p>
                <div className="mt-8 flex gap-1 items-center overflow-hidden">
                  {[...Array(6)].map((_, idx) => (
                    <div key={idx} className={`h-1 w-4 rounded-full bg-blue-100 ${idx < 3 ? 'bg-blue-600' : ''}`}></div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Statistics & Trust (White/Blue Theme) */}
      <section className="py-20 bg-white px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-around gap-12 border-y border-blue-50 py-16">
          <div className="text-center group">
            <h4 className="text-5xl font-black text-blue-600 mb-2 group-hover:scale-110 transition-transform">98%</h4>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic">System Uptime</p>
          </div>
          <div className="text-center group">
            <h4 className="text-5xl font-black text-blue-600 mb-2 group-hover:scale-110 transition-transform">10M+</h4>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic">API Transactions</p>
          </div>
          <div className="text-center group">
            <h4 className="text-5xl font-black text-blue-600 mb-2 group-hover:scale-110 transition-transform">24/7</h4>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic">Secure Monitoring</p>
          </div>
        </div>
      </section>

      {/* 5. CTA Node */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[4rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-blue-600/40">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-tight mb-8">
              Ready to Initiate <br className="hidden md:block" /> Your Project Node?
            </h2>
            <p className="text-blue-100 text-base md:text-xl font-medium max-w-2xl mx-auto mb-10 opacity-80 leading-relaxed">
              Unlock the full potential of your business with high-fidelity digital engineering. Let's build something extraordinary.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to="/contact" className="px-12 py-5 bg-white text-blue-600 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl">
                Connect Terminal
              </Link>
              <div className="flex items-center gap-4 text-white/80 font-black text-xs uppercase tracking-widest cursor-pointer group">
                <Globe2 size={24} className="group-hover:rotate-180 transition-transform duration-1000" /> Global Dispatch
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
};

export default Services;
