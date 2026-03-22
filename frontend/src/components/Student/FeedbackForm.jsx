import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { motion } from 'framer-motion';
import { Star, MessageSquare, CheckCircle, Send } from 'lucide-react';
import Swal from 'sweetalert2';

const FeedbackForm = () => {
    const navigate = useNavigate();
    const [ratings, setRatings] = useState({});
    const [comments, setComments] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [testId, setTestId] = useState(null);

    // Bug #6 Fix: Fetch testId once on mount, NOT inside submit handler
    // (test may be deactivated by the time feedback is submitted)
    useEffect(() => {
        api.get('/api/student-auth/test-info')
            .then(data => { if (data?.id) setTestId(data.id); })
            .catch(() => {}); // Non-fatal: feedback still works without testId
    }, []);

    const questions = [
        { id: 1, text: "How hard was the exam for you?" },
        { id: 2, text: "Was the time enough to answer all questions?" },
        { id: 3, text: "Were the questions from your syllabus?" },
        { id: 4, text: "How was the app working during the exam?" },
        { id: 5, text: "Are you happy with the overall exam experience?" }
    ];

    const handleRating = (id, rating) => {
        setRatings(prev => ({ ...prev, [id]: rating }));
    };

    const handleComment = (id, text) => {
        setComments(prev => ({ ...prev, [id]: text }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate
        const answeredAll = questions.every(q => ratings[q.id]);
        if (!answeredAll) {
            Swal.fire('Form Missing', 'Please answer all 5 questions.', 'warning');
            return;
        }

        setSubmitting(true);
        try {
            const responses = questions.map(q => ({
                questionText: q.text,
                rating: ratings[q.id],
                comment: comments[q.id] || ""
            }));

            await api.post('/api/student-auth/submit-feedback', {
                testId: testId || null, // Use pre-fetched testId from mount
                responses
            });

            Swal.fire({
                title: 'Thank You!',
                text: 'Your feedback is saved.',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            }).then(() => {
                navigate('/student-dashboard');
            });
        } catch (err) {
            console.error(err);
            Swal.fire('Error', 'Failed to submit feedback. Taking you to dashboard...', 'error').then(() => navigate('/student-dashboard'));
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-3xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden relative"
                >
                    {/* Background glow effects */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>

                    <div className="p-8 sm:p-12 md:p-16 text-center border-b border-white/10 relative z-10">
                        <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 text-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-green-500/30 ring-4 ring-green-400/20"
                        >
                            <CheckCircle size={48} />
                        </motion.div>
                        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 uppercase italic tracking-tighter drop-shadow-lg">Mission <span className="text-blue-500">Accomplished</span></h1>
                        <p className="text-slate-400 max-w-lg mx-auto font-medium text-sm md:text-base leading-relaxed">Your secure test submission has been logged into the global engine. Help us calibrate the system by providing your feedback.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 sm:p-10 md:p-14 space-y-14 relative z-10">
                        {questions.map((q, index) => (
                            <motion.div 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + (index * 0.1) }}
                                key={q.id} 
                                className="group"
                            >
                                <div className="flex flex-col md:flex-row items-start gap-6">
                                    <span className="flex-shrink-0 w-12 h-12 rounded-2xl bg-white/5 border border-white/10 text-blue-400 font-black flex items-center justify-center text-lg shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-colors">{index + 1}</span>
                                    <div className="flex-1 w-full">
                                        <h3 className="text-xl font-black text-slate-100 mb-6 italic tracking-tight">{q.text}</h3>

                                        {/* Star Rating */}
                                        <div className="flex flex-wrap gap-3 mb-6">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => handleRating(q.id, star)}
                                                    className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${ratings[q.id] >= star
                                                        ? 'bg-amber-400 text-slate-900 shadow-[0_0_30px_rgba(251,191,36,0.5)] scale-110 !rotate-12'
                                                        : 'bg-white/5 text-slate-600 border border-white/10 hover:bg-white/10 hover:text-slate-400'
                                                        }`}
                                                >
                                                    <Star fill={ratings[q.id] >= star ? "currentColor" : "none"} size={24} className={ratings[q.id] >= star ? "drop-shadow-md" : ""} />
                                                </button>
                                            ))}
                                        </div>

                                        {/* Optional Comment */}
                                        <div className="relative group/input mt-4">
                                            <MessageSquare className="absolute top-5 left-5 text-slate-500 group-focus-within/input:text-blue-400 transition-colors" size={20} />
                                            <textarea
                                                className="w-full bg-white/5 border border-white/10 rounded-3xl pl-14 pr-6 py-5 text-sm font-bold text-slate-200 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all placeholder:text-slate-600 placeholder:italic resize-none custom-scrollbar shadow-inner"
                                                placeholder="Add context to your rating (optional)..."
                                                rows="2"
                                                value={comments[q.id] || ""}
                                                onChange={(e) => handleComment(q.id, e.target.value)}
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        <div className="pt-10 border-t border-white/10 mt-8">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={submitting}
                                className="w-full py-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-3xl font-black text-sm uppercase tracking-[0.3em] transition-all shadow-[0_0_40px_rgba(37,99,235,0.4)] hover:shadow-[0_0_60px_rgba(37,99,235,0.6)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-4 group/btn relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out"></div>
                                <span className="relative z-10">{submitting ? 'Transmitting Data...' : 'Finalize & Return Home'}</span>
                                <Send size={20} className="relative z-10 group-hover/btn:translate-x-2 transition-transform duration-300" />
                            </motion.button>
                        </div>
                    </form>
                </motion.div>

                <p className="text-center text-slate-400 text-xs font-bold uppercase tracking-widest mt-8">
                    © 2026 Piedocx Institutional Node
                </p>
            </div>
        </div>
    );
};

export default FeedbackForm;
