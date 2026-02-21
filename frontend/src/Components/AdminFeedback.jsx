import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { base_url } from '../utils/info';
import { MessageSquare, Trash2, Search, Filter, Calendar, User, BookOpen, Star, ChevronDown, ChevronUp } from 'lucide-react';
import Swal from 'sweetalert2';

const AdminFeedback = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedIds, setExpandedIds] = useState(new Set());

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const fetchFeedbacks = async () => {
        try {
            const res = await api.get(`/api/admins/admin/feedbacks`);
            setFeedbacks(res);
        } catch (error) {
            console.error('Error fetching feedbacks:', error);
            Swal.fire('Error', 'Failed to fetch feedbacks', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/api/admins/admin/feedbacks/${id}`);
                setFeedbacks(feedbacks.filter(f => f._id !== id));
                Swal.fire('Deleted!', 'Feedback has been deleted.', 'success');
            } catch (error) {
                console.error('Error deleting feedback:', error);
                Swal.fire('Error', 'Failed to delete feedback', 'error');
            }
        }
    };

    const toggleExpand = (id) => {
        const newExpanded = new Set(expandedIds);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedIds(newExpanded);
    };

    const filteredFeedbacks = feedbacks.filter(f =>
        f.studentId?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.studentId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.testId?.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic">Student Feedback</h1>
                    <p className="text-slate-500 text-sm mt-1">Review feedback submitted by students after their tests</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search by student or test..."
                            className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-full md:w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Feedbacks List */}
            <div className="grid gap-4">
                {filteredFeedbacks.length > 0 ? (
                    filteredFeedbacks.map((feedback) => (
                        <motion.div
                            key={feedback._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden"
                        >
                            <div
                                className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer hover:bg-slate-50/50 transition-colors"
                                onClick={() => toggleExpand(feedback._id)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                                        <MessageSquare size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">{feedback.studentId?.fullName || 'Anonymous'}</h3>
                                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                                            <span className="text-xs text-slate-500 flex items-center gap-1">
                                                <User size={12} /> {feedback.studentId?.studentId || 'N/A'}
                                            </span>
                                            <span className="text-xs text-slate-500 flex items-center gap-1">
                                                <BookOpen size={12} /> {feedback.testId?.title || 'Unknown Test'}
                                            </span>
                                            <span className="text-xs text-slate-500 flex items-center gap-1">
                                                <Calendar size={12} /> {new Date(feedback.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 ml-auto md:ml-0">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(feedback._id);
                                        }}
                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                    <div className="text-slate-400">
                                        {expandedIds.has(feedback._id) ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                    </div>
                                </div>
                            </div>

                            <AnimatePresence>
                                {expandedIds.has(feedback._id) && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="border-t border-slate-100 bg-slate-50/30"
                                    >
                                        <div className="p-4 sm:p-6 grid gap-4 sm:gap-6 md:grid-cols-2">
                                            {feedback.responses.map((resp, idx) => (
                                                <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-100">
                                                    <div className="flex justify-between items-start gap-4">
                                                        <p className="font-bold text-slate-800 text-sm">{resp.questionText}</p>
                                                        {resp.rating && (
                                                            <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-2 py-1 rounded-lg">
                                                                <Star size={12} className="fill-current" />
                                                                <span className="text-xs font-black">{resp.rating}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    {resp.comment && (
                                                        <p className="mt-3 text-slate-600 text-sm bg-slate-50 p-3 rounded-xl italic">
                                                            "{resp.comment}"
                                                        </p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))
                ) : (
                    <div className="bg-white p-20 rounded-[3rem] border border-slate-100 text-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <MessageSquare size={40} className="text-slate-300" />
                        </div>
                        <h2 className="text-xl font-black text-slate-900 mb-2">No feedbacks found</h2>
                        <p className="text-slate-400">Feedback from students will appear here after they submit it.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminFeedback;
