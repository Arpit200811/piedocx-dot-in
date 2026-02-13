import { useEffect, useState } from "react";
import axios from "axios";
import { base_url } from "../utils/info";
import SEO from "./SEO";
import AOS from "aos";
import "aos/dist/aos.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  ArrowRight, 
  MessageSquare,
  Globe,
  Clock,
  Video,
  Twitter,
  Linkedin,
  Github,
  Instagram,
  ChevronDown,
  Briefcase
} from "lucide-react";

// Validation Schema using Yup (as it's already in package.json)
const contactSchema = yup.object({
  name: yup.string().required("Full name is required").min(3, "Name must be at least 3 characters"),
  email: yup.string().email("Invalid email address").required("Email is required"),
  subject: yup.string().required("Subject is required"),
  message: yup.string().required("Message cannot be empty").min(10, "Message must be at least 10 characters"),
}).required();

/**
 * Reusable FAQ Item Component
 * Renders an expandable question/answer block with premium styling.
 */
const FAQItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div 
      className={`border-b border-slate-100 last:border-0 transition-all duration-300 ${isOpen ? 'pb-6 pt-6' : 'py-5'}`}
      data-aos="fade-up"
    >
      <button 
        onClick={onClick} 
        className="w-full flex items-center justify-between group text-left"
      >
        <span className={`text-sm md:text-base font-bold text-slate-800 transition-colors ${isOpen ? 'text-blue-600' : 'group-hover:text-blue-600'}`}>
          {question}
        </span>
        <ChevronDown 
          size={18} 
          className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-600' : 'group-hover:text-blue-600'}`} 
        />
      </button>
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-40 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}
      >
        <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-2xl">{answer}</p>
      </div>
    </div>
  );
};

const Contact = () => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(contactSchema)
  });

  const [activeFAQ, setActiveFAQ] = useState(0);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const onSubmit = async (data) => {
    try {
      await axios.post(`${base_url}/api/users/user`, { ...data, source: 'contact' });
      Swal.fire({
        title: 'Transmission Success!',
        text: 'Your message has been received at our engineering hub.',
        icon: 'success',
        confirmButtonColor: '#2563eb',
        background: '#ffffff',
        customClass: {
          popup: 'rounded-[2rem]',
          confirmButton: 'rounded-xl px-8 py-3'
        }
      });
      reset();
    } catch (err) {
      Swal.fire({
        title: 'Transmission Error',
        text: 'The data packets could not be delivered. Please retry.',
        icon: 'error',
        confirmButtonColor: '#2563eb'
      });
    }
  };


  const contactCards = [
    {
      icon: <Phone className="w-5 h-5" />,
      title: "Direct Line",
      lines: ["+91 6307503700", "+91 8114247881"],
      link: "tel:+916307503700",
      delay: 0
    },
    {
      icon: <Mail className="w-5 h-5" />,
      title: "Digital Box",
      lines: ["info@piedocx.com", "hr@piedocx.com"],
      link: "mailto:info@piedocx.com",
      delay: 100
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      title: "Headquarters",
      lines: ["Plot No. 5 Sector New E Aliganj", "Lucknow-226024"],
      link: "https://maps.google.com/?q=Plot No. 5 Sector New E Aliganj, Chandralok Colony Near Purania Chauraha, Lucknow-226024",
      delay: 200
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: "Operations",
      lines: ["Mon - Fri: 10:00 - 19:00", "Sat: 10:00 - 16:00"],
      link: "#",
      delay: 300
    }
  ];

  const faqs = [
    {
      question: "What is your typical engagement model?",
      answer: "We offer flexible models tailored to your needs: Fixed Cost for well-defined scopes, Time & Material for evolving projects, and Dedicated Teams for long-term collaboration."
    },
    {
      question: "Do you sign a Non-Disclosure Agreement (NDA)?",
      answer: "Absolutely. We respect your intellectual property. We sign a mutual NDA before initial discussions to ensure your ideas remain secure and confidential."
    },
    {
      question: "How do you handle post-deployment support?",
      answer: "We provide a standard 3-month warranty period for bug fixes. Beyond that, we offer custom maintenance packages (SLAs) for ongoing updates, security patches, and scaling."
    },
    {
      question: "Can you help migrate our legacy system?",
      answer: "Yes. Our speciality lies in modernization. We audit your existing architecture and propose a phased migration plan to cloud-native technologies with minimal downtime."
    }
  ];

  return (
    <main className="bg-white min-h-screen font-sans overflow-x-hidden selection:bg-blue-100 selection:text-blue-600">
      <SEO 
        title="Contact Piedocx - Start Your Project" 
        description="Get in touch with Piedocx Technologies. Fill out our contact form, call us, or visit our office in Lucknow."
      />
      
      {/* 1. Asymmetrical Command Header (Projects Style) */}
      <section className="relative pt-20 pb-10 md:pb-12 px-6 border-b border-slate-100 bg-slate-50/50 mt-6 overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 mb-4 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em]" data-aos="fade-right">
               Communication Hub
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter italic mb-3 md:mb-4 uppercase" data-aos="fade-up" data-aos-delay="100">
               Establish <span className="text-blue-600 underline decoration-blue-100 decoration-8 underline-offset-8">Link.</span>
            </h1>
            <p className="max-w-2xl text-slate-500 font-medium text-sm md:text-base mb-6 md:mb-8 leading-relaxed" data-aos="fade-up" data-aos-delay="200">
               Connect with our engineering architects. Whether it's a new venture or technical support, our channels are open for data transmission.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4" data-aos="fade-up" data-aos-delay="300">
               <button onClick={() => document.getElementById('schedule')?.scrollIntoView({ behavior: 'smooth' })} className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-2">
                  <Video size={16} /> Schedule Discovery
               </button>
               <div className="flex items-center gap-3 h-12 px-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Support Online</span>
               </div>
            </div>
          </div>
        </div>
        
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-[50%] h-full bg-blue-600/[0.02] -skew-x-12 translate-x-1/2 pointer-events-none"></div>
      </section>

      {/* 2. Contact Grid */}
      <section className="max-w-6xl mx-auto px-6 py-10 border-b border-slate-100">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {contactCards.map((card, idx) => (
            <a 
              href={card.link} 
              key={idx} 
              className="p-8 rounded-[2rem] bg-slate-50 hover:bg-white border border-transparent hover:border-blue-100 transition-all duration-500 group shadow-sm hover:shadow-xl hover:shadow-blue-600/5 cursor-pointer block" 
              data-aos="fade-up" 
              data-aos-delay={card.delay}
            >
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all mb-5">
                {card.icon}
              </div>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 group-hover:text-blue-600 transition-colors">{card.title}</h3>
              <div className="space-y-0.5">
                {card.lines.map((line, i) => (
                   <p key={i} className="text-sm font-bold text-slate-700 leading-relaxed italic">{line}</p>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-1 text-[10px] font-black text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">
                 Connect <ArrowRight size={12} />
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* 3. Global Map & Career Strip */}
      <section className="bg-slate-50/50 py-12 md:py-14 border-b border-slate-100">
         <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Map Interaction */}
            <div data-aos="fade-right">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-500 mb-6 text-[9px] md:text-[10px] font-black uppercase tracking-widest shadow-sm">
                  <Globe size={12} className="text-blue-600" /> Global Presence
               </div>
               <h2 className="text-2xl md:text-4xl font-black italic text-slate-900 tracking-tighter mb-4 md:mb-6 leading-tight">
                  Strategically <br/>Located.
               </h2>
               <p className="text-slate-500 font-medium leading-relaxed mb-8 max-w-md">
                  Our operations center in Lucknow serves as the hub for our global client base. Visit us to experience our innovation lab firsthand.
               </p>
               
               {/* Location Card */}
               <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl max-w-sm hover:border-blue-200 transition-colors group cursor-pointer relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-[4rem] -z-0 transition-transform group-hover:scale-150 duration-700 origin-top-right"></div>
                  <div className="relative z-10 flex items-start gap-4">
                     <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center flex-shrink-0">
                        <MapPin size={24} />
                     </div>
                     <div>
                        <h4 className="font-bold text-slate-900 mb-1">Lucknow HQ</h4>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed mb-3">Plot No. 5 Sector New E Aliganj,<br/> Chandralok Colony, Lucknow-226024</p>
                        <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
                           Get Directions <ArrowRight size={12} />
                        </a>
                     </div>
                  </div>
               </div>
            </div>

            {/* Stylized Map Visual */}
            <div className="relative aspect-[4/3] w-full rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-200 bg-white group" data-aos="fade-left">
               <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3558.747970894065!2d80.9458399761502!3d26.879730561586567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399bfd7916962f9b%3A0x67303f8bf0245a1e!2sAliganj%2C%20Lucknow%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1707567890123!5m2!1sen!2sin" 
                  width="100%" 
                  height="100%" 
                  style={{border:0, filter: 'contrast(1.1)'}} 
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  className="group-hover:scale-105 transition-transform duration-700"
               ></iframe>
               <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/90 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <span className="relative flex h-3 w-3">
                       <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                       <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                     </span>
                     <span className="text-[10px] font-black uppercase text-slate-900 tracking-widest">Live Traffic: Normal</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">SAT: 4 Sats Visible</span>
               </div>
            </div>

         </div>

         {/* Social Strip & Career */}
         <div className="max-w-6xl mx-auto px-6 mt-12 pt-12 border-t border-slate-200">
             <div className="flex flex-col md:flex-row justify-between items-center gap-10 md:gap-8">
               <div className="flex gap-4">
                  {[
                     { icon: <Linkedin size={18} />, bg: "hover:bg-[#0077b5] hover:border-[#0077b5]", url: "https://www.linkedin.com/company/piedocx" },
                     { icon: <Github size={18} />, bg: "hover:bg-[#333] hover:border-[#333]", url: "https://github.com/piedocx" },
                     { icon: <Twitter size={18} />, bg: "hover:bg-[#1da1f2] hover:border-[#1da1f2]", url: "https://twitter.com/piedocx" },
                     { icon: <Instagram size={18} />, bg: "hover:bg-[#e1306c] hover:border-[#e1306c]", url: "https://www.instagram.com/piedocx" }
                  ].map((social, i) => (
                     <a key={i} href={social.url} target="_blank" rel="noopener noreferrer" className={`w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-400 flex items-center justify-center transition-all hover:text-white hover:scale-110 ${social.bg}`}>
                        {social.icon}
                     </a>
                  ))}
               </div>
               
               <Link to="/careers" className="w-full md:w-auto group flex items-center gap-4 px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all justify-center md:justify-start">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-blue-400">
                     <Briefcase size={16} />
                  </div>
                  <div className="text-left">
                     <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Join the Team</p>
                     <p className="text-xs font-bold">Explore Careers <span className="group-hover:translate-x-1 inline-block transition-transform">→</span></p>
                  </div>
               </Link>
            </div>
         </div>
      </section>

      {/* 4. Main Form & FAQ Section */}
      <section className="py-12 md:py-16 px-6 max-w-6xl mx-auto" id="schedule">
         <div className="relative rounded-[2.5rem] md:rounded-[3.5rem] bg-slate-900 p-6 md:p-16 text-white shadow-2xl overflow-hidden group">
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_20%,rgba(37,99,235,0.08),transparent)] pointer-events-none"></div>
            
            <div className="grid lg:grid-cols-12 gap-10 md:gap-16 relative z-10">
                
                {/* Left: Form */}
                <div className="lg:col-span-7 bg-white shadow-2xl rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 text-slate-900 mx-auto w-full max-w-2xl lg:max-w-none" data-aos="zoom-in">
                   <div className="mb-8">
                      <h3 className="text-xl md:text-2xl font-black italic uppercase tracking-tighter mb-2">Configure <span className="text-blue-600">Request.</span></h3>
                      <p className="text-[10px] md:text-sm font-medium text-slate-500">All fields encrypted. Response time: &lt; 2hrs.</p>
                   </div>
                   <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-5">
                      <div className="grid md:grid-cols-2 gap-4 md:gap-5">
                         <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Identity</label>
                            <input 
                               type="text" 
                               {...register("name")}
                               className={`w-full bg-slate-50 border ${errors.name ? 'border-red-500' : 'border-slate-100'} p-3.5 md:p-4 rounded-xl md:rounded-2xl focus:bg-white focus:border-blue-600/20 outline-none transition font-bold text-xs placeholder:text-slate-300`} 
                               placeholder="FULL NAME"
                            />
                            {errors.name && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.name.message}</p>}
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Contact Point</label>
                            <input 
                               type="email" 
                               {...register("email")}
                               className={`w-full bg-slate-50 border ${errors.email ? 'border-red-500' : 'border-slate-100'} p-3.5 md:p-4 rounded-xl md:rounded-2xl focus:bg-white focus:border-blue-600/20 outline-none transition font-bold text-xs placeholder:text-slate-300`} 
                               placeholder="EMAIL ADDRESS"
                            />
                            {errors.email && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.email.message}</p>}
                         </div>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Subject</label>
                         <input 
                            type="text" 
                            {...register("subject")}
                            className={`w-full bg-slate-50 border ${errors.subject ? 'border-red-500' : 'border-slate-100'} p-3.5 md:p-4 rounded-xl md:rounded-2xl focus:bg-white focus:border-blue-600/20 outline-none transition font-bold text-xs placeholder:text-slate-300`} 
                            placeholder="PROJECT / INQUIRY TYPE"
                         />
                         {errors.subject && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.subject.message}</p>}
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Message</label>
                         <textarea 
                            {...register("message")}
                            rows="4" 
                            className={`w-full bg-slate-50 border ${errors.message ? 'border-red-500' : 'border-slate-100'} p-3.5 md:p-4 rounded-xl md:rounded-2xl focus:bg-white focus:border-blue-600/20 outline-none transition font-bold text-xs placeholder:text-slate-300 resize-none`} 
                            placeholder="YOUR REQUIREMENTS..."
                         ></textarea>
                         {errors.message && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.message.message}</p>}
                      </div>
                      <button 
                         type="submit" 
                         disabled={isSubmitting}
                         className="w-full bg-blue-600 text-white font-black py-4 rounded-[2rem] hover:bg-blue-700 transition shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3 uppercase text-[10px] tracking-widest group/btn"
                      >
                         {isSubmitting ? "Processing..." : "Submit Inquiry"} 
                         {!isSubmitting && <Send size={14} className="group-hover/btn:translate-x-1 transition-transform" />}
                      </button>
                   </form>
                </div>

                {/* Right: FAQ & Info */}
                <div className="lg:col-span-5 flex flex-col justify-center" data-aos="fade-left">
                   <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 border border-blue-600/20 text-blue-500 mb-8 text-[9px] font-black uppercase tracking-[0.3em] self-start">
                      Knowledge Base
                   </div>
                   <h2 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter leading-tight mb-8">Common <br/><span className="text-blue-600">Queries.</span></h2>
                   
                   <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-sm">
                      {faqs.map((faq, idx) => (
                         <div key={idx} className="border-b border-white/10 last:border-0">
                            <button 
                               onClick={() => setActiveFAQ(activeFAQ === idx ? null : idx)}
                               className="w-full py-4 text-left flex justify-between items-center group"
                            >
                               <span className={`text-sm font-bold transition-colors ${activeFAQ === idx ? 'text-blue-400' : 'text-slate-300 group-hover:text-white'}`}>
                                  {faq.question}
                               </span>
                               <span className={`text-slate-500 transition-transform duration-300 ${activeFAQ === idx ? 'rotate-180 text-blue-400' : ''}`}>
                                  <ChevronDown size={16} />
                               </span>
                            </button>
                            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${activeFAQ === idx ? 'max-h-32 opacity-100 pb-4' : 'max-h-0 opacity-0'}`}>
                               <p className="text-xs text-slate-400 leading-relaxed font-medium">
                                  {faq.answer}
                               </p>
                            </div>
                         </div>
                      ))}
                   </div>

                   <div className="mt-8 p-6 bg-blue-600 rounded-3xl relative overflow-hidden group cursor-pointer hover:shadow-2xl hover:shadow-blue-600/30 transition-shadow">
                      <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                      <div className="relative z-10">
                         <h4 className="font-black italic uppercase text-lg mb-1">Book a Discovery Call</h4>
                         <p className="text-blue-100 text-xs font-medium mb-4 max-w-[80%]">Skip the queue. Schedule a 15-min architectural consultation directly with our CTO.</p>
                         <div className="inline-flex items-center gap-2 px-4 py-2 bg-white text-blue-700 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">
                            Open Calendar <ArrowRight size={12} />
                         </div>
                      </div>
                   </div>
                </div>

            </div>
         </div>
      </section>

    </main>
  );
};

export default Contact;
