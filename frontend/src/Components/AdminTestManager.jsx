
import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import api from '../utils/api';
import Swal from 'sweetalert2';
import { Save, Plus, Trash2, Calendar, Clock, FileUp, XCircle } from 'lucide-react';

const AdminTestManager = () => {
    const [loading, setLoading] = useState(true);

    const { register, control, handleSubmit, reset, setValue, watch, getValues } = useForm({
        defaultValues: {
            title: 'General Assessment',
            yearGroup: '1-2',
            branchGroup: 'CS-IT',
            duration: 30,
            questions: []
        }
    });

    const [resultsPublished, setResultsPublished] = useState(false);

    const { fields, append, remove, replace } = useFieldArray({
        control,
        name: "questions"
    });

    useEffect(() => {
        fetchConfig(watch('yearGroup'), watch('branchGroup'));
    }, []);

    const fetchConfig = async (yearGroup, branchGroup) => {
        setLoading(true);
        try {
            const data = await api.get('/api/admin/test-config', {
                params: {
                    yearGroup: yearGroup || '1-2',
                    branchGroup: branchGroup || 'CS-IT'
                }
            });

            if (data && data._id) {
                const formatDateTime = (dateStr) => {
                    if (!dateStr) return '';
                    const date = new Date(dateStr);
                    return new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
                };

                reset({
                    title: data.title || 'General Assessment',
                    yearGroup: data.yearGroup,
                    branchGroup: data.branchGroup,
                    startDate: formatDateTime(data.startDate),
                    endDate: formatDateTime(data.endDate),
                    duration: data.duration || 30,
                    targetCollege: data.targetCollege || 'All',
                    testAccessKey: data.testAccessKey || '',
                    questions: data.questions || []
                });
                setResultsPublished(data.resultsPublished || false);
            } else {
                reset({
                    title: 'General Assessment',
                    yearGroup: yearGroup,
                    branchGroup: branchGroup,
                    startDate: '',
                    endDate: '',
                    duration: 30,
                    targetCollege: 'All',
                    testAccessKey: '',
                    questions: []
                });
                setResultsPublished(false);
            }
        } catch (err) {
            console.error("fetchConfig Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const toggleResults = async () => {
        try {
            const currentYear = watch('yearGroup');
            const currentBranch = watch('branchGroup');

            const data = await api.patch('/api/admin/test-config/toggle-results', {
                yearGroup: currentYear,
                branchGroup: currentBranch
            });
            setResultsPublished(data.resultsPublished);
            Swal.fire('Success', data.message, 'success');
        } catch (err) {
            // Global handler deals with logic errors
        }
    };

    const handleBulkUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const rawContent = event.target.result;
                const cleanJson = rawContent.replace(/^\uFEFF/, "");
                const questions = JSON.parse(cleanJson);

                if (!Array.isArray(questions)) {
                    throw new Error('Root element must be an array of questions.');
                }

                const result = await Swal.fire({
                    title: 'Bulk Upload?',
                    text: `Confirm addition of ${questions.length} questions.`,
                    icon: 'info',
                    showCancelButton: true,
                    confirmButtonText: 'Yes, Upload'
                });

                if (result.isConfirmed) {
                    const yg = watch('yearGroup');
                    const bg = watch('branchGroup');

                    await api.post('/api/admin/test-config/bulk-upload-questions', {
                        questions,
                        yearGroup: yg,
                        branchGroup: bg
                    });

                    fetchConfig(yg, bg);
                    Swal.fire('Success', 'Questions uploaded successfully', 'success');
                }
            } catch (err) {
                console.error("Bulk Upload Error:", err);
                Swal.fire({
                    title: 'Import Failed',
                    text: err.message || 'JSON parse error',
                    icon: 'error'
                });
            }
        };
        reader.readAsText(file);
    };

    const handleCloseSession = async () => {
        const yg = watch('yearGroup');
        const bg = watch('branchGroup');

        const result = await Swal.fire({
            title: 'Close Group Session?',
            text: `All students in ${yg} / ${bg} who haven't finished their test will be marked as 'Attempted' with 0 score. This cannot be undone.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Close Session',
            confirmButtonColor: '#ef4444'
        });

        if (result.isConfirmed) {
            try {
                const data = await api.post('/api/admins/admin/close-session', {
                    yearGroup: yg,
                    branchGroup: bg
                });
                Swal.fire('Session Closed', data.message, 'success');
            } catch (err) {
                // Global handler handles it
            }
        }
    };

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const preparedData = {
                ...data,
                startDate: data.startDate ? new Date(data.startDate).toISOString() : null,
                endDate: data.endDate ? new Date(data.endDate).toISOString() : null
            };

            await api.post('/api/admin/test-config', preparedData);

            await fetchConfig(data.yearGroup, data.branchGroup);

            Swal.fire({
                title: 'Saved Successfully',
                text: 'Test Configuration has been synchronized with the server.',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (err) {
            console.error("Submit Error:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-10 text-center">Loading Configuration...</div>;

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 md:mb-8">
                <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">Assessment Configuration</h1>
                <button onClick={handleSubmit(onSubmit)} className="w-full md:w-auto bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30">
                    <Save size={20} /> Save Changes
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 h-fit">
                    <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <Clock className="text-blue-500" />
                        Test Settings
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Test Title</label>
                            <input {...register("title")} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-700 outline-none focus:border-blue-500" />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Year Group</label>
                                <select
                                    {...register("yearGroup")}
                                    onChange={(e) => fetchConfig(e.target.value, getValues('branchGroup'))}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-700 outline-none focus:border-blue-500"
                                >
                                    <option value="1-2">1st & 2nd Year</option>
                                    <option value="3-4">3rd & 4th Year</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Branch Group</label>
                                <select
                                    {...register("branchGroup")}
                                    onChange={(e) => fetchConfig(getValues('yearGroup'), e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-700 outline-none focus:border-blue-500"
                                >
                                    <option value="CS-IT">CS-IT</option>
                                    <option value="CORE">Core (EC/ME/EE/Auto)</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Start Date & Time</label>
                            <input type="datetime-local" {...register("startDate")} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium text-slate-700 outline-none focus:border-blue-500" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">End Date & Time</label>
                            <input type="datetime-local" {...register("endDate")} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium text-slate-700 outline-none focus:border-blue-500" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Duration (Minutes)</label>
                            <input type="number" {...register("duration")} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-700 outline-none focus:border-blue-500" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Target College Restriction</label>
                            <input {...register("targetCollege")} placeholder="e.g. BIT Kanpur (or 'All')" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-blue-600 outline-none focus:border-blue-500 placeholder:text-slate-300" />
                            <p className="text-[9px] text-slate-400 mt-2 italic font-medium">* Only students with this college name can start the test. Use 'All' for everyone.</p>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Private Test Access Key</label>
                            <input {...register("testAccessKey")} placeholder="e.g. 112233" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-amber-600 outline-none focus:border-blue-500 placeholder:text-slate-300" />
                            <p className="text-[9px] text-slate-400 mt-2 italic font-medium">* Share this code with students in the hall to unlock the test.</p>
                        </div>
                        <div className="pt-4 border-t border-slate-100">
                            <button
                                onClick={toggleResults}
                                className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-lg ${resultsPublished ? 'bg-emerald-500 text-white shadow-emerald-500/20 hover:bg-emerald-600' : 'bg-slate-900 text-white shadow-slate-900/20 hover:bg-slate-800'}`}
                            >
                                {resultsPublished ? 'Results Published' : 'Publish Results'}
                            </button>
                            <p className="text-[9px] text-slate-400 mt-3 font-bold text-center leading-relaxed">
                                {resultsPublished ? 'Students can now view their scores and correct answers.' : 'Results are hidden. Students only see completion status.'}
                            </p>
                        </div>
                        <div className="pt-6 border-t border-slate-100">
                            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-4">Session Management</h3>
                            <button
                                onClick={handleCloseSession}
                                className="w-full py-4 border-2 border-red-500 text-red-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-50 transition-all flex items-center justify-center gap-2"
                            >
                                <XCircle size={16} /> Close Today's Session
                            </button>
                            <p className="text-[9px] text-slate-400 mt-2 font-medium">Marks all pending students as "Finished" (0 marks).</p>
                            <div className="mt-3 bg-amber-50 rounded-xl p-3 border border-amber-100 flex items-start gap-3">
                                <div className="min-w-[4px] h-full bg-amber-400 rounded-full"></div>
                                <p className="text-[9px] text-amber-700 font-bold leading-relaxed">
                                    <span className="uppercase tracking-wider block mb-1">⚠️ Important</span>
                                    If a student closes their browser tab without clicking "Submit", their timer continues in the background. They will NOT be auto-submitted. You MUST use this button at the end of the day to force-close these orphaned sessions.
                                </p>
                            </div>
                        </div>
                        <div className="pt-6 border-t border-slate-100">
                            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-4">Bulk Actions</h3>
                            <div className="relative">
                                <input
                                    type="file"
                                    accept=".json"
                                    onChange={handleBulkUpload}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div className="flex items-center justify-center gap-3 w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold hover:border-blue-400 hover:text-blue-500 transition-all">
                                    <FileUp size={20} />
                                    <span className="text-xs uppercase tracking-widest">Upload JSON</span>
                                </div>
                            </div>
                            <p className="text-[9px] text-slate-400 mt-2 font-medium">Use a valid questions JSON array format.</p>
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <Calendar className="text-blue-500" />
                            Questions Manager
                        </h2>
                        <button
                            type="button"
                            onClick={() => append({ questionText: '', options: ['', '', '', ''], correctAnswer: '' })}
                            className="bg-green-50 text-green-600 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-green-100"
                        >
                            <Plus size={16} /> Add Question
                        </button>
                    </div>

                    <div className="space-y-6">
                        {fields.map((field, index) => (
                            <div key={field.id} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 relative group">
                                <button
                                    type="button"
                                    onClick={() => remove(index)}
                                    className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 size={20} />
                                </button>
                                <div className="mb-4 pr-8">
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Question {index + 1}</label>
                                    <input
                                        {...register(`questions.${index}.questionText`, { required: true })}
                                        placeholder="Enter question text..."
                                        value={watch(`questions.${index}.questionText`) || ""}
                                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-800 outline-none focus:border-blue-500"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    {[0, 1, 2, 3].map((optIndex) => (
                                        <div key={optIndex} className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200 focus-within:border-blue-500 transition-all">
                                            <div className="flex-grow flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-black text-[10px] text-slate-500 shrink-0">
                                                    {String.fromCharCode(65 + optIndex)}
                                                </div>
                                                {/* Duplicate Option Check */}
                                                {(watch(`questions.${index}.options`) || []).filter((x, i) => x === watch(`questions.${index}.options.${optIndex}`) && x !== "").length > 1 && (
                                                    <div className="absolute -top-2 left-2 bg-amber-500 text-white text-[8px] px-1 rounded font-bold animate-bounce">DUP</div>
                                                )}
                                                <input
                                                    {...register(`questions.${index}.options.${optIndex}`, {
                                                        required: true,
                                                        onChange: (e) => {
                                                            const newOptionValue = e.target.value;
                                                            const currentCorrectAnswer = watch(`questions.${index}.correctAnswer`);
                                                            const allCurrentOptions = getValues(`questions.${index}.options`) || [];
                                                            const previousOptionValue = allCurrentOptions[optIndex];

                                                            if (currentCorrectAnswer === previousOptionValue && previousOptionValue !== "") {
                                                                setValue(`questions.${index}.correctAnswer`, newOptionValue, { shouldValidate: true });
                                                            }
                                                        }
                                                    })}
                                                    value={watch(`questions.${index}.options.${optIndex}`) || ""}
                                                    className={`w-full bg-transparent font-bold outline-none text-sm ${(watch(`questions.${index}.options`) || []).filter(x => x === watch(`questions.${index}.options.${optIndex}`) && x !== "").length > 1 ? 'text-amber-600' : 'text-slate-700'}`}
                                                />
                                            </div>
                                            <label className="flex items-center gap-2 cursor-pointer group/radio">
                                                <input
                                                    type="radio"
                                                    value={watch(`questions.${index}.options.${optIndex}`)}
                                                    {...register(`questions.${index}.correctAnswer`, { required: true })}
                                                    checked={watch(`questions.${index}.correctAnswer`) === watch(`questions.${index}.options.${optIndex}`) && watch(`questions.${index}.correctAnswer`) !== ""}
                                                    onChange={() => {
                                                        const val = getValues(`questions.${index}.options.${optIndex}`);
                                                        if (!val) {
                                                            Swal.fire({
                                                                title: 'Empty Option!',
                                                                text: 'Please write some text in the option before selecting it as correct.',
                                                                icon: 'warning',
                                                                toast: true,
                                                                position: 'top-end',
                                                                timer: 3000,
                                                                showConfirmButton: false
                                                            });
                                                            return;
                                                        }
                                                        setValue(`questions.${index}.correctAnswer`, val);
                                                    }}
                                                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300"
                                                />
                                                <span className="text-[9px] font-black uppercase text-slate-400 group-hover/radio:text-blue-600 transition-colors">Correct</span>
                                            </label>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                        Selected Output: <span className="text-blue-600 font-black">{watch(`questions.${index}.correctAnswer`) || "None"}</span>
                                    </div>
                                    {(!watch(`questions.${index}.correctAnswer`) || !(watch(`questions.${index}.options`) || []).includes(watch(`questions.${index}.correctAnswer`))) && (
                                        <span className="text-red-500 italic font-bold">Select a valid correct option above</span>
                                    )}
                                </div>
                            </div>
                        ))}

                        {fields.length === 0 && (
                            <div className="text-center py-10 text-slate-400 font-medium">
                                No questions added yet. Click "Add Question" to begin.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default AdminTestManager;