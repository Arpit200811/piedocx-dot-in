import React from 'react';
import { motion } from 'framer-motion';
import { Languages } from 'lucide-react';

const QuestionCard = ({ 
    question, 
    index, 
    totalQuestions, 
    answers, 
    language, 
    onLanguageToggle, 
    onAnswerSelect, 
    theme, 
    submitting, 
    timeLeft 
}) => {
    if (!question) return null;

    return (
        <motion.div
            key={index}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`${theme === 'dark' ? 'bg-white/5 border-white/10 glass-dark' : 'bg-white border-slate-100 shadow-xl'} p-6 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] border flex-1 relative overflow-hidden min-h-[400px] md:min-h-[480px] shadow-2xl`}
        >
            {/* Decorative glow inside card */}
            <div className={`absolute -top-20 -right-20 w-80 h-80 ${theme === 'dark' ? 'bg-blue-600/5' : 'bg-blue-600/10'} rounded-full blur-[100px] pointer-events-none`}></div>

            <div className="relative z-10 h-full flex flex-col">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
                    <div className="flex items-center gap-4">
                        <span className="w-12 h-1 bg-blue-600 rounded-full"></span>
                        <span className={`text-xs font-black uppercase tracking-[0.3em] ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>Question {index + 1} of {totalQuestions}</span>
                    </div>

                    <button
                        type="button"
                        onClick={onLanguageToggle}
                        className={`flex items-center gap-2 px-4 py-2 ${theme === 'dark' ? 'bg-white/5 hover:bg-white/10 border-white/10' : 'bg-slate-50 hover:bg-slate-100 border-slate-200'} border rounded-xl transition-all group self-start sm:self-auto`}
                    >
                        <Languages size={14} className="text-blue-400 group-hover:rotate-12 transition-transform" />
                        <span className={`text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                            {language === 'en' ? 'Switch to Hindi' : 'English में देखें'}
                        </span>
                    </button>
                </div>

                <h3 className={`text-lg sm:text-2xl md:text-3xl lg:text-4xl font-black mb-8 lg:mb-16 leading-[1.2] tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    {language === 'hi' && question?.questionTextHindi
                        ? question.questionTextHindi
                        : question?.questionText}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-auto">
                    {question?.options.map((opt, i) => {
                        const isSelected = answers[question._id] === opt;
                        return (
                            <button
                                type="button"
                                key={i}
                                disabled={submitting || timeLeft <= 0}
                                onClick={() => onAnswerSelect(question._id, opt)}
                                className={`group relative text-left p-5 sm:p-6 rounded-[2rem] border-2 transition-all flex items-center gap-5 disabled:opacity-50 disabled:cursor-not-allowed group shadow-sm ${isSelected
                                    ? (theme === 'dark' ? 'border-blue-500 bg-blue-600/20 shadow-[0_0_40px_rgba(37,99,235,0.15)]' : 'border-blue-600 bg-blue-50 shadow-[0_10px_30px_rgba(37,99,235,0.1)]')
                                    : (theme === 'dark' ? 'border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10' : 'border-slate-100 bg-slate-50 hover:border-blue-200 hover:bg-slate-100')
                                    }`}
                            >
                                {isSelected && (
                                    <motion.div layoutId="selection" className={`absolute inset-0 ${theme === 'dark' ? 'bg-blue-600/10' : 'bg-blue-600/5'} rounded-[2rem] pointer-events-none`} />
                                )}
                                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center font-black text-lg transition-all shrink-0 ${isSelected
                                    ? 'bg-blue-600 text-white shadow-lg'
                                    : (theme === 'dark' ? 'bg-white/10 text-slate-600 group-hover:bg-white/20 group-hover:text-white' : 'bg-white text-slate-400 border border-slate-100 group-hover:border-blue-200')
                                    }`}>
                                    {String.fromCharCode(65 + i)}
                                </div>
                                <span className={`font-bold text-base sm:text-lg md:text-xl transition-colors leading-snug flex-1 ${isSelected
                                    ? (theme === 'dark' ? 'text-white' : 'text-blue-700')
                                    : (theme === 'dark' ? 'text-slate-400 group-hover:text-slate-200' : 'text-slate-600 group-hover:text-slate-900')
                                    }`}>
                                    {language === 'hi' && question?.optionsHindi?.[i]
                                        ? question.optionsHindi[i]
                                        : opt}
                                </span>
                                {isSelected && (
                                    <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,1)]"></div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </motion.div>
    );
};

export default QuestionCard;
