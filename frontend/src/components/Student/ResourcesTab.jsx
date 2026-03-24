import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, ExternalLink } from 'lucide-react';
import { ResourcesSkeleton } from './Skeleton';

const ResourcesTab = ({ isResourcesLoading, studyResources }) => {
    return (
        <motion.div key="resources" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 md:space-y-10 pb-20">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase italic tracking-tighter flex items-center gap-3 md:gap-4 leading-none">
                <span className="w-10 h-10 md:w-12 md:h-12 bg-indigo-600 text-white rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg shrink-0">
                    <FileText size={18} className="md:w-6 md:h-6" />
                </span>
                Library <span className="text-indigo-600">Assets_</span>
            </h2>
            {isResourcesLoading ? (
                <ResourcesSkeleton />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {studyResources.length > 0 ? (
                        studyResources.map((item, i) => (
                            <div key={i} className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] border border-slate-100 shadow-xl hover:-translate-y-2 transition-transform duration-500 flex flex-col group overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-600/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                                <div className="w-12 h-12 md:w-14 md:h-14 bg-slate-50 text-indigo-600 rounded-xl md:rounded-2xl flex items-center justify-center mb-6 border border-slate-100 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 relative z-10 shadow-sm">
                                    <Download size={20} className="md:w-6 md:h-6" />
                                </div>
                                <h4 className="text-base md:text-lg font-black text-slate-900 uppercase italic tracking-tighter mb-2 group-hover:text-indigo-600 transition-colors truncate relative z-10 leading-none">{item.title}</h4>
                                <p className="text-[8px] md:text-[9px] text-slate-400 font-black uppercase tracking-widest mb-8 opacity-60 italic relative z-10 leading-none">Study Notes Archive</p>
                                <a href={item.url} target="_blank" rel="noopener noreferrer" className="mt-auto py-3.5 md:py-4 bg-slate-50 hover:bg-slate-900 text-slate-400 hover:text-white rounded-xl md:rounded-2xl text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 border border-slate-100 relative z-10 shadow-sm">Download Asset <ExternalLink size={14} /></a>
                            </div>
                        ))
                    ) : (
                        <div className="sm:col-span-2 lg:col-span-3 py-16 md:py-24 text-center bg-slate-50/50 rounded-[2.5rem] md:rounded-[3rem] border border-dashed border-slate-200">
                            <p className="text-slate-400 font-black text-[10px] md:text-xs uppercase italic tracking-[0.3em] opacity-40">Zero Assets detected in local node.</p>
                        </div>
                    )}
                </div>
            )}
        </motion.div>
    );
};

export default ResourcesTab;
