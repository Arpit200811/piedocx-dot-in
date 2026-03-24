import React from 'react';
import { Target } from 'lucide-react';

const QuestionNavigator = ({ questions, answers, flagged, currentQuestion, onNavigate, theme, submitting, timeLeft }) => {
    return (
        <aside className={`hidden lg:flex flex-col ${theme === 'dark' ? 'bg-white/5 border-white/10 glass-dark' : 'bg-white border-slate-100 shadow-lg'} p-7 rounded-[3rem] border h-[calc(100vh-240px)] sticky top-8`}>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-1">Questions</h3>
                    <p className="text-xs font-bold text-white uppercase italic">Question Map</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400">
                    <Target size={20} />
                </div>
            </div>

            <div className="grid grid-cols-4 gap-3 overflow-y-auto pr-4 custom-scrollbar flex-1 content-start py-2">
                {questions.map((_, i) => {
                    const isAnswered = !!answers[questions[i]._id];
                    const isActive = currentQuestion === i;
                    const isQFlagged = flagged[questions[i]._id];
                    
                    return (
                        <button
                            type="button"
                            key={i}
                            disabled={submitting || timeLeft <= 0}
                            onClick={() => onNavigate(i)}
                            className={`aspect-square rounded-2xl text-[11px] font-black transition-all flex items-center justify-center border-2 ${isActive
                                ? 'bg-blue-600 border-white/30 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] scale-110 z-10'
                                : isQFlagged
                                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-500'
                                    : isAnswered
                                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                        : 'bg-white/5 border-transparent text-slate-600 hover:border-white/20 hover:text-white'
                                }`}
                        >
                            {i + 1}
                        </button>
                    );
                })}
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 space-y-3">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest opacity-40">
                    <span>Answered</span>
                    <span className="text-emerald-400">{Object.keys(answers).length}</span>
                </div>
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest opacity-40">
                    <span>Remaining</span>
                    <span className="text-blue-400">{questions.length - Object.keys(answers).length}</span>
                </div>
            </div>
        </aside>
    );
};

export default QuestionNavigator;
