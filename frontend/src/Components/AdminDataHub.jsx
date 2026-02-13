import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { base_url } from '../utils/info';
import { 
  Database, 
  Mail, 
  FileText, // Added missing import
  Search, 
  RefreshCw,
  Clock,
  AlertCircle,
  Trash2,
  Eye,
  X,
  MapPin,
  User as UserIcon,
  Filter as FilterIcon
} from 'lucide-react';
import Swal from 'sweetalert2';

// --- Sub-components ---

const TabButton = ({ tab, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-wider transition-all border ${
      isActive 
      ? 'bg-slate-900 text-white border-slate-900 shadow-lg' 
      : 'bg-white text-slate-400 border-slate-100 hover:border-blue-200 hover:text-slate-600 shadow-sm'
    }`}
  >
    <tab.icon size={14} /> {tab.label}
  </button>
);

const DataRow = ({ item, onView, onDelete, deletingId }) => (
  <tr className="hover:bg-slate-50/50 transition-colors group border-b border-slate-50 last:border-none">
    <td className="px-6 py-4">
       <div className="flex flex-col">
          <span className="text-[10px] font-bold text-slate-900">{new Date(item.createdAt).toLocaleDateString()}</span>
          <span className="text-[8px] font-medium text-slate-400 uppercase tracking-tighter">
            {new Date(item.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </span>
       </div>
    </td>
    <td className="px-6 py-4">
       <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg shrink-0 ${item.source === 'contact' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'} flex items-center justify-center font-black text-[10px] uppercase`}>
             {item.name ? item.name.charAt(0) : 'U'}
          </div>
          <div className="flex flex-col">
             <span className="text-xs font-black text-slate-900 tracking-tight leading-none mb-0.5">{item.name || 'Anonymous Submission'}</span>
             <span className="text-[10px] font-medium text-slate-400">{item.email}</span>
          </div>
       </div>
    </td>
    <td className="px-6 py-4">
       <div className="max-w-xs">
          <p className="text-[11px] text-slate-600 font-medium line-clamp-1 italic">
             "{item.message || (item.source === 'newsletter' ? 'Newsletter Subscription' : 'No message provided')}"
          </p>
          {item.address && <span className="text-[8px] font-bold text-slate-400 mt-0.5 block uppercase">Loc: {item.address}</span>}
       </div>
    </td>
    <td className="px-6 py-4 text-right">
       <div className="flex justify-end gap-1">
          <button 
            onClick={() => onView(item)}
            className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:bg-blue-600 hover:text-white transition-all transform active:scale-95"
            title="View Details"
          >
             <Eye size={14} />
          </button>
          <button 
            disabled={deletingId === item._id}
            onClick={() => onDelete(item._id)}
            className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:bg-red-600 hover:text-white transition-all transform active:scale-95 disabled:opacity-50"
            title="Delete Entry"
          >
             <Trash2 size={14} />
          </button>
       </div>
    </td>
  </tr>
);

// --- Main Component ---

const AdminDataHub = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('contact');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const tabs = [
    { id: 'contact', label: 'Inquiries', icon: FileText },
    { id: 'newsletter', label: 'Newsletter', icon: Mail },
    { id: 'workshop', label: 'Workshops', icon: Database },
  ];

  const fetchData = async (source) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.get(`${base_url}/api/users/all-data?source=${source}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(res.data);
    } catch (err) {
      console.error("Error fetching admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab]);

  const filteredData = useMemo(() => 
    data.filter(item => 
      (item.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (item.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (item.message?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    ),
  [data, searchTerm]);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Action: Permanently PURGE this entry?',
      text: "This action cannot be undone.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, Purge it!'
    });

    if (!result.isConfirmed) return;

    setDeletingId(id);
    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`${base_url}/api/users/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(prev => prev.filter(item => item._id !== id));
      if (selectedItem?._id === id) setSelectedItem(null);
      Swal.fire('Purged!', 'Entry has been permanently deleted.', 'success');
    } catch (err) {
      Swal.fire('Error', 'Purge failed.', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6 relative font-sans">
      
      {/* Header - Compact */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-2">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tighter uppercase italic flex items-center gap-2">
             <Database className="text-blue-600 w-5 h-5 md:w-6 md:h-6" /> Data <span className="text-blue-600">Archives</span>
          </h1>
          <p className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 italic leading-none">Intelligence Hub / Secure Sector</p>
        </div>
        
        <div className="flex items-center gap-2 bg-white p-1 rounded-xl shadow-sm border border-slate-100 w-full sm:w-auto">
           <div className="relative flex-grow sm:flex-grow-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-8 pr-3 py-1.5 bg-slate-50 border-none rounded-lg text-[11px] font-bold text-slate-900 focus:ring-1 focus:ring-blue-500/20 w-full sm:w-48"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           <button onClick={() => fetchData(activeTab)} className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors">
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
           </button>
        </div>
      </div>

      {/* Tabs - Compact */}
      <div className="flex flex-wrap items-center gap-2 md:gap-3 px-2">
        {tabs.map((tab) => (
          <TabButton 
            key={tab.id} 
            tab={tab} 
            isActive={activeTab === tab.id} 
            onClick={() => setActiveTab(tab.id)} 
          />
        ))}
      </div>

      {/* Content Table - High Density */}
      <div className="bg-white border border-slate-100 rounded-[1.5rem] shadow-sm overflow-hidden min-h-[400px]">
        {loading ? (
           <div className="flex flex-col items-center justify-center h-[400px] space-y-2">
              <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 italic">Accessing Archives...</p>
           </div>
        ) : filteredData.length === 0 ? (
           <div className="flex flex-col items-center justify-center h-[400px] space-y-2">
              <AlertCircle className="w-8 h-8 text-slate-200" />
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 italic">Zero frequency detected.</p>
           </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100">
                  <th className="px-6 py-3 text-[9px] font-black uppercase tracking-widest text-slate-400">Captured</th>
                  <th className="px-6 py-3 text-[9px] font-black uppercase tracking-widest text-slate-400">Entity</th>
                  <th className="px-6 py-3 text-[9px] font-black uppercase tracking-widest text-slate-400">Payload</th>
                  <th className="px-6 py-3 text-[9px] font-black uppercase tracking-widest text-slate-400 text-right">Control</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item) => (
                  <DataRow 
                    key={item._id} 
                    item={item} 
                    onView={setSelectedItem} 
                    onDelete={handleDelete} 
                    deletingId={deletingId} 
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal - Reused Component Pattern */}
      {selectedItem && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in">
           <div className="bg-white w-full max-w-xl rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in slide-in-from-bottom-4 duration-300">
              <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                       <Database size={20} />
                    </div>
                    <div>
                       <h3 className="text-lg font-black italic uppercase tracking-tighter leading-none mb-1">Archive <span className="text-blue-600">Report</span></h3>
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">{selectedItem.source} origin hub</p>
                    </div>
                 </div>
                 <button onClick={() => setSelectedItem(null)} className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-slate-900">
                    <X size={16} />
                 </button>
              </div>

              <div className="p-8 space-y-6">
                 <div className="grid grid-cols-2 gap-4">
                    <ModalBlock label="Identity" value={selectedItem.name || 'Anonymous'} icon={UserIcon} />
                    <ModalBlock label="Email" value={selectedItem.email} icon={Mail} />
                    <ModalBlock label="Sync Time" value={new Date(selectedItem.createdAt).toLocaleString()} icon={Clock} />
                    <ModalBlock label="Origin" value={selectedItem.address || 'Network Address'} icon={MapPin} />
                 </div>
                 
                 <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-blue-600">Transmitted Payload</label>
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-[13px] font-medium text-slate-700 italic leading-relaxed">
                       {selectedItem.message || 'Transmission recorded without secondary payload.'}
                    </div>
                 </div>
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
                 <button 
                  onClick={() => handleDelete(selectedItem._id)} 
                  className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all"
                 >
                    <Trash2 size={12} /> Purge Entry
                 </button>
                 <button 
                  onClick={() => setSelectedItem(null)} 
                  className="px-6 py-2 bg-slate-900 text-white rounded-xl font-black text-[9px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg"
                 >
                    Dismiss
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const ModalBlock = ({ label, value, icon: Icon }) => (
  <div className="space-y-1">
    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-100 rounded-xl">
      <Icon size={12} className="text-blue-600" />
      <span className="text-[11px] font-bold text-slate-800 break-all">{value}</span>
    </div>
  </div>
);

export default AdminDataHub;
