import React, { forwardRef } from 'react';
import { ShieldCheck, MapPin, Phone, Mail, GraduationCap } from 'lucide-react';
import QRCode from 'react-qr-code';

const IDCardAsset = forwardRef(({ student }, ref) => {
    if (!student) return null;

    // Standard Hex Fallbacks for html2canvas (Tailwind v4 oklch incompatibility)
    const colors = {
        white: '#ffffff',
        blue600: '#2563eb',
        blue500: '#3b82f6',
        slate900: '#0f172a',
        slate600: '#475569',
        slate500: '#64748b',
        slate400: '#94a3b8',
        slate300: '#cbd5e1',
        slate100: '#f1f5f9',
        slate50: '#f8fafc',
    };

    return (
        <div className="hidden">
            <div ref={ref} className="id-card-capture" style={{ width: '340px', background: colors.white }}>
                <div 
                    className="relative rounded-3xl overflow-hidden" 
                    style={{ 
                        width: '340px', 
                        backgroundColor: colors.white, 
                        border: `1px solid ${colors.slate100}`,
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                    }}
                >
                    {/* Header accent */}
                    <div className="absolute top-0 left-0 w-full h-2" style={{ backgroundColor: colors.blue600 }}></div>
                    
                    <div className="p-6 pt-8 space-y-6">
                        <div className="flex items-start justify-between">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded flex items-center justify-center" style={{ backgroundColor: colors.blue600 }}>
                                        <ShieldCheck style={{ color: colors.white }} size={16} />
                                    </div>
                                    <span className="font-black tracking-tighter text-sm italic" style={{ color: colors.slate900 }}>
                                        PIE<span style={{ color: colors.blue600 }}>DOCX</span>
                                    </span>
                                </div>
                                <p className="text-[7px] font-black uppercase tracking-widest pl-1" style={{ color: colors.slate400 }}>Official ID Card</p>
                            </div>
                            <div className="text-right">
                                <div className="text-[10px] font-black uppercase italic" style={{ color: colors.slate900 }}>Verified Student</div>
                                <div className="text-[6px] font-bold uppercase tracking-tighter" style={{ color: colors.slate400 }}>Issue: {new Date().getFullYear()}</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-20 h-24 rounded-2xl overflow-hidden shrink-0" style={{ backgroundColor: colors.slate50, border: `1px solid ${colors.slate100}` }}>
                                {student.profilePicture ? (
                                    <img src={student.profilePicture} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center font-black text-xl uppercase" style={{ color: colors.slate300, backgroundColor: colors.slate50 }}>
                                        {student.fullName?.[0]}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 space-y-2">
                                <div>
                                    <h4 className="text-sm font-black leading-tight uppercase line-clamp-2" style={{ color: colors.slate900 }}>{student.fullName}</h4>
                                    <p className="text-[9px] font-black tracking-tight uppercase mt-0.5" style={{ color: colors.blue600 }}>{student.studentId}</p>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-1.5">
                                        <GraduationCap size={8} style={{ color: colors.slate400 }} />
                                        <span className="text-[7px] font-bold uppercase tracking-tighter line-clamp-1" style={{ color: colors.slate600 }}>{student.college}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <MapPin size={8} style={{ color: colors.slate400 }} />
                                        <span className="text-[7px] font-bold uppercase tracking-tighter" style={{ color: colors.slate600 }}>{student.branch} • {student.year}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 flex items-center justify-between gap-4" style={{ borderTop: `1px solid ${colors.slate50}` }}>
                            <div className="space-y-2 flex-1">
                                <div className="flex items-center gap-2">
                                    <Mail size={10} style={{ color: colors.blue500 }} />
                                    <span className="text-[8px] font-bold lowercase" style={{ color: colors.slate500 }}>{student.email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone size={10} style={{ color: colors.blue500 }} />
                                    <span className="text-[8px] font-bold" style={{ color: colors.slate500 }}>{student.mobile}</span>
                                </div>
                            </div>
                            <div className="shrink-0 p-1.5 rounded-lg shadow-sm" style={{ backgroundColor: colors.white, border: `1px solid ${colors.slate100}` }}>
                                <QRCode value={student.studentId || "PIEDOCX_STUDENT"} size={54} />
                            </div>
                        </div>
                    </div>

                    <div className="p-3 text-center" style={{ backgroundColor: colors.slate50, borderTop: `1px solid ${colors.slate100}` }}>
                        <p className="text-[6px] font-bold uppercase tracking-[0.2em]" style={{ color: colors.slate400 }}>Official Student ID Card | piedocx.in</p>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default IDCardAsset;
