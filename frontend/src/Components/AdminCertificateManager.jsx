import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { base_url } from '../utils/info';
import { Search, Trash2, ShieldAlert, ShieldCheck, Download, Eye, X, Filter, Mail, Edit3 } from 'lucide-react';
import Certificate from './Certificate';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';

// --- Sub-components ---

const StatCard = ({ label, value, color, icon: Icon }) => (
  <div className={`bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-${color}-200 transition-all`}>
    <div>
      <p className="text-slate-400 text-[9px] font-black uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-xl font-black text-slate-900 tracking-tighter">{value}</p>
    </div>
    <div className={`p-2 rounded-lg bg-${color}-50 text-${color}-600`}>
      <Icon size={14} />
    </div>
  </div>
);

const FilterSection = ({ filters, colleges, onExport }) => {
  const { searchTerm, setSearchTerm, collegeFilter, setCollegeFilter, startDate, setStartDate, endDate, setEndDate } = filters;

  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-4 mb-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <h2 className="text-sm font-black text-slate-900 flex items-center gap-2 uppercase tracking-tighter italic">
          <Filter size={16} className="text-blue-600" /> Data <span className="text-blue-600">Refinery</span>
        </h2>
        <button
          onClick={onExport}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg"
        >
          <Download size={14} /> Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
          <input
            type="text"
            placeholder="Search details..."
            className="w-full bg-slate-50 border-none rounded-xl py-2 pl-9 pr-3 text-xs font-bold focus:ring-2 focus:ring-blue-500/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="bg-slate-50 border-none rounded-xl py-2 px-3 text-xs font-bold text-slate-600 outline-none appearance-none"
          value={collegeFilter}
          onChange={(e) => setCollegeFilter(e.target.value)}
        >
          <option value="">All Colleges</option>
          {colleges.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <input
          type="date"
          className="bg-slate-50 border-none rounded-xl py-2 px-3 text-xs font-bold text-slate-400"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          className="bg-slate-50 border-none rounded-xl py-2 px-3 text-xs font-bold text-slate-400"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
    </div>
  );
};

const StudentRow = ({ student: s, isSelected, onSelect, onView, onStatusToggle, onDelete, onEditMarks }) => (
  <tr className={`hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-none ${isSelected ? 'bg-blue-50/50' : ''}`}>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center gap-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(s._id)}
          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20"
        />
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
            {s.profilePicture ? (
              <img src={s.profilePicture} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-300 font-black text-sm bg-slate-50">
                {s.fullName?.[0]}
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-slate-900 font-black text-sm leading-tight">{s.fullName}</span>
            <span className="text-blue-600 font-black text-[9px] tracking-tighter uppercase">{s.studentId}</span>
          </div>
        </div>
      </div>
    </td>
    <td className="px-6 py-4">
      <div className="flex flex-col">
        <span className="text-slate-700 font-bold text-xs tracking-tight line-clamp-1">{s.college}</span>
        <span className="text-slate-400 font-bold text-[8px] uppercase">{s.branch} • {s.year}</span>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-slate-500">
      <div className="flex flex-col">
        <span>{s.email}</span>
        <span className="text-[9px] text-slate-400">{s.mobile}</span>
      </div>
    </td>
    <td className="px-6 py-4 text-center whitespace-nowrap">
      <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${s.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
        }`}>
        {s.status}
      </span>
    </td>
    <td className="px-6 py-4 text-center whitespace-nowrap">
      <div className="flex flex-col items-center">
        <span className="text-slate-900 font-black text-xs">{s.score || 0}</span>
        <span className="text-[8px] text-slate-400 uppercase font-bold tracking-tighter">Marks</span>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-right">
      <div className="flex items-center justify-end gap-1.5">
        <ActionButton onClick={() => onEditMarks(s)} icon={Edit3} color="purple" title="Edit Marks" />
        <ActionButton onClick={() => onView(s)} icon={Eye} color="blue" title="View Certificate" />
        <ActionButton
          onClick={() => onStatusToggle(s._id, s.status)}
          icon={s.status === 'active' ? ShieldAlert : ShieldCheck}
          color={s.status === 'active' ? 'orange' : 'green'}
          title={s.status === 'active' ? 'Revoke' : 'Activate'}
        />
        <ActionButton onClick={() => onDelete(s._id)} icon={Trash2} color="red" title="Delete record" />
      </div>
    </td>
  </tr>
);

const ActionButton = ({ onClick, icon: Icon, color, title }) => (
  <button
    onClick={onClick}
    className={`p-2 rounded-lg hover:bg-${color}-50 hover:text-${color}-600 transition-all text-slate-300 transform active:scale-95`}
    title={title}
  >
    <Icon size={14} />
  </button>
);

// --- Main Component ---

const AdminCertificateManager = () => {
  // State Management
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [collegeFilter, setCollegeFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showCertificate, setShowCertificate] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const res = await axios.get(`${base_url}/api/certificate/students`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(res.data || []);
    } catch (err) {
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Pure filtering logic
  const filteredStudents = useMemo(() => {
    let results = [...students];

    if (searchTerm) {
      const lowSearch = searchTerm.toLowerCase();
      results = results.filter(s =>
        s.fullName?.toLowerCase().includes(lowSearch) ||
        s.studentId?.toLowerCase().includes(lowSearch) ||
        s.college?.toLowerCase().includes(lowSearch) ||
        s.branch?.toLowerCase().includes(lowSearch)
      );
    }

    if (collegeFilter) {
      results = results.filter(s => s.college === collegeFilter);
    }

    if (startDate) {
      results = results.filter(s => new Date(s.createdAt) >= new Date(startDate));
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      results = results.filter(s => new Date(s.createdAt) <= end);
    }

    return results;
  }, [students, searchTerm, collegeFilter, startDate, endDate]);

  const colleges = useMemo(() =>
    [...new Set(students.map(s => s.college))].filter(Boolean),
    [students]);

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredStudents.length && filteredStudents.length > 0) setSelectedIds([]);
    else setSelectedIds(filteredStudents.map(s => s._id));
  };


  const handleBulkEmail = async () => {
    const result = await Swal.fire({
      title: 'Dispatch Diplomas?',
      text: `Prepare and send certificates to ${selectedIds.length} students?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Send All',
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          const token = localStorage.getItem('adminToken');
          const res = await axios.post(`${base_url}/api/certificate/bulk-send-email`, { ids: selectedIds }, {
            headers: { Authorization: `Bearer ${token}` }
          });
          return res.data;
        } catch (error) {
          Swal.showValidationMessage(`Operation Failed: ${error.message}`);
        }
      }
    });

    if (result.isConfirmed && result.value) {
      Swal.fire('Dispatched!', `Summary: ${result.value.message}`, 'success');
      setSelectedIds([]);
    }
  };

  const bulkDelete = async () => {
    const result = await Swal.fire({
      title: 'Execute Bulk Purge?',
      text: `You are about to permanently delete ${selectedIds.length} records.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Yes, Purge Records'
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('adminToken');
        await axios.post(`${base_url}/api/certificate/bulk-delete`, { ids: selectedIds }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        Swal.fire('Purge Complete', 'Records have been removed.', 'success');
        setSelectedIds([]);
        fetchStudents();
      } catch (err) {
        Swal.fire('Error', 'Bulk deletion failed.', 'error');
      }
    }
  };

  const exportToExcel = () => {
    if (filteredStudents.length === 0) return Swal.fire('No Data', 'No data to export', 'info');
    const headers = ["Full Name", "Student ID", "College", "Branch", "Year", "Email", "Mobile", "Status", "Created At"];
    const rows = filteredStudents.map(s => [
      s.fullName, s.studentId, s.college, s.branch, s.year, s.email, s.mobile, s.status,
      new Date(s.createdAt).toLocaleDateString()
    ]);
    const csvContent = [headers.join(","), ...rows.map(row => row.map(cell => `"${cell || ""}"`).join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Students_${new Date().toLocaleDateString()}.csv`;
    link.click();
  };

  const handleStatusToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'revoked' : 'active';
    const result = await Swal.fire({
      title: `Action: ${newStatus.toUpperCase()} certificate?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, proceed!'
    });
    if (!result.isConfirmed) return;
    try {
      const token = localStorage.getItem('adminToken');
      await axios.patch(`${base_url}/api/certificate/students/${id}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchStudents();
    } catch (err) {
      Swal.fire('Error', 'Update failed', 'error');
    }
  };

  const handleEditMarks = async (student) => {
    const { value: newScore } = await Swal.fire({
      title: 'Update Performance Score',
      text: `Editing marks for ${student.fullName}`,
      input: 'number',
      inputLabel: 'Assignment/Test Marks',
      inputValue: student.score || 0,
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value && value !== 0) {
          return 'You need to write something!'
        }
      }
    });

    if (newScore !== undefined) {
      try {
        const token = localStorage.getItem('adminToken');
        await axios.patch(`${base_url}/api/certificate/students/${student._id}`,
          { score: Number(newScore) },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        Swal.fire('Success', 'Marks updated successfully', 'success');
        fetchStudents();
      } catch (err) {
        Swal.fire('Error', err.response?.data?.message || 'Update failed', 'error');
      }
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });
    if (!result.isConfirmed) return;
    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`${base_url}/api/certificate/students/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchStudents();
    } catch (err) {
      Swal.fire('Error', 'Deletion failed', 'error');
    }
  };

  const handleView = (student) => {
    setSelectedStudent(student);
    setShowCertificate(true);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-2 gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
              Student <span className="text-blue-600">Inventory</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 italic">Authorized Personal Only</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Sync</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Database Total" value={students.length} color="slate" icon={Search} />
          <StatCard label="Filtered Scope" value={filteredStudents.length} color="blue" icon={Filter} />
          <StatCard label="Active Links" value={filteredStudents.filter(s => s.status === 'active').length} color="green" icon={ShieldCheck} />
          <StatCard label="Revoked" value={filteredStudents.filter(s => s.status === 'revoked').length} color="red" icon={ShieldAlert} />
        </div>

        {/* Bulk Actions Bar */}
        {selectedIds.length > 0 && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-8 py-4 rounded-3xl shadow-2xl z-50 flex items-center gap-8 border border-slate-700/50 backdrop-blur-xl"
          >
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Selected Entities</span>
              <span className="text-lg font-black text-blue-400">{selectedIds.length} <span className="text-white">Students</span></span>
            </div>
            <div className="h-8 w-[1px] bg-slate-700"></div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleBulkEmail}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2"
              >
                <Mail size={14} /> Send Certificates
              </button>
              <button
                onClick={bulkDelete}
                className="p-2.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all"
              >
                <Trash2 size={18} />
              </button>
              <button onClick={() => setSelectedIds([])} className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all">
                <X size={18} />
              </button>
            </div>
          </motion.div>
        )}

        <FilterSection
          filters={{ searchTerm, setSearchTerm, collegeFilter, setCollegeFilter, startDate, setStartDate, endDate, setEndDate }}
          colleges={colleges}
          onExport={exportToExcel}
        />

        <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/70">
                <tr>
                  <th className="px-6 py-3">
                    <input
                      type="checkbox"
                      onChange={toggleSelectAll}
                      checked={selectedIds.length === filteredStudents.length && filteredStudents.length > 0}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20"
                    />
                  </th>
                  <th className="px-3 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Entity</th>
                  <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Academic Matrix</th>
                  <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Comms</th>
                  <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                  <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Performance</th>
                  <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Control</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="py-20 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 border-4 border-blue-600/10 border-t-blue-600 rounded-full animate-spin"></div>
                        <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Decrypting...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-20 text-center text-slate-400 font-bold text-xs italic uppercase tracking-widest">No matching records found.</td>
                  </tr>
                ) : (
                  filteredStudents.map((s) => (
                    <StudentRow
                      key={s._id}
                      student={s}
                      isSelected={selectedIds.includes(s._id)}
                      onSelect={toggleSelect}
                      onView={handleView}
                      onStatusToggle={handleStatusToggle}
                      onDelete={handleDelete}
                      onEditMarks={handleEditMarks}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showCertificate && selectedStudent && (
        <Modal onClose={() => setShowCertificate(false)}>
          <div className="p-8">
            <div className="mb-6 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tighter uppercase italic">Preview <span className="text-blue-600">Certificate</span></h2>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest italic mt-1">Entity: {selectedStudent.studentId}</p>
              </div>
              <button onClick={() => setShowCertificate(false)} className="p-2 bg-slate-100 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors">
                <X size={16} />
              </button>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-100 shadow-inner bg-slate-50 flex justify-center p-2">
              <div className="transform scale-[0.8] origin-top">
                <Certificate
                  student={{
                    name: selectedStudent.fullName,
                    college: selectedStudent.college,
                    branch: selectedStudent.branch,
                    year: selectedStudent.year,
                    studentId: selectedStudent.studentId,
                    certificateId: selectedStudent.certificateId,
                    _id: selectedStudent._id,
                  }}
                  userEmail={selectedStudent.email}
                  autoSend={false}
                />
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

const Modal = ({ children, onClose }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
    <div className="bg-white rounded-[2rem] w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in duration-300">
      {children}
    </div>
  </div>
);

export default AdminCertificateManager;
