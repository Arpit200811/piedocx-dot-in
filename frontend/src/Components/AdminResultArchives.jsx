import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { base_url } from '../utils/info';
import { Calendar, Filter, Download, Trophy, User, Hash, Clock, AlertCircle, Search, RefreshCw, ChevronRight, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const AdminResultArchives = () => {
    const navigate = useNavigate();
    const [dates, setDates] = useState([]);
    const [colleges, setColleges] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedCollege, setSelectedCollege] = useState('');
    const [yearGroup, setYearGroup] = useState('1-2');
    const [branchGroup, setBranchGroup] = useState('CS-IT');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchMetadata = async () => {
            try {
                const token = localStorage.getItem('adminToken');
                const res = await axios.get(`${base_url}/api/admins/admin/result-metadata`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setDates(res.data.dates || []);
                setColleges(res.data.colleges || []);
                
                if (res.data.dates?.length > 0) {
                    setSelectedDate(res.data.dates[0]);
                } else {
                    setSelectedDate(new Date().toISOString().split('T')[0]);
                }
            } catch (err) {
                console.error("Error fetching metadata:", err);
            }
        };
        fetchMetadata();
    }, []);

    useEffect(() => {
        if (selectedDate) {
            fetchResults();
        }
    }, [selectedDate, selectedCollege, yearGroup, branchGroup]);

    const fetchResults = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const res = await axios.get(`${base_url}/api/admins/admin/get-historical-results`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { 
                    date: selectedDate,
                    college: selectedCollege,
                    yearGroup,
                    branchGroup
                }
            });
            setResults(res.data);
        } catch (err) {
            console.error("Error fetching results:", err);
            Swal.fire('Error', 'Failed to fetch archived results', 'error');
        } finally {
            setLoading(false);
        }
    };

    const filteredResults = results.filter(r => 
        r.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.studentId?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const exportToExcel = () => {
        if (!filteredResults.length) return Swal.fire('Error', 'No data to export', 'error');
        
        const data = filteredResults.map((r, i) => ({
            Rank: i + 1,
            'Full Name': r.fullName,
            'Student ID': r.studentId,
            Email: r.email,
            College: r.college,
            Branch: r.branch,
            Year: r.year,
            Score: r.score,
            Total: r.totalQuestions,
            'Correct Count': r.correctCount,
            'Wrong Count': r.wrongCount,
            'Date': r.testDate
        }));

        const ws = window.XLSX.utils.json_to_sheet(data);
        const wb = window.XLSX.utils.book_new();
        window.XLSX.utils.book_append_sheet(wb, ws, "Results");
        window.XLSX.writeFile(wb, `Results_${selectedCollege || 'All'}_${selectedDate}.xlsx`);
    };

    const exportToPDF = () => {
        if (!filteredResults.length) return Swal.fire('Error', 'No data to export', 'error');

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text("Piedocx Assessment Report", 14, 20);
        doc.setFontSize(10);
        doc.text(`College: ${selectedCollege || 'All'} | Group: ${yearGroup}/${branchGroup} | Date: ${selectedDate}`, 14, 30);

        const tableColumn = ["Rank", "Name", "ID", "College", "Score", "Accuracy"];
        const tableRows = filteredResults.map((r, i) => [
            i + 1,
            r.fullName,
            r.studentId,
            r.college,
            `${r.score}/${r.totalQuestions}`,
            `${Math.round((r.score/r.totalQuestions)*100)}%`
        ]);

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 40,
            theme: 'grid',
            headStyles: { fillColor: [37, 99, 235] }
        });

        doc.save(`Results_${selectedCollege || 'All'}_${selectedDate}.pdf`);
    };

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 font-sans">
            
            {/* Header Area */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 px-2">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter uppercase italic flex items-center gap-3">
                        <Trophy className="text-blue-600 w-8 h-8" /> 
                        Performance <span className="text-blue-600">Leaderboards</span>
                    </h1>
                    <p className="text-[10px] md:text-xs text-slate-400 font-bold uppercase tracking-widest mt-1 italic">Historical Data Archives / Ranked Submissions</p>
                </div>

                <div className="flex flex-wrap items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-2 bg-slate-50 px-3 py-2.5 sm:py-1.5 rounded-xl border border-slate-100 flex-1 sm:flex-initial min-h-[44px]">
                        <Calendar size={14} className="text-slate-400 flex-shrink-0" />
                        <select 
                            value={selectedDate} 
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="bg-transparent border-none outline-none text-[11px] font-black uppercase text-slate-700 cursor-pointer w-full"
                        >
                            {dates.length > 0 ? dates.map(d => (
                                <option key={d} value={d}>{new Date(d).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</option>
                            )) : <option value={new Date().toISOString().split('T')[0]}>No Records Found</option>}
                        </select>
                    </div>

                    <div className="flex items-center gap-2 bg-slate-50 px-3 py-2.5 sm:py-1.5 rounded-xl border border-slate-100 flex-1 sm:flex-initial min-h-[44px]">
                        <User size={14} className="text-slate-400 flex-shrink-0" />
                        <select 
                            value={selectedCollege} 
                            onChange={(e) => setSelectedCollege(e.target.value)}
                            className="bg-transparent border-none outline-none text-[11px] font-black uppercase text-slate-700 cursor-pointer w-full"
                        >
                            <option value="">All Colleges</option>
                            {colleges.map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                        <Filter size={14} className="text-slate-400" />
                        <select 
                            value={yearGroup} 
                            onChange={(e) => setYearGroup(e.target.value)}
                            className="bg-transparent border-none outline-none text-[11px] font-black uppercase text-slate-700 cursor-pointer"
                        >
                            <option value="1-2">1st & 2nd Year</option>
                            <option value="3">3rd Year</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                        <select 
                            value={branchGroup} 
                            onChange={(e) => setBranchGroup(e.target.value)}
                            className="bg-transparent border-none outline-none text-[11px] font-black uppercase text-slate-700 cursor-pointer"
                        >
                            <option value="CS-IT">CS-IT</option>
                            <option value="CORE">CORE</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2 ml-2">
                        <button 
                            onClick={exportToExcel}
                            className="p-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 hover:bg-emerald-600 hover:text-white transition-all shadow-sm flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
                            title="Export to Excel"
                        >
                            <Download size={14} /> Excel
                        </button>
                        <button 
                            onClick={exportToPDF}
                            className="p-2 bg-red-50 text-red-600 rounded-xl border border-red-100 hover:bg-red-600 hover:text-white transition-all shadow-sm flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
                            title="Export to PDF"
                        >
                            <Download size={14} /> PDF
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Summary Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Submissions', value: results.length, icon: User, color: 'blue' },
                    { label: 'Avg. Score', value: results.length ? (results.reduce((a,b)=>a+b.score,0)/results.length).toFixed(1) : 0, icon: Hash, color: 'indigo' },
                    { label: 'Top Score', value: results.length ? Math.max(...results.map(r=>r.score)) : 0, icon: Trophy, color: 'amber' },
                    { label: 'Pass Rate', value: '92%', icon: Clock, color: 'emerald' }
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl bg-${stat.color}-50 text-${stat.color}-600 flex items-center justify-center`}>
                            <stat.icon size={20} />
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                            <p className="text-lg font-black text-slate-900 leading-none">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Results Table */}
            <div className="bg-white rounded-2xl sm:rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">
                <div className="p-6 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/30">
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input 
                            type="text" 
                            placeholder="Find student..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500/10 outline-none"
                        />
                    </div>
                    <button onClick={fetchResults} className="p-2.5 text-slate-400 hover:text-blue-600 transition-colors bg-white rounded-xl shadow-sm border border-slate-100">
                        <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>

                {/* Mobile: Show message about horizontal scroll */}
                <div className="lg:hidden px-4 py-2 bg-blue-50 border-b border-blue-100">
                    <p className="text-[10px] text-blue-600 font-bold text-center">← Swipe to view all columns →</p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-4 sm:px-6 md:px-8 py-3 sm:py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Rank</th>
                                <th className="px-4 sm:px-6 md:px-8 py-3 sm:py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Candidate</th>
                                <th className="px-4 sm:px-6 md:px-8 py-3 sm:py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Batch</th>
                                <th className="px-4 sm:px-6 md:px-8 py-3 sm:py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Score</th>
                                <th className="px-4 sm:px-6 md:px-8 py-3 sm:py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Performance</th>
                                <th className="px-4 sm:px-6 md:px-8 py-3 sm:py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr><td colSpan="5" className="text-center py-20 font-black text-slate-300 animate-pulse uppercase tracking-[0.2em] text-xs">Accessing Archives...</td></tr>
                            ) : filteredResults.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-20">
                                        <div className="flex flex-col items-center gap-3 opacity-30">
                                            <AlertCircle size={40} />
                                            <p className="font-black text-xs uppercase tracking-widest">Zero Frequency Detected</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredResults.map((row, index) => (
                                <tr key={row._id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs ${index === 0 ? 'bg-amber-100 text-amber-600 border border-amber-200' : index === 1 ? 'bg-slate-100 text-slate-500' : index === 2 ? 'bg-orange-50 text-orange-600' : 'bg-slate-50 text-slate-400'}`}>
                                            {index + 1}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-slate-100 flex items-center justify-center font-black text-[10px] text-blue-600 uppercase">
                                                {row.fullName?.[0]}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase italic tracking-tighter">{row.fullName}</span>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{row.studentId} • {row.college}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">{row.branch}</span>
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{row.year}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <div className="inline-flex flex-col items-center">
                                            <span className="text-lg font-black text-slate-900 leading-none">{row.score}</span>
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">/ {row.totalQuestions}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex flex-col items-end gap-1.5">
                                            <div className="flex justify-between w-32 items-center text-[9px] font-black uppercase">
                                                <span className="text-slate-400">Accuracy</span>
                                                <span className="text-blue-600">{Math.round((row.score/row.totalQuestions)*100)}%</span>
                                            </div>
                                            <div className="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-blue-600 rounded-full group-hover:bg-blue-500 transition-all duration-1000" 
                                                    style={{ width: `${(row.score/row.totalQuestions)*100}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <button 
                                            onClick={() => navigate(`/admin-result-details/${row._id}`)}
                                            className="p-2 bg-white text-slate-400 hover:text-blue-600 border border-slate-100 rounded-lg hover:bg-blue-50 transition-all shadow-sm group-hover:border-blue-100"
                                            title="View Detailed Analysis"
                                        >
                                            <Eye size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminResultArchives;
