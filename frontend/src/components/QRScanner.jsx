import React from 'react';
import { useNavigate } from 'react-router-dom';
import { QrReader } from 'react-qr-reader';
import { Camera, ArrowLeft, ShieldCheck, Zap } from 'lucide-react';
import BackButton from './BackButton';

const QRScanner = () => {
    const navigate = useNavigate();

    const handleScan = (result, error) => {
        if (result?.text) {
            try {
                const url = new URL(result.text);
                const id = url.pathname.split('/').pop();
                navigate(`/student/${id}`);
            } catch (e) {
                // If it's just an ID instead of a full URL
                if (result.text.length > 5) {
                    navigate(`/student/${result.text}`);
                }
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500 rounded-full blur-[120px]"></div>
            </div>

            {/* Header */}
            <div className="w-full max-w-md flex items-center justify-between mb-8 z-10">
                <BackButton className="bg-white/10 hover:bg-white/20 text-white border-white/10" />
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <ShieldCheck className="text-white w-5 h-5" />
                    </div>
                    <span className="font-black text-white tracking-tighter text-lg uppercase italic">
                        Node <span className="text-blue-500">Scanner</span>
                    </span>
                </div>
                <div className="w-10"></div> {/* Spacer */}
            </div>

            {/* Scanner Container */}
            <div className="relative w-full max-w-sm aspect-square bg-black/40 backdrop-blur-md rounded-[2.5rem] border border-white/10 p-2 shadow-2xl z-10 overflow-hidden">
                <div className="absolute inset-0 z-20 pointer-events-none border-[30px] border-black/20"></div>
                
                {/* Scanner Frame Corners */}
                <div className="absolute top-8 left-8 w-12 h-12 border-t-4 border-l-4 border-blue-500 rounded-tl-xl z-30"></div>
                <div className="absolute top-8 right-8 w-12 h-12 border-t-4 border-r-4 border-blue-500 rounded-tr-xl z-30"></div>
                <div className="absolute bottom-8 left-8 w-12 h-12 border-b-4 border-l-4 border-blue-500 rounded-bl-xl z-30"></div>
                <div className="absolute bottom-8 right-8 w-12 h-12 border-b-4 border-r-4 border-blue-500 rounded-br-xl z-30"></div>

                {/* Scanning Animation */}
                <div className="absolute inset-x-8 top-8 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-scan z-30"></div>

                <div className="w-full h-full rounded-[2rem] overflow-hidden">
                    <QrReader
                        constraints={{ facingMode: 'environment' }}
                        onResult={handleScan}
                        videoStyle={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        containerStyle={{ width: '100%', height: '100%' }}
                    />
                </div>
            </div>

            {/* Footer Guidance */}
            <div className="mt-10 text-center z-10 space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full">
                    <Zap className="text-amber-400 w-4 h-4" />
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Auto-Detection Active</span>
                </div>
                <h3 className="text-white font-bold">Align QR within frame</h3>
                <p className="text-slate-400 text-xs max-w-xs mx-auto">
                    Hold the certificate QR code steadily within the camera area to automatically verify credentials.
                </p>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes scan {
                    0% { top: 32px; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: calc(100% - 36px); opacity: 0; }
                }
                .animate-scan {
                    animation: scan 2.5s linear infinite;
                }
            `}} />
        </div>
    );
};

export default QRScanner;
