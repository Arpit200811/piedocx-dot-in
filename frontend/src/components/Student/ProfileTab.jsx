import React from 'react';
import { motion } from 'framer-motion';
import { User, Camera, ChevronRight } from 'lucide-react';

const ProfileTab = ({ 
    student, 
    isEditingProfile, 
    setIsEditingProfile, 
    editFormData, 
    setEditFormData, 
    handleSaveProfile, 
    isSavingProfile, 
    fileInputRef, 
    handlePhotoUpload,
    testInfo,
    onNavigate
}) => {
    return (
        <motion.div key="profile" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10 pb-20">
            <div className="lg:col-span-3 bg-white rounded-[2.5rem] md:rounded-[4rem] border border-slate-100 shadow-2xl overflow-hidden relative pb-10 md:pb-16 px-6 md:px-12 text-center md:text-left">
                <div className="h-28 md:h-40 bg-blue-600 relative -mx-6 md:-mx-12">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent"></div>
                </div>
                <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-10 -translate-y-12 md:-translate-y-20 relative">
                    <div className="relative group/photo">
                        <div className="w-28 h-28 md:w-48 md:h-48 bg-white p-2 md:p-3 rounded-[2rem] md:rounded-[3.5rem] shadow-2xl z-10 ring-4 ring-slate-50 overflow-hidden"><div className="w-full h-full bg-slate-100 rounded-[1.8rem] md:rounded-[2.8rem] flex items-center justify-center overflow-hidden border-2 border-white">{student.profilePicture ? <img src={student.profilePicture} alt="Profile" className="w-full h-full object-cover" /> : <User size={40} className="text-slate-200 md:w-[60px] md:h-[60px]" />}</div></div>
                        <button onClick={() => fileInputRef.current.click()} className="absolute bottom-1 right-1 md:bottom-2 md:right-2 z-20 w-10 h-10 md:w-14 md:h-14 bg-blue-600 text-white rounded-xl md:rounded-2xl flex items-center justify-center shadow-2xl border-2 md:border-4 border-white hover:scale-110 transition-all"><Camera size={16} className="md:w-[18px] md:h-[18px]" /></button>
                        <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} accept="image/*" className="hidden" />
                    </div>
                    <div className="flex-1 pb-2 md:pb-4 w-full">
                        <div className="flex flex-col md:flex-row justify-between items-center md:items-center gap-4">
                            <h2 className="text-xl sm:text-2xl md:text-4xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">{student.fullName}</h2>
                            {!isEditingProfile && <button onClick={() => setIsEditingProfile(true)} className="px-5 py-2.5 md:px-6 md:py-3 bg-slate-900 text-white rounded-xl text-[8px] md:text-[9px] font-black uppercase tracking-widest italic hover:bg-blue-600 transition-all shadow-lg active:scale-95">Change Profile</button>}
                        </div>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 mt-4 md:mt-5"><span className="px-3 py-1.5 md:px-4 md:py-2 bg-slate-900 text-white rounded-lg md:rounded-xl text-[8px] md:text-[10px] font-black uppercase tracking-widest italic">{student.studentId}</span><span className="px-3 py-1.5 md:px-4 md:py-2 bg-blue-50 text-blue-600 rounded-lg md:rounded-xl text-[8px] md:text-[10px] font-black uppercase tracking-widest italic border border-blue-100">Verified Account</span></div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-10 mt-0 md:mt-6 text-left">
                    {!isEditingProfile ? (
                        <>
                            <div className="space-y-4 md:space-y-6">
                                <div className="p-4 md:p-6 bg-slate-50 rounded-2xl md:rounded-[2rem] border border-slate-100 hover:bg-white hover:shadow-md transition-all group/info"><p className="text-[8px] md:text-[9px] text-slate-400 font-black uppercase tracking-widest italic mb-1 md:mb-2 opacity-60 group-hover/info:text-blue-600">My Email</p><p className="text-[11px] md:text-sm font-black text-slate-900 uppercase italic tracking-tight truncate">{student.email}</p></div>
                                <div className="p-4 md:p-6 bg-slate-50 rounded-2xl md:rounded-[2rem] border border-slate-100 hover:bg-white hover:shadow-md transition-all group/info"><p className="text-[8px] md:text-[9px] text-slate-400 font-black uppercase tracking-widest italic mb-1 md:mb-2 opacity-60 group-hover/info:text-blue-600">My Phone</p><p className="text-[11px] md:text-sm font-black text-slate-900 uppercase italic tracking-tight">{student.mobile || "Not Added"}</p></div>
                            </div>
                            <div className="space-y-4 md:space-y-6">
                                <div className="p-4 md:p-6 bg-slate-50 rounded-2xl md:rounded-[2rem] border border-slate-100 hover:bg-white hover:shadow-md transition-all group/info"><p className="text-[8px] md:text-[9px] text-slate-400 font-black uppercase tracking-widest italic mb-1 md:mb-2 opacity-60 group-hover/info:text-blue-600">My College</p><p className="text-[11px] md:text-sm font-black text-slate-900 uppercase italic tracking-tight leading-tight">{student.college}</p></div>
                                <div className="p-4 md:p-6 bg-slate-50 rounded-2xl md:rounded-[2rem] border border-slate-100 hover:bg-white hover:shadow-md transition-all group/info"><p className="text-[8px] md:text-[9px] text-slate-400 font-black uppercase tracking-widest italic mb-1 md:mb-2 opacity-60 group-hover/info:text-blue-600">Admission Year</p><p className="text-[11px] md:text-sm font-black text-slate-900 uppercase italic tracking-tight">{student.year}</p></div>
                            </div>
                        </>
                    ) : (
                        <div className="md:col-span-2 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2 text-left"><label className="text-[9px] font-black uppercase text-slate-400 mb-2 block">Full Name</label><input type="text" value={editFormData.fullName} onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl font-bold text-sm focus:border-blue-600 outline-none uppercase italic" /></div>
                                <div className="text-left"><label className="text-[9px] font-black uppercase text-slate-400 mb-2 block">Phone Number</label><input type="text" value={editFormData.mobile} onChange={(e) => setEditFormData({ ...editFormData, mobile: e.target.value })} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl font-bold text-sm focus:border-blue-600 outline-none" /></div>
                                <div className="text-left"><label className="text-[9px] font-black uppercase text-slate-400 mb-2 block">Current Year</label><select value={editFormData.year} onChange={(e) => setEditFormData({ ...editFormData, year: e.target.value })} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl font-bold text-sm focus:border-blue-600 outline-none">{['1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduated'].map(y => <option key={y} value={y}>{y}</option>)}</select></div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4"><button onClick={handleSaveProfile} disabled={isSavingProfile} className="flex-1 h-12 md:h-14 bg-blue-600 text-white rounded-2xl font-black text-[9px] md:text-[10px] uppercase tracking-widest shadow-xl shadow-blue-600/20 active:scale-95">{isSavingProfile ? 'Saving...' : 'Update Records'}</button><button onClick={() => setIsEditingProfile(false)} className="px-8 h-12 md:h-14 bg-slate-50 text-slate-400 rounded-2xl font-black text-[9px] md:text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all">Cancel</button></div>
                        </div>
                    )}
                </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
                <div className="bg-slate-900 rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-10 text-white relative overflow-hidden shadow-2xl group/links">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl group-hover/links:scale-150 transition-transform duration-1000"></div>
                    <div className="relative z-10">
                        <h3 className="text-lg md:text-xl font-black italic uppercase tracking-tighter mb-4">Quick <span className="text-blue-500">Links</span></h3>
                        <p className="text-slate-400 text-[11px] md:text-xs font-medium mb-6 md:mb-8 leading-relaxed italic opacity-70">Direct shortcuts to important pages.</p>
                        <div className="space-y-4">
                            {testInfo?.resultsPublished && (
                                <button onClick={() => onNavigate('/student-results')} className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/5 group/btn">
                                    <span className="text-[9px] font-black uppercase tracking-widest group-hover/btn:text-blue-400 transition-colors italic">See My Result</span>
                                    <ChevronRight size={16} className="text-blue-500 group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            )}
                            <button onClick={() => window.open(
                                testInfo?.supportWhatsApp
                                    ? `https://api.whatsapp.com/send?phone=${testInfo.supportWhatsApp}`
                                    : 'https://api.whatsapp.com/send?phone=916386373577',
                                '_blank'
                            )} className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/5 group/btn">
                                <span className="text-[9px] font-black uppercase tracking-widest group-hover/btn:text-blue-400 transition-colors italic">Contact Help</span>
                                <ChevronRight size={16} className="text-blue-500 group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ProfileTab;
