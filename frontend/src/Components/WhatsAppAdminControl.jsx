import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import api from '../utils/api';
import QRCode from 'react-qr-code';
import {
    MessageSquare,
    RefreshCw,
    Power,
    CheckCircle,
    XCircle,
    Loader2,
    QrCode as QrIcon,
    AlertCircle
} from 'lucide-react';
import Swal from 'sweetalert2';

import { base_url } from '../utils/info';

const SOCKET_URL = base_url.replace('/api', '');

const WhatsAppAdminControl = () => {
    const [status, setStatus] = useState('DISCONNECTED'); // DISCONNECTED, INITIALIZING, QR_READY, CONNECTED
    const [qrCode, setQrCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('adminToken');

        // Initialize Socket.IO connection with authentication token
        const newSocket = io(SOCKET_URL, {
            auth: { token },
            withCredentials: true,
            transports: ['websocket', 'polling']
        });

        newSocket.on('connect', () => {
            console.log('Socket Connected to Server ✅');
            fetchCurrentStatus();
        });

        newSocket.on('whatsapp-status', (data) => {
            console.log('WhatsApp Status Received:', data.status);
            setStatus(data.status);
            if (data.qr) {
                console.log('QR Received via status update');
                setQrCode(data.qr);
            }
            if (data.status === 'CONNECTED') {
                setQrCode('');
                setLoading(false);
            }
        });

        newSocket.on('whatsapp-qr', (qr) => {
            console.log('Dedicated QR Event Received! 📲');
            setQrCode(qr);
            setStatus('QR_READY');
            setLoading(false);
        });

        newSocket.on('whatsapp-ready', () => {
            console.log('WhatsApp is READY event received');
            setStatus('CONNECTED');
            setQrCode('');
            setLoading(false);
            Swal.fire({
                icon: 'success',
                title: 'WhatsApp Connected',
                text: 'System is now ready to send messages.',
                timer: 2000,
                showConfirmButton: false
            });
        });

        newSocket.on('whatsapp-disconnected', () => {
            console.log('WhatsApp Disconnected event received');
            setStatus('DISCONNECTED');
            setQrCode('');
        });

        setSocket(newSocket);

        return () => newSocket.close();
    }, []);

    const fetchCurrentStatus = async () => {
        try {
            const res = await api.get('/api/whatsapp/status');
            console.log('Fetched Current Status:', res?.status);
            if (res) {
                setStatus(res.status || 'DISCONNECTED');
                if (res.qr) {
                    console.log('Persistence QR found');
                    setQrCode(res.qr);
                }
            }
        } catch (err) {
            console.error('Failed to fetch status:', err);
        }
    };

    const handleConnect = async () => {
        setLoading(true);
        try {
            const res = await api.post('/api/whatsapp/start');
            if (res && res.success === false) {
                Swal.fire('Note', res.message, 'info');
                setLoading(false);
            }
        } catch (err) {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        const result = await Swal.fire({
            title: 'Disconnect WhatsApp?',
            text: "You will need to scan QR code again to reconnect.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, Logout'
        });

        if (result.isConfirmed) {
            try {
                const res = await api.post('/api/whatsapp/logout');
                if (res) {
                    setStatus('DISCONNECTED');
                    setQrCode('');
                }
            } catch (err) {
                // Handled
            }
        }
    };

    const getStatusConfig = () => {
        switch (status) {
            case 'CONNECTED':
                return { label: 'Connected', color: 'bg-emerald-500', icon: CheckCircle };
            case 'QR_READY':
                return { label: 'Waiting for Scan', color: 'bg-amber-500', icon: QrIcon };
            case 'INITIALIZING':
                return { label: 'Initializing...', color: 'bg-blue-500', icon: Loader2 };
            default:
                return { label: 'Disconnected', color: 'bg-red-500', icon: XCircle };
        }
    };

    const config = getStatusConfig();
    const StatusIcon = config.icon;

    return (
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 max-w-md w-full">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                        <MessageSquare size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-slate-900 uppercase italic leading-none">WhatsApp Hub</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Direct Communication Node</p>
                    </div>
                </div>

                <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full ${config.color} text-white text-[10px] font-black uppercase tracking-wider shadow-lg`}>
                    <StatusIcon size={12} className={status === 'INITIALIZING' ? 'animate-spin' : ''} />
                    {config.label}
                </div>
            </div>

            <div className="space-y-6">
                {status === 'DISCONNECTED' && (
                    <div className="bg-slate-50 rounded-2.5xl p-8 border border-dashed border-slate-200 text-center space-y-4">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                            <Power size={32} className="text-slate-300" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-600">WhatsApp service is currently offline.</p>
                            <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-tight">Manual connection required for system security.</p>
                        </div>
                        <button
                            onClick={handleConnect}
                            disabled={loading}
                            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-500/20 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <Power size={18} />}
                            Initialize Connection
                        </button>
                    </div>
                )}

                {status === 'INITIALIZING' && (
                    <div className="bg-blue-50 rounded-2.5xl p-10 text-center space-y-4">
                        <Loader2 size={48} className="text-blue-600 animate-spin mx-auto" />
                        <p className="text-sm font-black text-blue-900 uppercase italic">Powering up browser...</p>
                        <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Synthesizing secure handshake protocol</p>
                    </div>
                )}

                {status === 'QR_READY' && (
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-3xl border-2 border-amber-100 shadow-inner flex flex-col items-center">
                            <div className="p-3 bg-white rounded-2xl shadow-xl border border-slate-50">
                                {qrCode ? (
                                    <QRCode value={qrCode} size={200} />
                                ) : (
                                    <div className="w-[200px] h-[200px] flex items-center justify-center">
                                        <Loader2 className="animate-spin text-amber-500" size={40} />
                                    </div>
                                )}
                            </div>
                            <div className="mt-6 text-center">
                                <p className="text-xs font-black text-slate-800 uppercase italic">Scan with your WhatsApp</p>
                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter mt-1">Linked Devices {'>'} Link a Device</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full py-4 bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-[0.1em] transition-all flex items-center justify-center gap-2"
                        >
                            <RefreshCw size={16} /> Cancel & Reset
                        </button>
                    </div>
                )}

                {status === 'CONNECTED' && (
                    <div className="bg-emerald-50 rounded-2.5xl p-8 text-center space-y-6 border border-emerald-100">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-xl ring-8 ring-emerald-500/10">
                            <CheckCircle size={48} className="text-emerald-500" />
                        </div>
                        <div>
                            <h4 className="text-lg font-black text-emerald-900 uppercase italic">Session Active</h4>
                            <p className="text-[10px] text-emerald-600/70 font-bold uppercase tracking-widest mt-1 italic">Enterprise Gateway Synchronized</p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-left">
                            <div className="p-3 bg-white rounded-xl border border-emerald-100/50">
                                <p className="text-[8px] text-slate-400 font-bold uppercase">Uptime</p>
                                <p className="text-xs font-black text-emerald-700 uppercase italic">Optimal</p>
                            </div>
                            <div className="p-3 bg-white rounded-xl border border-emerald-100/50">
                                <p className="text-[8px] text-slate-400 font-bold uppercase">Node</p>
                                <p className="text-xs font-black text-emerald-700 uppercase italic">Verified</p>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="w-full py-4 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-lg shadow-red-500/10"
                        >
                            <Power size={18} /> Disconnect Gateway
                        </button>
                    </div>
                )}
            </div>

            <div className="mt-8 flex items-start gap-3 p-4 bg-slate-50 rounded-2xl">
                <AlertCircle size={16} className="text-slate-400 mt-0.5" />
                <p className="text-[9px] text-slate-500 font-medium leading-relaxed">
                    Connecting WhatsApp allows you to send automated certificates, scores, and updates directly to students. Ensure your phone remains connected to the internet for seamless node synchronization.
                </p>
            </div>
        </div>
    );
};

export default WhatsAppAdminControl;
