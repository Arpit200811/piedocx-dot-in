import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { Trophy, Medal, Crown, User } from 'lucide-react';
import { motion } from 'framer-motion';

const Leaderboard = () => {
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const data = await api.get('/api/student-auth/leaderboard');
                setLeaders(data);
            } catch (err) {
                console.error("Leaderboard fetch failed", err);
            } finally {
                setLoading(false);
            }
        };
        fetchLeaderboard();
    }, []);

    if (loading) return (
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm animate-pulse">
            <div className="h-4 w-32 bg-slate-100 rounded-full mb-6"></div>
            <div className="space-y-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-16 w-full bg-slate-50 rounded-2xl"></div>
                ))}
            </div>
        </div>
    );

    if (leaders.length === 0) return null;

    return (
        <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-100 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-full h-full opacity-0 group-hover:opacity-[0.02] transition-opacity duration-700 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600"></div>
            
            <div className="flex items-center justify-between mb-8 relative z-10">
                <div>
                    <h3 className="text-[10px] font-black text-amber-600 uppercase tracking-[0.3em] mb-2 flex items-center gap-2 italic">
                        <Trophy size={14} /> Competitive Arena
                    </h3>
                    <h2 className="text-2xl font-black text-slate-900 italic uppercase tracking-tighter leading-tight">
                        Top <span className="text-amber-500">Performers</span>
                    </h2>
                </div>
                <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl">
                    <Crown size={24} />
                </div>
            </div>

            <div className="space-y-3 relative z-10">
                {leaders.map((student, index) => (
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        key={student.id} 
                        className={`flex items-center gap-4 p-4 rounded-3xl transition-all border ${
                            index === 0 ? 'bg-amber-50/50 border-amber-100 shadow-md scale-[1.02]' : 
                            index === 1 ? 'bg-slate-50 border-slate-200' :
                            index === 2 ? 'bg-orange-50/30 border-orange-100' : 'bg-transparent border-transparent hover:bg-slate-50'
                        }`}
                    >
                        <div className="flex items-center justify-center w-8 h-8 shrink-0">
                            {index === 0 ? <Crown size={20} className="text-amber-500" /> : 
                             index === 1 ? <Medal size={20} className="text-slate-400" /> :
                             index === 2 ? <Medal size={20} className="text-orange-400" /> :
                             <span className="text-xs font-black text-slate-300">#{index + 1}</span>}
                        </div>

                        <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl overflow-hidden border shadow-sm shrink-0">
                            {student.photo ? (
                                <img src={student.photo} alt={student.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                    <User size={20} />
                                </div>
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <h4 className="text-xs md:text-sm font-black text-slate-900 uppercase italic tracking-tight truncate leading-none mb-1">
                                {student.name}
                            </h4>
                            <p className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-tighter truncate opacity-70">
                                {student.college || student.branch}
                            </p>
                        </div>

                        <div className="text-right">
                            <p className="text-sm md:text-base font-black text-slate-900 italic tracking-tighter leading-none">{student.score}</p>
                            <p className="text-[8px] font-black text-amber-500 uppercase tracking-widest mt-0.5">PTS</p>
                        </div>
                    </motion.div>
                ))}
            </div>

        </div>
    );
};

export default Leaderboard;
