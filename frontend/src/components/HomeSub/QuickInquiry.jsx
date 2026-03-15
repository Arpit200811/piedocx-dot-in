import React from 'react';
import { motion } from 'framer-motion';
import { Send, Rocket, Globe } from 'lucide-react';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from 'axios';
import Swal from 'sweetalert2';
import { base_url } from '../../utils/info';

const schema = yup.object({
  name: yup.string().required("Identity required").min(3, "Too short"),
  email: yup.string().email("Invalid channel").required("Email required"),
  message: yup.string().required("Describe your vision").min(10, "Detail too short"),
}).required();

const QuickInquiry = () => {
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
        resolver: yupResolver(schema)
    });

    const onSubmit = async (data) => {
        try {
            await axios.post(`${base_url}/api/users/user`, { ...data, source: 'home_quick_inquiry' });
            Swal.fire({
                title: "Packet Transmitted",
                text: "Your inquiry has been successfully logged into our core matrix.",
                icon: "success",
                confirmButtonColor: "#2563eb",
                background: '#ffffff',
                customClass: { popup: 'rounded-[3rem] border-none shadow-2xl' }
            });
            reset();
        } catch (error) {
            Swal.fire("Transmission Error", "Packet delivery failed. Please re-initiate.", "error");
        }
    };

    return (
        <section className="py-24 px-6 bg-slate-50 dark:bg-dark-mesh transition-colors duration-500 relative overflow-hidden">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 md:gap-24 relative z-10">
                <div className="flex-1 text-center lg:text-left">
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 mb-6 text-[10px] font-black uppercase tracking-widest"
                    >
                        <Globe size={14} /> Mission Control
                    </motion.div>
                    <motion.h2 
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic leading-[0.9] mb-8"
                    >
                        Initiate Your <br/> <span className="text-blue-600">Digital Node.</span>
                    </motion.h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-lg italic leading-relaxed max-w-lg mb-12 border-l-4 border-blue-600 pl-8 mx-auto lg:mx-0">
                        Ready to scale your architectural vision? Send us a quick packet and our architects will reach out to you within 24 operational hours.
                    </p>
                    

                </div>

                <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    className="flex-1 w-full bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[3.5rem] border border-slate-200 dark:border-white/10 shadow-2xl relative"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-3xl pointer-events-none"></div>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2 text-left">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4 italic">Node Identity</label>
                            <input 
                                {...register("name")}
                                placeholder="Your Name" 
                                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-transparent dark:border-white/5 p-5 rounded-3xl focus:border-blue-600/30 dark:focus:border-blue-600/50 outline-none transition-all font-bold text-sm text-slate-900 dark:text-white"
                            />
                            {errors.name && <p className="text-[9px] font-black text-red-500 ml-5">{errors.name.message}</p>}
                        </div>

                        <div className="space-y-2 text-left">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4 italic">Signal Channel</label>
                            <input 
                                {...register("email")}
                                type="email"
                                placeholder="email@mission.com" 
                                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-transparent dark:border-white/5 p-5 rounded-3xl focus:border-blue-600/30 dark:focus:border-blue-600/50 outline-none transition-all font-bold text-sm text-slate-900 dark:text-white"
                            />
                            {errors.email && <p className="text-[9px] font-black text-red-500 ml-5">{errors.email.message}</p>}
                        </div>

                        <div className="space-y-2 text-left">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4 italic">Mission Payload</label>
                            <textarea 
                                {...register("message")}
                                placeholder="Describe your breakthrough concept..." 
                                rows="3"
                                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-transparent dark:border-white/5 p-5 rounded-3xl focus:border-blue-600/30 dark:focus:border-blue-600/50 outline-none transition-all font-bold text-sm text-slate-900 dark:text-white resize-none"
                            ></textarea>
                            {errors.message && <p className="text-[9px] font-black text-red-500 ml-5">{errors.message.message}</p>}
                        </div>

                        <button 
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-6 bg-blue-600 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.4em] hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-4 active:scale-95 disabled:bg-slate-600"
                        >
                            {isSubmitting ? "Transmitting Signal..." : "Push Dispatch"}
                            <Rocket size={18} />
                        </button>
                    </form>
                </motion.div>
            </div>
        </section>
    );
};

export default QuickInquiry;
