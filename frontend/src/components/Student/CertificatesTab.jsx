import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Download, Award } from 'lucide-react';
import { CertificatesSkeleton } from './Skeleton';

const CertificatesTab = ({ isCertificatesLoading, student, setShowCertificate }) => {
    return (
        <motion.div key="certificates" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto">
            {isCertificatesLoading ? (
                <CertificatesSkeleton />
            ) : (
                <div className="bg-white p-8 md:p-12 lg:p-16 rounded-[2.5rem] md:rounded-[4rem] border border-slate-100 shadow-2xl flex flex-col md:flex-row items-center gap-10 md:gap-16 relative overflow-hidden text-center md:text-left">
                    <div className="absolute top-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-blue-600/5 rounded-full blur-[80px] md:blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
                    <div className="flex-1 space-y-6 md:space-y-10 relative z-10 w-full">
                        <div className="inline-flex items-center gap-2 md:gap-3 px-5 md:px-6 py-2 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 italic">
                            <ShieldCheck size={16} className="md:w-[18px] md:h-[18px]" />
                            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em]">Official Credentials</span>
                        </div>
                        <h3 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-[1.1] uppercase italic tracking-tighter">
                            Your Digital <br className="hidden sm:block" /><span className="text-blue-600 decoration-blue-100 decoration-4 md:decoration-8 underline underline-offset-[6px] md:underline-offset-[12px]">Certificates.</span>
                        </h3>
                        <p className="text-slate-500 text-xs md:text-base font-medium leading-relaxed max-w-sm mx-auto md:mx-0 opacity-70">Download your verified exam certificates from here securely.</p>
                        <div className="pt-2">
                            {student.testAttempted ? (
                                <button onClick={() => setShowCertificate(true)} className="w-full sm:w-auto px-8 md:px-14 py-4 md:py-6 bg-blue-600 text-white rounded-2xl md:rounded-[2rem] font-black text-[9px] md:text-xs uppercase italic tracking-[0.2em] md:tracking-[0.3em] flex items-center justify-center gap-3 md:gap-4 hover:bg-blue-700 transition-all shadow-2xl hover:scale-105 active:scale-95 shadow-blue-600/20">
                                    View & Download <Download size={18} className="md:w-5 md:h-5" />
                                </button>
                            ) : (
                                <div className="inline-flex px-6 py-4 bg-slate-50 text-slate-400 rounded-2xl text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] border border-slate-100 italic">Status: System Pending</div>
                            )}
                        </div>
                    </div>
                    <div className="w-full sm:w-64 md:w-80 h-40 md:h-64 bg-slate-50 rounded-3xl md:rounded-[3rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-200 gap-4 md:gap-6 shadow-inner relative z-10 hover:border-blue-200 transition-all group overflow-hidden">
                        <Award size={40} className="group-hover:scale-110 transition-transform md:w-20 md:h-20" />
                        <p className="text-[6px] md:text-[8px] font-black uppercase tracking-[0.4em] italic opacity-30">Identity Verification protocol</p>
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default CertificatesTab;
