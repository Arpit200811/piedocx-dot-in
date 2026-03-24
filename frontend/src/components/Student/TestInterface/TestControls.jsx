import React from 'react';
import { ChevronRight } from 'lucide-react';

const TestControls = ({ 
    theme, 
    submitting, 
    timeLeft, 
    currentQuestion, 
    questions, 
    flagged, 
    onPrev, 
    onNext, 
    onToggleFlag, 
    onSubmit, 
    playSound 
}) => {
    return (
        <div className={`flex flex-col sm:flex-row justify-between items-center p-3 ${theme === 'dark' ? 'bg-white/5 border-white/10 glass-dark' : 'bg-white border-slate-100 shadow-lg'} rounded-[2.5rem] border backdrop-blur-3xl gap-4 shadow-2xl`}>
            <div className="flex gap-4 w-full sm:w-auto">
                <button
                    type="button"
                    disabled={submitting || timeLeft <= 0 || currentQuestion === 0}
                    onClick={() => {
                        playSound('click');
                        onPrev();
                    }}
                    className="px-6 py-5 rounded-2xl text-slate-500 font-black hover:text-white hover:bg-white/5 transition-all disabled:opacity-5 disabled:cursor-not-allowed text-[10px] uppercase tracking-[0.2em] italic"
                >
                    [ Back ]
                </button>
                <button
                    type="button"
                    onClick={() => {
                        playSound('click');
                        onToggleFlag();
                    }}
                    className={`px-6 py-5 rounded-2xl font-black transition-all text-[10px] uppercase tracking-[0.2em] italic ${flagged[questions[currentQuestion]?._id] ? 'bg-amber-500/20 text-amber-500 hover:bg-amber-500/30 border border-amber-500/30' : 'text-slate-500 hover:text-white hover:bg-white/5 border border-transparent'}`}
                >
                    {flagged[questions[currentQuestion]?._id] ? 'Unflag' : 'Flag For Review'}
                </button>
            </div>

            <div className="hidden sm:flex gap-2">
                {Array.from({ length: Math.min(5, questions.length) }).map((_, idx) => (
                    <div key={idx} className={`w-1.5 h-1.5 rounded-full ${idx === currentQuestion % 5 ? 'bg-blue-600 scale-125' : 'bg-white/10'}`}></div>
                ))}
            </div>

            {currentQuestion === questions.length - 1 ? (
                <button
                    type="button"
                    disabled={submitting}
                    onClick={() => onSubmit()}
                    className="w-full sm:w-auto bg-emerald-600 px-12 py-5 rounded-2xl font-black text-xs uppercase italic tracking-[0.2em] shadow-[0_0_40px_rgba(16,185,129,0.3)] hover:bg-emerald-500 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-white flex items-center justify-center gap-3"
                >
                    {submitting ? 'Saving...' : 'Finish Exam'} <ChevronRight size={18} />
                </button>
            ) : (
                <button
                    type="button"
                    disabled={submitting || timeLeft <= 0}
                    onClick={() => onNext()}
                    className="w-full sm:w-auto bg-blue-600 px-12 py-5 rounded-2xl font-black text-xs uppercase italic tracking-[0.2em] shadow-[0_0_40px_rgba(37,99,235,0.3)] hover:bg-blue-500 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center gap-3 text-white"
                >
                    Next Question <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
            )}
        </div>
    );
};

export default TestControls;
