import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Megaphone, X } from 'lucide-react';

const BroadcastMessage = ({ message, onClose }) => {
    return (
        <AnimatePresence mode="wait">
            {message && (
                <motion.div
                    initial={{ height: 0, opacity: 0, y: -20 }}
                    animate={{ height: 'auto', opacity: 1, y: 0 }}
                    exit={{ height: 0, opacity: 0, y: -20 }}
                    className="w-full relative z-[100]"
                >
                    <div className="bg-blue-600 border border-blue-400/50 rounded-2xl p-5 flex items-center gap-6 shadow-[0_10px_40px_rgba(37,99,235,0.3)]">
                        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 animate-bounce">
                            <Megaphone size={20} className="text-white" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-100 mb-1">Message from Admin</h4>
                            <p className="text-base font-bold text-white leading-tight">{message.message}</p>
                        </div>
                        <button type="button" onClick={onClose} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all">
                            <X size={20} className="text-white" />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default BroadcastMessage;
