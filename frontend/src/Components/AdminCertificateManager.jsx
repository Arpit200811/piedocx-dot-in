import React, { useState, useEffect, useMemo } from 'react';
import { Search, Trash2, ShieldAlert, ShieldCheck, Download, Eye, X, Filter, Mail, Edit3, MessageCircle, Settings } from 'lucide-react';
import Certificate from './Certificate';
import Swal from 'sweetalert2';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import api from '../utils/api';
import { io } from 'socket.io-client';
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

const StudentRow = ({ student: s, isSelected, onSelect, onView, onSendEmail, onWhatsApp, onStatusToggle, onDelete, onEditMarks, onEditTechnology }) => (
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
        <ActionButton onClick={() => onEditTechnology(s)} icon={Settings} color="slate" title="Edit Technology" />
        <ActionButton onClick={() => onEditMarks(s)} icon={Edit3} color="purple" title="Edit Marks" />
        <ActionButton onClick={() => onSendEmail(s)} icon={Mail} color="indigo" title="Send Email" />
        <ActionButton onClick={() => onWhatsApp(s)} icon={MessageCircle} color="green" title="Send WhatsApp" />
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
  const [sharingStudent, setSharingStudent] = useState(null);
  const [showCertificate, setShowCertificate] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);
  const [colleges, setColleges] = useState([]);

  // WhatsApp State
  const [isWhatsAppReady, setIsWhatsAppReady] = useState(false);
  const [qrCodeData, setQrCodeData] = useState(null);

  useEffect(() => {
    // 1. Check initial status
    api.get('/api/whatsapp/status').then(res => {
      setIsWhatsAppReady(res.data.connected);
    }).catch(() => setIsWhatsAppReady(false));

    // 2. Connector for events
    const socket = io('http://localhost:5002'); // Adjust URL for production
    // Better: use relative path or env
    // const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5002'); 
    // Since we don't have VITE_API_URL handy in context, I'll use window.location.origin if prod?
    // User is local: localhost:5002.

    socket.on('whatsapp-qr', (qr) => {
      console.log("QR Received via Socket");
      setQrCodeData(qr);
      setIsWhatsAppReady(false);
    });

    socket.on('whatsapp-ready', () => {
      setIsWhatsAppReady(true);
      setQrCodeData(null);
      Swal.fire({
        title: 'WhatsApp Connected!',
        text: 'You can now send bulk messages.',
        icon: 'success',
        toast: true,
        position: 'top-end',
        timer: 3000
      });
    });

    socket.on('whatsapp-disconnected', () => {
      setIsWhatsAppReady(false);
    });

    return () => socket.disconnect();
  }, []);

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams({
        page: currentPage,
        limit: 20,
        search: searchTerm,
        college: collegeFilter,
        startDate,
        endDate
      });

      const response = await api.get(`/api/certificate/students?${query.toString()}`);

      // Handle both old array format (fallback) and new paginated object
      if (Array.isArray(response)) {
        setStudents(response);
        // Generate unique colleges client-side if API is old
        setColleges([...new Set(response.map(s => s.college))]);
      } else {
        setStudents(response.students || []);
        setTotalPages(response.totalPages || 1);
        setTotalStudents(response.totalStudents || 0);
        setColleges(response.colleges || []);
      }
    } catch (err) {
      console.error('Fetch Failed', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStudents();
    }, 500); // Debounce search
    return () => clearTimeout(timer);
  }, [currentPage, searchTerm, collegeFilter, startDate, endDate]);

  // Use the fetched students directly since backend filters now
  const filteredStudents = students;

  // Derived stats from backend totals if available, else local
  const stats = useMemo(() => {
    // If paginated, these might be partial, but totals come from backend
    const active = students.filter(s => s.status === 'active').length;
    const certificates = students.filter(s => s.certificateId).length;
    // Note: To get TRUE global stats we need a separate stats endpoint or rely on totalStudents
    return {
      total: totalStudents || students.length,
      active,
      certificates
    };
  }, [students, totalStudents]);

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
        return await api.post('/api/certificate/bulk-send-email', { ids: selectedIds });
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
      await api.post('/api/certificate/bulk-delete', { ids: selectedIds });
      Swal.fire('Purge Complete', 'Records have been removed.', 'success');
      setSelectedIds([]);
      await fetchStudents();
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
      await api.put(`/api/certificate/student/status/${id}`, { status: newStatus });
      await fetchStudents();
    } catch (err) {
      // Local error handling if needed, otherwise global interceptor handles it
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
      await api.put(`/api/certificate/student/details/${student._id}`, { score: Number(newScore) });
      Swal.fire('Success', 'Marks updated successfully', 'success');
      await fetchStudents();
    }
  };

  const handleEditTechnology = async (student) => {
    const { value: newTechnology } = await Swal.fire({
      title: 'Update Technology',
      text: `Editing technology for ${student.fullName}`,
      input: 'text',
      inputLabel: 'Technology / Domain',
      inputValue: student.technology || '',
      showCancelButton: true
    });

    if (newTechnology !== undefined) {
      await api.put(`/api/certificate/student/details/${student._id}`, { technology: newTechnology });
      Swal.fire('Success', 'Technology updated successfully', 'success');
      await fetchStudents();
    }
  };

  const handleSingleSend = async (student) => {
    const result = await Swal.fire({
      title: 'Send Certificate?',
      text: `Email and Score will be sent to ${student.email}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Send Now',
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          return await api.post('/api/certificate/send-single-email', { id: student._id });
        } catch (error) {
          Swal.showValidationMessage(`Failed: ${error.response?.data?.message || error.message}`);
        }
      }
    });

    if (result.isConfirmed) {
      Swal.fire('Sent!', result.value.message, 'success');
    }
  };

  const handleWhatsAppSend = async (student) => {
    Swal.fire({
      title: 'Preparing PNG...',
      text: 'Generating high-res certificate for WhatsApp...',
      allowOutsideClick: false,
      didOpen: () => { Swal.showLoading(); }
    });

    try {
      setSharingStudent(student);
      // Let fonts and QR stabilize
      await new Promise(r => setTimeout(r, 2500));

      const node = document.getElementById('whatsapp-capture-node');
      const shareTarget = node.querySelector('.certificate-body');

      if (!shareTarget) throw new Error("Certificate rendering failed.");

      const originalTransform = shareTarget.style.transform;
      shareTarget.style.transform = 'none';

      const canvas = await html2canvas(shareTarget, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#f8fbff',
        width: 1123,
        height: 794
      });

      shareTarget.style.transform = originalTransform;
      const blob = await new Promise(r => canvas.toBlob(r, 'image/png', 1.0));
      const file = new File([blob], `${student.fullName.replace(/\s+/g, '_')}_Certificate.png`, { type: 'image/png' });

      setSharingStudent(null);
      Swal.close();

      // SECOND STEP: Actual User Gesture to bypass browser security
      const shareData = {
        files: [file],
        title: 'Certificate',
        text: `Congratulations ${student.fullName}! Your Assessment score is ${student.score || 0}.`
      };

      const canShare = navigator.share && navigator.canShare && navigator.canShare(shareData);

      await Swal.fire({
        title: 'Ready to Dispatch!',
        text: 'Certificate PNG generated successfully.',
        icon: 'success',
        confirmButtonText: canShare ? '📤 Share on WhatsApp' : '🔗 Send Link (Desktop)',
        showCancelButton: true,
        confirmButtonColor: '#22c55e',
        preConfirm: async () => {
          if (canShare) {
            try {
              await navigator.share(shareData);
            } catch (shareErr) {
              if (shareErr.name !== 'AbortError') throw shareErr;
            }
          } else {
            // Fallback for Desktop/Non-supported browsers
            const message = `*Congratulations ${student.fullName}!* 🏆%0A%0AYour Assessment from *Piedocx Technologies* is complete.%0A%0A📊 *Your Score:* ${student.score || 0}%0A📜 *View Certificate:* https://piedocx.in/%23/view-certificate/${student.email}`;
            const phone = student.mobile.replace(/\D/g, '');
            window.open(`https://wa.me/91${phone}?text=${message}`, '_blank');
          }
        }
      });

    } catch (err) {
      console.error(err);
      Swal.fire('Export Error', `Failure: ${err.message || 'Processing Error'}`, 'error');
      setSharingStudent(null);
    }
  };

  const handleBulkWhatsApp = async () => {
    const result = await Swal.fire({
      title: 'Bulk WhatsApp Blast?',
      text: `Send official certificate links to ${selectedIds.length} students via Server? (Ensure Backend QR is scanned)`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Blast Messages',
      confirmButtonColor: '#25D366',
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          return await api.post('/api/whatsapp/bulk-send', { ids: selectedIds });
        } catch (error) {
          Swal.showValidationMessage(`Failed: ${error.response?.data?.message || 'Server Error'}`);
        }
      }
    });

    if (result.isConfirmed && result.value) {
      Swal.fire('Sent!', `Summary: ${JSON.stringify(result.value.summary)}`, 'success');
      setSelectedIds([]);
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
      await api.delete(`/api/certificate/student/${id}`);
      Swal.fire('Deleted!', 'Record removed.', 'success');
      await fetchStudents();
    } catch (err) {
      // Handled by global interceptor
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
          <div className="flex items-center gap-4">
            {/* WhatsApp Status Pill */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${isWhatsAppReady ? 'bg-green-50 border-green-200 text-green-700' : 'bg-orange-50 border-orange-200 text-orange-700'}`}>
              <div className={`w-2 h-2 rounded-full ${isWhatsAppReady ? 'bg-green-500' : 'bg-orange-500 animate-pulse'}`}></div>
              <span className="text-[9px] font-black uppercase tracking-widest">
                WA: {isWhatsAppReady ? 'Online' : 'Scan Required'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Sync</span>
            </div>
          </div>
        </div>

        {/* Floating QR Scanner (Only if disconnected and QR exists) */}
        <AnimatePresence>
          {!isWhatsAppReady && qrCodeData && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="fixed bottom-8 right-8 bg-white p-4 rounded-3xl shadow-2xl border-4 border-slate-900 z-50 flex flex-col items-center gap-4 w-64"
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">WhatsApp Login</span>
                <button onClick={() => setQrCodeData(null)} className="text-slate-300 hover:text-slate-900"><X size={14} /></button>
              </div>
              <div className="p-2 bg-white rounded-xl border border-slate-100">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrCodeData)}`}
                  alt="Scan QR"
                  className="w-full h-auto rounded-lg"
                />
              </div>
              <p className="text-[9px] text-center font-bold text-slate-500 px-2">
                Open WhatsApp {'>'} Linked Devices {'>'} Scan to enable bulk messaging.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

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
                <Mail size={14} /> Send Email
              </button>
              <button
                onClick={handleBulkWhatsApp}
                className="px-6 py-2 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2"
              >
                <MessageCircle size={14} /> WhatsApp
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
                      onSendEmail={handleSingleSend}
                      onWhatsApp={handleWhatsAppSend}
                      onStatusToggle={handleStatusToggle}
                      onDelete={handleDelete}
                      onEditMarks={handleEditMarks}
                      onEditTechnology={handleEditTechnology}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between p-4 border-t border-slate-100 bg-slate-50/50">
            <div className="text-xs font-black uppercase text-slate-400 tracking-widest">
              Showing {students.length} of {totalStudents} Records
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-600 text-xs font-black uppercase disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-all shadow-sm"
              >
                Previous
              </button>
              <div className="px-4 py-2 rounded-lg bg-blue-50 text-blue-600 text-xs font-black border border-blue-100">
                Page {currentPage} of {totalPages}
              </div>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-600 text-xs font-black uppercase disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-all shadow-sm"
              >
                Next
              </button>
            </div>
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

      <div id="whatsapp-capture-node" className="fixed top-0 left-0 -z-[999] pointer-events-none" style={{ width: '1200px', height: '900px', opacity: 0.01 }}>
        {sharingStudent && (
          <div className="p-10 bg-white inline-block">
            <Certificate
              student={{
                name: sharingStudent.fullName,
                college: sharingStudent.college,
                branch: sharingStudent.branch,
                year: sharingStudent.year,
                studentId: sharingStudent.studentId,
                certificateId: sharingStudent.certificateId,
                _id: sharingStudent._id,
                technology: sharingStudent.technology,
              }}
              userEmail={sharingStudent.email}
              autoSend={false}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const Modal = ({ children, onClose }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={(e) => e.target === e.currentTarget && onClose()}>
    <div className="bg-white rounded-[2rem] w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in duration-300">
      {children}
    </div>
  </div>
);

export default AdminCertificateManager;
