import React, { useState, useEffect, useMemo } from 'react';
import api from '../utils/api';
import { Mail, CheckCircle, XCircle, Clock, Search, RefreshCw, AlertCircle } from 'lucide-react';

// --- Sub-components ---

const LogRow = ({ log }) => (
  <tr className="hover:bg-slate-50/50 transition-colors group border-b border-slate-50 last:border-none">
    <td className="px-6 py-4">
      {log.status === 'sent' ? (
        <div className="flex items-center gap-1.5 text-emerald-600">
          <CheckCircle size={14} />
          <span className="text-[9px] font-black uppercase tracking-widest">Delivered</span>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 text-red-600">
          <XCircle size={14} />
          <span className="text-[9px] font-black uppercase tracking-widest">Failed</span>
        </div>
      )}
    </td>
    <td className="px-6 py-4">
      <span className="text-slate-900 font-bold text-xs">{log.recipient}</span>
    </td>
    <td className="px-6 py-4">
      <div className="flex flex-col">
        <span className="text-slate-700 font-bold text-xs truncate max-w-[200px] leading-none mb-1">{log.subject}</span>
        <span className="text-[8px] font-black text-blue-600 uppercase tracking-tighter bg-blue-50 w-fit px-2 py-0.5 rounded-full">{log.type}</span>
      </div>
    </td>
    <td className="px-6 py-4">
      <div className="flex items-center gap-1.5 text-slate-400">
        <Clock size={12} />
        <span className="text-[10px] font-bold">{new Date(log.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
      </div>
    </td>
    <td className="px-6 py-4 text-right">
      <span className="text-[9px] font-bold text-red-500 italic max-w-[150px] inline-block truncate" title={log.errorMessage}>
        {log.errorMessage || '-'}
      </span>
    </td>
  </tr>
);

// --- Main Component ---

const AdminLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/admins/admin/email-logs`);
      setLogs(res);
    } catch (err) {
      console.error("Error fetching logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = useMemo(() =>
    logs.filter(log =>
      log.recipient?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.type?.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [logs, searchTerm]);

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto font-sans">

      {/* Header - Compact */}
      <div className="flex items-center justify-between px-2">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic flex items-center gap-2">
            <Mail className="text-blue-600 w-6 h-6" /> Comms <span className="text-blue-600">Audit</span>
          </h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 italic leading-none">System Transmission Logs</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
            <input
              type="text"
              placeholder="Search logs..."
              className="pl-8 pr-3 py-1.5 bg-white border border-slate-100 rounded-xl text-[11px] font-bold text-slate-900 focus:ring-1 focus:ring-blue-500/10 w-48 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button onClick={fetchLogs} className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Table Section - High Density */}
      <div className="bg-white border border-slate-100 rounded-[1.5rem] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100">
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Recipient</th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Transmission</th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Timestamp</th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Diagnostics</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 italic">Accessing Logs...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <AlertCircle className="w-8 h-8 text-slate-200" />
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 italic">No communication records found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <LogRow key={log._id} log={log} />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminLogs;
