import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    CheckCircle2, Clock, AlertCircle, 
    Calendar, User, ListTodo, ChevronRight,
    Search, Filter, MoreHorizontal
} from 'lucide-react';
import Swal from 'sweetalert2';

const EmployeeTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, active, completed
    const empData = JSON.parse(localStorage.getItem('employeeData'));

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const data = await api.get(`/api/tasks/${empData.empid}`);
            setTasks(data);
        } catch (err) {
            console.error("Task fetch error", err);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (taskId, status) => {
        try {
            await api.put(`/api/tasks/${taskId}/status`, { status });
            fetchTasks();
            Swal.fire({
                title: 'Status Updated',
                icon: 'success',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2000
            });
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Update Failed' });
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed': return 'text-emerald-500 bg-emerald-50 border-emerald-100';
            case 'active': return 'text-blue-500 bg-blue-50 border-blue-100';
            default: return 'text-slate-400 bg-slate-50 border-slate-100';
        }
    };

    const filteredTasks = tasks.filter(task => {
        if (filter === 'all') return true;
        return task.status?.toLowerCase() === filter;
    });

    return (
        <div className="space-y-8 p-4 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 italic uppercase tracking-tighter">Mission <span className="text-blue-600">Terminal</span></h1>
                    <p className="text-slate-400 text-xs font-black uppercase tracking-widest mt-1">Operational Task Management</p>
                </div>

                <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100">
                    {['all', 'active', 'completed'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                filter === f ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-600'
                            }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-64 bg-white rounded-3xl animate-pulse border border-slate-100"></div>
                    ))}
                </div>
            ) : filteredTasks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredTasks.map((task, index) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            key={task._id}
                            className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all group"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusColor(task.status)}`}>
                                    {task.status || 'Draft'}
                                </span>
                                <button className="text-slate-300 hover:text-slate-900"><MoreHorizontal size={20} /></button>
                            </div>

                            <h3 className="text-lg font-black text-slate-900 uppercase italic tracking-tighter mb-4 leading-tight group-hover:text-blue-600 transition-colors">
                                {task.title}
                            </h3>
                            
                            <p className="text-slate-500 text-xs font-medium leading-relaxed mb-8 line-clamp-3">
                                {task.description}
                            </p>

                            <div className="space-y-4 pt-6 border-t border-slate-50">
                                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-tighter text-slate-400">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={14} className="text-blue-500" />
                                        <span>Deadline: {new Date(task.deadline).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock size={14} className="text-amber-500" />
                                        <span>72h Remaining</span>
                                    </div>
                                </div>

                                {task.status !== 'completed' && (
                                    <button
                                        onClick={() => updateStatus(task._id, 'completed')}
                                        className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                                    >
                                        Mark as Complete <CheckCircle2 size={16} />
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="py-32 bg-white rounded-[4rem] border-2 border-dashed border-slate-100 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-3xl mx-auto flex items-center justify-center mb-6 text-slate-200">
                        <ListTodo size={40} />
                    </div>
                    <p className="text-slate-300 font-black uppercase tracking-[0.4em] italic text-[10px]">No operational missions assigned.</p>
                </div>
            )}
        </div>
    );
};

export default EmployeeTasks;
