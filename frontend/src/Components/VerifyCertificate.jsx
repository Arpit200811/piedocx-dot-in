
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { base_url } from '../utils/info';
import { ShieldCheck, ShieldAlert, Award, Loader2, Calendar, User, Printer, Download } from 'lucide-react';
import { motion } from 'framer-motion';

const VerifyCertificate = () => {
    const { id } = useParams();
    const [status, setStatus] = useState('loading'); // loading, valid, invalid, error
    const [data, setData] = useState(null);

    useEffect(() => {
        const verify = async () => {
            try {
                const res = await axios.get(`${base_url}/api/certificate/verify-public/${id}`);
                if (res.data) {
                    setData(res.data);
                    setStatus('valid');
                } else {
                    setStatus('invalid');
                }
            } catch (err) {
                console.error(err);
                if (err.response && err.response.status === 404) {
                    setStatus('invalid');
                } else {
                    setStatus('error');
                }
            }
        };
        if (id) verify();
    }, [id]);

    if (status === 'loading') return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <p className="text-slate-500 font-bold uppercase tracking-widest text-sm animate-pulse">Verifying Cryptographic Signature...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans no-bg-on-print">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white w-full max-w-md rounded-2xl sm:rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200 relative certificate-card"
            >
                {/* Status Banner */}
                <div className={`p-6 sm:p-8 text-center relative overflow-hidden ${status === 'valid' ? 'bg-emerald-500' : 'bg-red-500'}`}>
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] no-print"></div>
                    <div className="relative z-10 flex flex-col items-center gap-3 sm:gap-4">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
                            {status === 'valid' ? <ShieldCheck size={32} className="text-emerald-500 sm:w-10 sm:h-10" /> : <ShieldAlert size={32} className="text-red-500 sm:w-10 sm:h-10" />}
                        </div>
                        <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                            {status === 'valid' ? 'Verified Certificate' : 'Invalid Certificate'}
                        </h1>
                        <p className="text-white/80 text-[10px] sm:text-xs font-medium uppercase tracking-widest">
                            {status === 'valid' ? 'Official Academic Record' : 'Record Not Found or Tampered'}
                        </p>
                    </div>
                </div>

                <div className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
                    {status === 'valid' && data ? (
                        <>
                            {/* Student Details */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                                        <User size={24} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Student Name</p>
                                        <p className="text-lg font-bold text-slate-800">{data.fullName}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                                        <Award size={24} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Course / Distinction</p>
                                        <p className="text-lg font-bold text-slate-800">{data.branch}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                                        <Calendar size={24} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Year of Issue</p>
                                        <p className="text-lg font-bold text-slate-800">{data.year || new Date().getFullYear()}</p>
                                    </div>
                                </div>
                            </div>

                            {/* ID Badge */}
                            <div className="bg-slate-50 p-6 rounded-2xl border border-dashed border-slate-300 text-center">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Certificate ID</p>
                                <p className="text-xl font-mono font-bold text-blue-600 tracking-wider select-all">{data.certificateId || id}</p>
                            </div>
                        </>
                    ) : (
                        <div className="p-4 text-center space-y-6">
                            <p className="text-slate-500 font-medium leading-relaxed">
                                The certificate ID provided <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded">{id}</span> does not match any official records in our database.
                            </p>
                            <div className="bg-amber-50 p-4 rounded-xl text-amber-700 text-[10px] font-black uppercase tracking-widest border border-amber-100">
                                Warning: Potential Typos or Forgery Detected
                            </div>
                        </div>
                    )}

                    {/* Footer Info */}
                    <div className="text-center">
                        <p className="text-[10px] text-slate-400 font-medium italic">
                            Cryptographically verified dynamic asset of Piedocx Private Limited.
                        </p>
                    </div>
                </div>

                {/* Print & Download Action - No Print */}
                <div className="p-8 border-t border-slate-50 bg-slate-50/50 flex flex-col items-center gap-3 no-print">
                    {status === 'valid' && (
                        <>
                            <button 
                                onClick={() => {
                                    const btn = document.querySelector('.no-print-container');
                                    import('html2canvas').then(html2canvas => {
                                        html2canvas.default(document.querySelector('.certificate-card'), {
                                            scale: 3,
                                            useCORS: true,
                                            backgroundColor: '#ffffff'
                                        }).then(canvas => {
                                            const link = document.createElement('a');
                                            link.download = `Certificate_${data.fullName.replace(/\s+/g, '_')}.png`;
                                            link.href = canvas.toDataURL('image/png');
                                            link.click();
                                        });
                                    });
                                }}
                                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 active:scale-95"
                            >
                                <Download size={16} /> Download High-Res Certificate
                            </button>
                            <button 
                                onClick={() => window.print()}
                                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95"
                            >
                                <Printer size={16} /> Print Official Transcript
                            </button>
                        </>
                    )}
                </div>
            </motion.div>

            <style>{`
                @media print {
                    @page { margin: 0; }
                    body { background: white !important; margin: 0; }
                    .no-print { display: none !important; }
                    .no-bg-on-print { background: white !important; padding: 0 !important; height: auto !important; min-height: 0 !important; }
                    .min-h-screen { background: white !important; min-height: 0 !important; padding: 0 !important; }
                    div[class*="bg-white"] { box-shadow: none !important; border: none !important; width: 100% !important; max-width: 100% !important; padding: 20px !important; }
                    .rounded-\[2\.5rem\] { border-radius: 0 !important; border: 1px solid #eee !important; }
                }
            `}</style>
        </div>
    );
};

export default VerifyCertificate;
