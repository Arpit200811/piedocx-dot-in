import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, BookOpen, KeyRound, Check, ChevronRight } from 'lucide-react';

const InstructionScreen = ({ 
    testInfo, 
    studentProfile, 
    agreed, 
    setAgreed, 
    accessKey, 
    setAccessKey, 
    onStart, 
    theme 
}) => {
    return (
        <div className="min-h-screen bg-[#020617] p-4 flex flex-col items-center justify-center animate-in fade-in duration-700 font-sans">
            <div className="max-w-4xl w-full bg-slate-900/40 backdrop-blur-2xl border border-white/10 p-8 md:p-14 rounded-[3rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
                
                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row items-center gap-8 mb-12 border-b border-white/5 pb-10">
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-blue-900/40 border-2 border-white/20">
                            <ShieldAlert size={48} className="text-white animate-pulse" />
                        </div>
                        <div className="text-center md:text-left">
                            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase italic leading-none mb-3">Assessment Briefing</h2>
                            <p className="text-[10px] text-slate-500 font-bold uppercase mt-2 tracking-widest italic">System Guidelines & Integrity Protocols</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
                        {/* English Section */}
                        <div className="space-y-6">
                            <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                <span className="w-6 h-[1px] bg-blue-400"></span> English Instructions
                            </p>
                            <ul className="text-[11px] text-slate-300 space-y-4 list-none font-medium leading-relaxed">
                                <li className="flex gap-3">
                                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 shrink-0"></div>
                                    <span><b>Strict Proctoring:</b> Switching tabs or taking screenshots triggers <b>WARNINGS</b>.</span>
                                </li>
                                <li className="flex gap-3">
                                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 shrink-0"></div>
                                    <span><b>Lockdown:</b> Exam runs in mandatory full-screen mode.</span>
                                </li>
                                <li className="flex gap-3">
                                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 shrink-0"></div>
                                    <span><b>AI Monitoring:</b> Face and environment are actively monitored.</span>
                                </li>
                            </ul>
                        </div>

                        {/* Hindi Section */}
                        <div className="space-y-6 border-t md:border-t-0 md:border-l border-white/5 pt-6 md:pt-0 md:pl-10">
                            <p className="text-[10px] font-black text-orange-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                <span className="w-6 h-[1px] bg-orange-400"></span> हिंदी निर्देश
                            </p>
                            <ul className="text-[12px] text-slate-300 space-y-4 list-none font-semibold leading-relaxed">
                                <li className="flex gap-3">
                                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 shrink-0"></div>
                                    <span><b>टैब स्विच:</b> मना है। 3 वार्निंग के बाद टेस्ट बंद हो जायेगा।</span>
                                </li>
                                <li className="flex gap-3">
                                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 shrink-0"></div>
                                    <span><b>DND मोड:</b> कॉल/मैसेज रोकने के लिए DND ऑन रखें।</span>
                                </li>
                                <li className="flex gap-3">
                                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 shrink-0"></div>
                                    <span><b>ऑटो-सेव:</b> उत्तर हर 15 सेकंड में सुरक्षित किए जाते हैं।</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <form onSubmit={onStart} className="space-y-8 max-w-md mx-auto">
                        {testInfo?.hasAccessKey && (!accessKey || accessKey.length < 4) && (
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2 justify-center">
                                    <KeyRound size={12}/> Secure Access Key
                                </label>
                                <input
                                    type="text"
                                    value={accessKey}
                                    onChange={(e) => setAccessKey(e.target.value)}
                                    placeholder="000000"
                                    className="w-full bg-slate-950 border-2 border-white/5 rounded-[2rem] p-6 text-center text-4xl font-black tracking-[0.5em] text-white focus:outline-none focus:border-blue-500 transition-all uppercase placeholder:opacity-10"
                                    maxLength={6}
                                />
                            </div>
                        )}

                        <div className="bg-white/5 border border-white/10 p-5 rounded-3xl flex items-start gap-4 text-left group cursor-pointer hover:bg-white/10 transition-all" onClick={() => setAgreed(!agreed)}>
                            <div className={`w-6 h-6 rounded-lg border-2 flex-shrink-0 flex items-center justify-center transition-all ${agreed ? 'bg-blue-600 border-blue-600' : 'border-slate-600'}`}>
                                {agreed && <Check size={16} className="text-white" />}
                            </div>
                            <p className="text-[11px] text-slate-300 font-bold leading-relaxed uppercase tracking-widest select-none">
                                I verify that I am the authorized student and I agree to AI-monitored proctoring.
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={!agreed || (testInfo?.hasAccessKey && accessKey.length < 4)}
                            className="w-full bg-white text-black py-7 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.3em] hover:bg-blue-600 hover:text-white transition-all shadow-2xl active:scale-95 disabled:opacity-30 disabled:grayscale flex items-center justify-center gap-3 italic"
                        >
                            Establish Secure Link <ChevronRight size={20} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default InstructionScreen;
