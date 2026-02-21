import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import {
    Bell, FileText, Plus, Trash2,
    Link as LinkIcon, FileCheck, Video,
    AlertCircle, Info, Star, Save
} from 'lucide-react';
import Swal from 'sweetalert2';

const AdminContentManager = () => {
    const [activeTab, setActiveTab] = useState('bulletins');
    const [bulletins, setBulletins] = useState([]);
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(false);

    // Form States
    const [bulletinForm, setBulletinForm] = useState({ text: '', type: 'info' });
    const [resourceForm, setResourceForm] = useState({ title: '', type: 'PDF', link: '', size: '' });

    useEffect(() => {
        fetchBulletins();
        fetchResources();
    }, []);

    const fetchBulletins = async () => {
        try {
            const res = await api.get(`/api/admins/admin/bulletins`);
            setBulletins(res);
        } catch (err) { console.error(err); }
    };

    const fetchResources = async () => {
        try {
            const res = await api.get(`/api/admins/admin/resources`);
            setResources(res);
        } catch (err) { console.error(err); }
    };

    const handleCreateBulletin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post(`/api/admins/admin/bulletins`, bulletinForm);
            Swal.fire('Success', 'Bulletin published', 'success');
            setBulletinForm({ text: '', type: 'info' });
            fetchBulletins();
        } catch (err) { Swal.fire('Error', 'Failed to publish', 'error'); }
        finally { setLoading(false); }
    };

    const handleCreateResource = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post(`/api/admins/admin/resources`, resourceForm);
            Swal.fire('Success', 'Resource added', 'success');
            setResourceForm({ title: '', type: 'PDF', link: '', size: '' });
            fetchResources();
        } catch (err) { Swal.fire('Error', 'Failed to add resource', 'error'); }
        finally { setLoading(false); }
    };

    const handleDeleteBulletin = async (id) => {
        const confirm = await Swal.fire({
            title: 'Delete?',
            text: 'This will remove the announcement for all students.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444'
        });
        if (!confirm.isConfirmed) return;

        try {
            await api.delete(`/api/admins/admin/bulletins/${id}`);
            fetchBulletins();
        } catch (err) { Swal.fire('Error', 'Delete failed', 'error'); }
    };

    const handleDeleteResource = async (id) => {
        const confirm = await Swal.fire({
            title: 'Delete Resource?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444'
        });
        if (!confirm.isConfirmed) return;

        try {
            await api.delete(`/api/admins/admin/resources/${id}`);
            fetchResources();
        } catch (err) { Swal.fire('Error', 'Delete failed', 'error'); }
    };

    return (
        <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8 font-sans">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase">
                        Content <span className="text-blue-600">Sync Manager</span>
                    </h1>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Manage Bulletins & Study Materials</p>
                </div>

                <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner">
                    <button
                        onClick={() => setActiveTab('bulletins')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'bulletins' ? 'bg-white text-blue-600 shadow-sm border border-slate-100' : 'text-slate-400 font-bold hover:text-slate-600'
                            }`}
                    >
                        <Bell size={14} /> Bulletins
                    </button>
                    <button
                        onClick={() => setActiveTab('resources')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'resources' ? 'bg-white text-blue-600 shadow-sm border border-slate-100' : 'text-slate-400 font-bold hover:text-slate-600'
                            }`}
                    >
                        <FileText size={14} /> Resources
                    </button>
                </div>
            </div>

            <div className="grid lg:grid-cols-5 gap-8">
                {/* Form Section */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm sticky top-8">
                        <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                            {activeTab === 'bulletins' ? <Plus size={16} className="text-blue-600" /> : <Plus size={16} className="text-emerald-600" />}
                            New {activeTab === 'bulletins' ? 'Announcement' : 'Material'}
                        </h3>

                        {activeTab === 'bulletins' ? (
                            <form onSubmit={handleCreateBulletin} className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Message Text</label>
                                    <textarea
                                        required
                                        value={bulletinForm.text}
                                        onChange={(e) => setBulletinForm({ ...bulletinForm, text: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500/10 outline-none h-32 resize-none"
                                        placeholder="Enter the scrolling bulletin message..."
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Alert Type</label>
                                    <select
                                        value={bulletinForm.type}
                                        onChange={(e) => setBulletinForm({ ...bulletinForm, type: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500/10 outline-none"
                                    >
                                        <option value="info">Information (Blue)</option>
                                        <option value="urgent">Urgent (Red)</option>
                                        <option value="promo">Promo (Amber)</option>
                                    </select>
                                </div>
                                <button disabled={loading} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl active:scale-95">
                                    {loading ? 'Publishing...' : 'Broadcast Bulletin'}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleCreateResource} className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Title</label>
                                    <input
                                        required
                                        type="text"
                                        value={resourceForm.title}
                                        onChange={(e) => setResourceForm({ ...resourceForm, title: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs font-bold text-slate-900 outline-none"
                                        placeholder="e.g. MERN Roadmap"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Type</label>
                                        <select
                                            value={resourceForm.type}
                                            onChange={(e) => setResourceForm({ ...resourceForm, type: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs font-bold text-slate-900 outline-none"
                                        >
                                            <option value="PDF">PDF Guide</option>
                                            <option value="Link">External Link</option>
                                            <option value="Video">Video Tutorial</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Size</label>
                                        <input
                                            type="text"
                                            value={resourceForm.size}
                                            onChange={(e) => setResourceForm({ ...resourceForm, size: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs font-bold text-slate-900 outline-none"
                                            placeholder="e.g. 2.4 MB"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Access URL</label>
                                    <input
                                        required
                                        type="text"
                                        value={resourceForm.link}
                                        onChange={(e) => setResourceForm({ ...resourceForm, link: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs font-bold text-slate-900 outline-none"
                                        placeholder="https://..."
                                    />
                                </div>
                                <button disabled={loading} className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl active:scale-95">
                                    {loading ? 'Uploading...' : 'Deploy Resource'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                {/* List Section */}
                <div className="lg:col-span-3 space-y-4">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-2 italic">Active {activeTab} Node</h3>

                    {activeTab === 'bulletins' ? (
                        <div className="space-y-3">
                            {bulletins.length > 0 ? bulletins.map((b) => (
                                <div key={b._id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-start justify-between group animate-in fade-in slide-in-from-right-4 transition-all hover:border-blue-100">
                                    <div className="flex gap-4">
                                        <div className={`mt-1 p-2 rounded-xl border ${b.type === 'urgent' ? 'bg-red-50 text-red-600 border-red-100' : b.type === 'promo' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                                            {b.type === 'urgent' ? <AlertCircle size={14} /> : b.type === 'promo' ? <Star size={14} /> : <Info size={14} />}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-800 leading-relaxed uppercase tracking-tight">{b.text}</p>
                                            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-1 italic">{new Date(b.createdAt).toLocaleDateString()} node</p>
                                        </div>
                                    </div>
                                    <button onClick={() => handleDeleteBulletin(b._id)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            )) : (
                                <div className="py-20 text-center opacity-30">
                                    <Bell size={40} className="mx-auto mb-4" />
                                    <p className="text-xs font-black uppercase tracking-widest underline decoration-2 underline-offset-4">No broadcasts detected</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 gap-4">
                            {resources.length > 0 ? resources.map((r) => (
                                <div key={r._id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between group transition-all hover:border-emerald-100">
                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
                                                {r.type === 'PDF' ? <FileCheck size={16} /> : r.type === 'Video' ? <Video size={16} /> : <LinkIcon size={16} />}
                                            </div>
                                            <button onClick={() => handleDeleteResource(r._id)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                        <h4 className="text-xs font-black text-slate-900 uppercase italic tracking-tighter mb-1 truncate">{r.title}</h4>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{r.size || 'External Link'} • {r.type}</p>
                                    </div>
                                    <div className="mt-6">
                                        <a href={r.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-[9px] font-black text-blue-600 uppercase tracking-widest hover:underline">
                                            Verify Link <LinkIcon size={10} />
                                        </a>
                                    </div>
                                </div>
                            )) : (
                                <div className="sm:col-span-2 py-20 text-center opacity-30">
                                    <FileText size={40} className="mx-auto mb-4" />
                                    <p className="text-xs font-black uppercase tracking-widest underline decoration-2 underline-offset-4">Vault empty</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminContentManager;
