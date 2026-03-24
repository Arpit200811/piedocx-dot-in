import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, User } from 'lucide-react';
import DashboardHero from './DashboardHero';
import StatsScore from './StatsScore';
import PerformanceJourney from '../PerformanceJourney';
import Leaderboard from './Leaderboard';
import IDCardAsset from './IDCardAsset';

const OverviewTab = ({ student, testInfo, isDownloadingID, downloadIDCard, idCardRef, navigate }) => {
    return (
        <motion.div 
            key="dashboard" 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-10 md:space-y-20 pb-20"
        >
            <div className="flex flex-col lg:flex-row xl:flex-row gap-8 lg:gap-10 items-stretch">
                <div className="flex-1 min-w-0"><DashboardHero student={student} testInfo={testInfo} navigate={navigate} /></div>
                <div className="w-full lg:w-1/3 xl:w-[400px] flex shrink-0"><StatsScore student={student} testInfo={testInfo} /></div>
            </div>

            <div className="space-y-8 md:space-y-10" data-aos="fade-up">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 md:pb-6">
                    <div>
                        <h3 className="text-xl md:text-3xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">Performance <span className="text-blue-600">Trajectory_</span></h3>
                        <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1.5 md:mt-2 italic opacity-60">System Analytics Grid</p>
                    </div>
                </div>
                <div className="overflow-hidden">
                    <PerformanceJourney student={student} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16">
                <div className="lg:col-span-3" data-aos="fade-right">
                    <div className="mb-6 md:mb-8">
                        <h3 className="text-xl md:text-2xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">Node <span className="text-blue-600">Leaderboard_</span></h3>
                        <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1.5 md:mt-2 italic opacity-60">Global Ranking Protocol</p>
                    </div>
                    <Leaderboard currentStudentId={student.studentId} />
                </div>
                <div className="lg:col-span-2 space-y-8 md:space-y-10" data-aos="fade-left">
                    <div className="mb-6 md:mb-8">
                        <h3 className="text-xl md:text-2xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">Security <span className="text-blue-600">Assets_</span></h3>
                        <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1.5 md:mt-2 italic opacity-60">Digital Credentials</p>
                    </div>
                    
                    <div className="bg-slate-900 p-8 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] border border-white/5 shadow-2xl relative overflow-hidden group/card hover:-translate-y-2 transition-transform duration-700">
                        {/* Glassmorphic elements */}
                        <div className="absolute top-0 right-0 w-32 md:w-40 h-32 md:h-40 bg-blue-600/20 rounded-full blur-3xl pointer-events-none group-hover/card:bg-blue-600/30 transition-all duration-1000"></div>
                        <div className="absolute bottom-0 left-0 w-24 md:w-32 h-24 md:h-32 bg-indigo-600/10 rounded-full blur-2xl pointer-events-none"></div>
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/micro-carbon.png')] opacity-[0.05] pointer-events-none"></div>

                        <div className="relative z-10 flex flex-col items-center text-center">
                            <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-tr from-white/10 to-white/5 backdrop-blur-xl text-white rounded-2xl md:rounded-3xl flex items-center justify-center mb-6 md:mb-8 border border-white/10 shadow-xl group-hover/card:scale-110 group-hover/card:rotate-6 transition-all duration-500">
                                <User size={30} className="text-blue-400 md:w-9 md:h-9" />
                            </div>
                            
                            <div className="space-y-1 md:space-y-2 mb-8 md:mb-10">
                                <h4 className="text-xl md:text-2xl font-black text-white uppercase italic tracking-tighter">Gate_Pass</h4>
                                <p className="text-[8px] md:text-[9px] text-blue-400 font-bold uppercase tracking-[0.4em] opacity-80 italic">Verified System Ident</p>
                            </div>

                            <button 
                                onClick={downloadIDCard} 
                                className="w-full h-14 md:h-18 bg-white/5 hover:bg-white text-slate-400 hover:text-slate-900 rounded-[1.5rem] md:rounded-[2rem] transition-all group/btn border border-white/10 hover:border-white shadow-lg flex items-center justify-between px-6 md:px-8"
                            >
                                <span className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] italic">{isDownloadingID ? 'Encrypting...' : 'Fetch ID Card'}</span>
                                <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl bg-white/5 group-hover/btn:bg-slate-900 group-hover/btn:text-white flex items-center justify-center transition-all duration-500">
                                    <Download size={16} className="group-hover/btn:translate-y-0.5 transition-transform md:w-4 md:h-4" />
                                </div>
                            </button>
                            
                            <p className="mt-5 md:mt-6 text-[7px] md:text-[8px] font-black text-white/20 uppercase tracking-[0.5em] italic">Access Level: Student-Core</p>
                        </div>
                    </div>
                </div>
            </div>
            <IDCardAsset ref={idCardRef} student={student} />
        </motion.div>
    );
};

export default OverviewTab;
