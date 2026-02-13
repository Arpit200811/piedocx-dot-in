import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { base_url } from '../utils/info';
import { UploadCloud, UserPlus, FileJson, AlertCircle, CheckCircle2, BadgeCheck, GraduationCap, ShieldCheck, Bell } from 'lucide-react';

// --- Sub-components ---

const TabButton = ({ active, onClick, label, Icon }) => (
  <button 
    onClick={onClick} 
    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-[9px] uppercase tracking-wider transition-all ${
      active 
      ? 'bg-white text-blue-600 shadow-lg shadow-blue-500/10 border border-slate-100' 
      : 'text-slate-400 hover:text-slate-600'
    }`}
  >
    <Icon size={14} /> {label}
  </button>
);

const InputField = ({ label, name, value, onChange, placeholder, icon: Icon, type = 'text', required = true }) => (
  <div className="space-y-1 group">
    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <div className="relative">
      <input 
        name={name} 
        value={value} 
        onChange={onChange} 
        type={type} 
        placeholder={placeholder} 
        className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:bg-white transition-all placeholder:text-slate-300" 
        required={required} 
      />
      {Icon && <Icon className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-200 group-focus-within:text-blue-600 transition-colors" size={16} />}
    </div>
  </div>
);

// --- Main Component ---

const AdminPanel = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('legacy');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  // States
  const [oldStudent, setOldStudent] = useState({ name: '', registration: '', college: '', branch: '', year: '', technology: '', startDate: '', endDate: '' });
  const [newStudent, setNewStudent] = useState({ fullName: '', studentId: '', college: '', branch: '', year: '', mobile: '', email: '' });
  const [bulkData, setBulkData] = useState('');
  const [bulkType, setBulkType] = useState('legacy');

  const handleOldChange = (e) => setOldStudent({ ...oldStudent, [e.target.name]: e.target.value });
  const handleNewChange = (e) => setNewStudent({ ...newStudent, [e.target.name]: e.target.value });

  const handleOldSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setSuccess(null); setError(null);
    try {
      await axios.post(`${base_url}/api/students`, oldStudent);
      setSuccess(`Legacy entry synchronized: ${oldStudent.name}`);
      setOldStudent({ name: '', registration: '', college: '', branch: '', year: '', technology: '', startDate: '', endDate: '' });
    } catch (err) { setError(err.response?.data?.message || 'Failed to sync'); }
    finally { setLoading(false); }
  };

  const handleNewSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setSuccess(null); setError(null);
    try {
      await axios.post(`${base_url}/api/certificate/register`, newStudent);
      setSuccess(`Certificate entry synchronized: ${newStudent.fullName}`);
      setNewStudent({ fullName: '', studentId: '', college: '', branch: '', year: '', mobile: '', email: '' });
    } catch (err) { setError(err.response?.data?.message || 'Failed to sync'); }
    finally { setLoading(false); }
  };

  const handleBulkSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setSuccess(null); setError(null);
    try {
      const jsonStudents = JSON.parse(bulkData);
      const endpoint = bulkType === 'legacy' ? '/api/students/bulk-register' : '/api/certificate/bulk-register';
      const token = localStorage.getItem('adminToken');
      const res = await axios.post(`${base_url}${endpoint}`, { students: jsonStudents }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess(res.data.message);
      setBulkData('');
    } catch (err) { setError(err.message || 'Bulk ingestion failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto space-y-6 font-sans">
      
      {/* Header - Compact */}
      <div className="flex items-center justify-between px-2">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic flex items-center gap-2">
             <UserPlus className="text-blue-600 w-6 h-6" /> Onboarding <span className="text-blue-600">Hub</span>
          </h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 italic leading-none">Database Injection Protocol</p>
        </div>
      </div>

      {/* Tabs - Compact */}
      <div className="flex flex-wrap items-center bg-slate-100 p-1 rounded-2xl w-fit mx-auto shadow-inner gap-1 border border-slate-200">
        <TabButton active={activeTab === 'legacy'} onClick={() => setActiveTab('legacy')} label="Legacy Students" Icon={GraduationCap} />
        <TabButton active={activeTab === 'certificate'} onClick={() => setActiveTab('certificate')} label="New Certificates" Icon={BadgeCheck} />
        <TabButton active={activeTab === 'bulk'} onClick={() => setActiveTab('bulk')} label="Bulk Load" Icon={UploadCloud} />
        <button 
          onClick={() => navigate('/admin-content')}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-black text-[9px] uppercase tracking-wider text-slate-400 hover:text-blue-600 transition-all"
        >
          <Bell size={14} /> Portal Content
        </button>
      </div>

      {/* Notifications - Compact */}
      <div className="max-w-3xl mx-auto">
        {success && <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-2xl flex items-center gap-2 text-emerald-700 text-xs font-bold animate-in fade-in slide-in-from-top-2"><CheckCircle2 size={16} /> {success}</div>}
        {error && <div className="bg-red-50 border border-red-100 p-3 rounded-2xl flex items-center gap-2 text-red-700 text-xs font-bold animate-in fade-in slide-in-from-top-2"><AlertCircle size={16} /> {error}</div>}
      </div>

      {/* Form Container */}
      <div className="bg-white border border-slate-100 rounded-[2rem] shadow-sm p-8 max-w-4xl mx-auto">
        {activeTab === 'legacy' ? (
          <form onSubmit={handleOldSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <InputField label="Student Name" name="name" value={oldStudent.name} onChange={handleOldChange} placeholder="Full Name" icon={UserPlus} />
             <InputField label="Reg ID" name="registration" value={oldStudent.registration} onChange={handleOldChange} placeholder="Registration Code" />
             <InputField label="College" name="college" value={oldStudent.college} onChange={handleOldChange} placeholder="University Name" />
             <InputField label="Branch" name="branch" value={oldStudent.branch} onChange={handleOldChange} placeholder="Department" />
             <InputField label="Year" name="year" value={oldStudent.year} onChange={handleOldChange} placeholder="Batch/Year" />
             <InputField label="Tech Stack" name="technology" value={oldStudent.technology} onChange={handleOldChange} placeholder="e.g. MERN" />
             <InputField label="Starts" name="startDate" value={oldStudent.startDate} onChange={handleOldChange} placeholder="DD-MM-YYYY" />
             <InputField label="Ends" name="endDate" value={oldStudent.endDate} onChange={handleOldChange} placeholder="DD-MM-YYYY" />
             <div className="md:col-span-2 pt-2">
                <button disabled={loading} className="w-full bg-slate-900 text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg active:scale-95">{loading ? 'Syncing...' : 'Inject Legacy Student'}</button>
             </div>
          </form>
        ) : activeTab === 'certificate' ? (
          <form onSubmit={handleNewSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <InputField label="Full Identity" name="fullName" value={newStudent.fullName} onChange={handleNewChange} placeholder="Display Name" icon={BadgeCheck} />
             <InputField label="Certificate ID" name="studentId" value={newStudent.studentId} onChange={handleNewChange} placeholder="Unique ID" />
             <InputField label="Institution" name="college" value={newStudent.college} onChange={handleNewChange} placeholder="College/Uni" />
             <InputField label="Department" name="branch" value={newStudent.branch} onChange={handleNewChange} placeholder="Engineering Branch" />
             <InputField label="Current Year" name="year" value={newStudent.year} onChange={handleNewChange} placeholder="e.g. Final Year" />
             <InputField label="Mobile" name="mobile" value={newStudent.mobile} onChange={handleNewChange} placeholder="+91 XXXX" />
             <InputField label="Email Address" name="email" value={newStudent.email} onChange={handleNewChange} placeholder="Injected Email" type="email" />
             <div className="md:col-span-2 pt-2">
                <button disabled={loading} className="w-full bg-blue-600 text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg active:scale-95">{loading ? 'Syncing...' : 'Inject Certificate Record'}</button>
             </div>
          </form>
        ) : (
          <form onSubmit={handleBulkSubmit} className="space-y-4">
             <div className="flex items-center justify-between pb-2 border-b border-slate-50">
                <div className="flex items-center gap-2">
                   <FileJson size={18} className="text-blue-600" />
                   <h3 className="font-black text-slate-900 text-sm tracking-tighter uppercase italic">JSON Processor</h3>
                </div>
                <select 
                  className="bg-slate-50 border-none rounded-xl px-4 py-2 font-black text-[9px] uppercase tracking-widest text-blue-600 focus:ring-1 focus:ring-blue-500/10 outline-none"
                  value={bulkType}
                  onChange={(e) => setBulkType(e.target.value)}
                >
                   <option value="legacy">Legacy Management</option>
                   <option value="certificate">New Certificates</option>
                </select>
             </div>
             
             <textarea 
               className="w-full h-64 bg-slate-50 border border-slate-100 rounded-2xl p-6 font-mono text-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:bg-white transition-all shadow-inner"
               placeholder={`[{"name": "...", ...}]`}
               value={bulkData}
               onChange={(e) => setBulkData(e.target.value)}
             />

             <button disabled={loading || !bulkData} className="w-full bg-slate-900 text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg active:scale-95">
                <UploadCloud className="inline-block mr-1" size={16} /> {loading ? 'Processing...' : 'Execute Bulk Ingestion'}
              </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
