import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Star, MessageSquare, CheckCircle, Send } from 'lucide-react';
import Swal from 'sweetalert2';
import { base_url } from '../../utils/info';

const FeedbackForm = () => {
    const navigate = useNavigate();
    const [ratings, setRatings] = useState({});
    const [comments, setComments] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const questions = [
        { id: 1, text: "How would you rate the difficulty level of the assessment?" },
        { id: 2, text: "Was the time allocated sufficient for the questions provided?" },
        { id: 3, text: "How relevant were the questions to your syllabus/training?" },
        { id: 4, text: "Rate the performance and stability of the testing interface." },
        { id: 5, text: "Overall, how satisfied are you with the assessment experience?" }
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
            Swal.fire('Incomplete Feedback', 'Please provide a rating for all 5 questions.', 'warning');
            return;
        }

        setSubmitting(true);
        try {
            const token = localStorage.getItem('studentToken');

            // Transform data for backend
            const responses = questions.map(q => ({
                questionText: q.text,
                rating: ratings[q.id],
                comment: comments[q.id] || ""
            }));

            const infoRes = await axios.get(`${base_url}/api/student-auth/test-info`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const testId = infoRes.data.id;

            await axios.post(`${base_url}/api/student-auth/submit-feedback`, {
                testId,
                responses
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            Swal.fire({
                title: 'Thank You!',
                text: 'Your feedback has been recorded.',
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
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[2.5rem] shadow-xl border border-slate-200 overflow-hidden relative"
                >
                    <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

                    <div className="p-8 md:p-12 text-center border-b border-slate-100">
                        <div className="w-20 h-20 bg-green-50 text-green-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-100">
                            <CheckCircle size={40} />
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 mb-3 uppercase italic tracking-tighter">Assessment Complete</h1>
                        <p className="text-slate-500 max-w-lg mx-auto font-medium">Your answers have been securely encrypted and stored. Before you leave, help us improve the system with your feedback.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-12">
                        {questions.map((q, index) => (
                            <div key={q.id} className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-100 text-slate-500 font-black flex items-center justify-center text-sm">{index + 1}</span>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-800 mb-4">{q.text}</h3>

                                        {/* Star Rating */}
                                        <div className="flex gap-2 mb-4">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => handleRating(q.id, star)}
                                                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${ratings[q.id] >= star
                                                            ? 'bg-yellow-400 text-white shadow-lg shadow-yellow-200 scale-105'
                                                            : 'bg-slate-50 text-slate-300 hover:bg-slate-100'
                                                        }`}
                                                >
                                                    <Star fill={ratings[q.id] >= star ? "currentColor" : "none"} size={24} />
                                                </button>
                                            ))}
                                        </div>

                                        {/* Optional Comment */}
                                        <div className="relative group">
                                            <MessageSquare className="absolute top-4 left-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                                            <textarea
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-sm font-medium text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-400"
                                                placeholder="Additional comments (optional)..."
                                                rows="2"
                                                value={comments[q.id] || ""}
                                                onChange={(e) => handleComment(q.id, e.target.value)}
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="pt-8 border-t border-slate-100">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10 active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                                {submitting ? 'Submitting Feedback...' : (
                                    <>
                                        Complete Session <Send size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
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
