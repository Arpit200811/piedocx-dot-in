import React from 'react';
import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';

const BroadcastBanner = ({ announcements = [] }) => {
    return (
        <div className="bg-blue-600 w-full rounded-2xl md:rounded-[2rem] p-3 md:p-4 mb-6 md:mb-8 overflow-hidden relative border border-blue-500 shadow-xl shadow-blue-600/20">
            <div className="flex items-center gap-3 md:gap-6 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-white italic h-6">
                <span className="bg-white/20 px-2 md:px-3 py-0.5 md:py-1 rounded-full text-white font-black not-italic border border-white/20 flex items-center gap-2 whitespace-nowrap">
                    <Bell size={12} className="animate-bounce" /> <span className="hidden sm:inline">Broadcast</span>
                </span>
                <div className="flex-1 overflow-hidden relative">
                    <motion.div
                        animate={{ x: ["100%", "-100%"] }}
                        transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
                        className="absolute whitespace-nowrap opacity-90 font-bold"
                    >
                        {announcements.length > 0 ? announcements.map(a => a.text).join(" • ") : "Welcome! System is Working • Your Data is Safe • Exams are Open. Please check here for all future news."}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default BroadcastBanner;
