import React, { useRef, useEffect, useState } from 'react';
import html2canvas from 'html2canvas';
import QRCode from "react-qr-code";
import { base_url } from '../utils/info';

const Certificate = ({ student, userEmail, autoSend }) => {
  const certificateRef = useRef(null);
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [mailSent, setMailSent] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth - 32;
        const targetWidth = 1123;
        const newScale = Math.min(containerWidth / targetWidth, 1);
        setScale(newScale);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    
    // Auto-send email mechanism
    if (autoSend && !mailSent) {
      setTimeout(() => {
          sendAutoEmail();
      }, 2000); // Wait for fonts/images to stabilize
    }

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sendAutoEmail = async () => {
    if (certificateRef.current && !mailSent) {
      try {
        const canvas = await html2canvas(certificateRef.current, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#f8fbff',
        });
        const base64Image = canvas.toDataURL('image/png');

        const response = await fetch(`${base_url}/api/certificate/send-email`, {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({
              email: userEmail,
              name: student.name,
              certificateImage: base64Image
           })
        });

        if (response.ok) {
           setMailSent(true);
        }
      } catch (err) {
        // console.error("❌ Failed to auto-send email:", err); // Removed as per instruction
      }
    }
  };

  const downloadCertificate = async () => {
    if (certificateRef.current && !isDownloading) {
      try {
        setIsDownloading(true);
        const originalStyle = certificateRef.current.style.transform;
        certificateRef.current.style.transform = 'none';
        
        // Wait for rendering to complete
        await new Promise(r => setTimeout(r, 500));

        const canvas = await html2canvas(certificateRef.current, {
          scale: 3,
          useCORS: true,
          backgroundColor: '#f8fbff',
          logging: false,
        });
        
        certificateRef.current.style.transform = originalStyle;
        const link = document.createElement('a');
        link.download = `${student.name.replace(/\s+/g, '_')}_Certificate.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (err) {
      } finally {
        setIsDownloading(false);
      }
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-full overflow-hidden">
      
      {/* Auto-email Toast Notification */}
      {mailSent && (
         <div className="bg-green-600 text-white px-6 py-2 rounded-full text-sm font-bold mb-4 animate-bounce shadow-lg">
            ✅ Certificate sent to your email!
         </div>
      )}

      <div 
        ref={containerRef} 
        className="w-full flex justify-center items-center p-4"
        style={{ minHeight: `${794 * scale}px` }}
      >
        <div 
          ref={certificateRef}
          className="relative bg-[#f8fbff] shadow-2xl origin-center flex-shrink-0 overflow-hidden"
          style={{ 
            width: '1123px', 
            height: '794px', 
            transform: `scale(${scale})`,
            fontFamily: "'Montserrat', sans-serif"
          }}
        >
          {/* BACKGROUND DESIGN */}
          <div className="absolute inset-0 z-0 pointer-events-none">
             <div className="absolute top-0 left-0 w-[480px] h-[400px]">
                <div className="absolute top-0 left-0 w-full h-full bg-[#0284c7]" style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}></div>
                <div className="absolute top-0 left-0 w-[88%] h-[88%] bg-[#0c4a6e]" style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}></div>
                <div className="absolute top-10 left-[120px] w-[500px] h-10 bg-[#38bdf8]/40 rotate-[45deg] origin-left"></div>
             </div>
             <div className="absolute bottom-0 right-0 w-[480px] h-[400px]">
                <div className="absolute bottom-0 right-0 w-full h-full bg-[#0284c7]" style={{ clipPath: 'polygon(100% 100%, 0 100%, 100% 0)' }}></div>
                <div className="absolute bottom-0 right-0 w-[88%] h-[88%] bg-[#0c4a6e]" style={{ clipPath: 'polygon(100% 100%, 0 100%, 100% 0)' }}></div>
                <div className="absolute bottom-10 right-[120px] w-[500px] h-10 bg-[#38bdf8]/40 rotate-[45deg] origin-right"></div>
             </div>
             <div className="absolute top-[10%] left-8 w-[2px] h-[80%] bg-[#cbd5e1]"></div>
             <div className="absolute top-[10%] right-8 w-[2px] h-[80%] bg-[#cbd5e1]"></div>
          </div>

          <div className="relative z-10 flex flex-col items-center pt-[60px] px-[80px] text-center w-full h-full text-[#111]">
            
            {/* TOP LEFT METADATA (ID & DATE) - COMPACT & HIGHER */}
            <div className="absolute top-5 left-8 text-left flex flex-col gap-0 origin-top-left z-20">
               <div className="flex items-center gap-2">
                  <span className="text-[15px] font-black text-white/60 uppercase tracking-tighter">ID:</span>
                  <span className="text-[15px] font-bold text-white font-mono">{student.studentId}</span>
               </div>
               <div className="flex items-center gap-2">
                  <span className="text-[15px] font-black text-white/60 uppercase tracking-tighter">DATE:</span>
                  <span className="text-[15px] font-bold text-white font-mono">
                     {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                  </span>
               </div>
            </div>

            <h1 className="text-[48px] font-bold tracking-[2px] mb-2 leading-none" style={{ fontFamily: "'Playfair Display', serif" }}>
               CERTIFICATE OF COMPLETION
            </h1>
            <p className="text-[18px] font-semibold leading-[1.5] mt-[10px] text-[#444]">
              Registered With Ministry of Corporate Affairs (Government of India)<br />
              CIN No. U62099UP2025PTC226765
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent my-10"></div>
            <p className="text-[20px] tracking-[2px] mb-5 text-[#555] font-medium uppercase">
               THIS CERTIFICATE IS PROUDLY PRESENTED TO
            </p>
            <div className="text-[72px] text-[#000] mb-[20px] leading-tight" style={{ fontFamily: "'Great Vibes', cursive" }}>
               {student.name}
            </div>
            <div className="text-[20px] leading-[1.6] text-slate-700 max-w-4xl">
               From <span className="font-bold underline decoration-slate-300 underline-offset-4">{student.college} .</span><br />
               has successfully completed {student.duration || "45 Days"} <span className="font-bold text-[#111]">Summer Training</span> in {student.branch} ({student.year}) With “A++” Grade.
            </div>
            <p className="text-[24px] font-bold mt-[15px] text-[#0c4a6e] uppercase tracking-widest">
               Branch: {student.branch}
            </p>
            <p className="text-[17px] italic mt-[10px] text-slate-500 font-medium">
               “Code With Piedocx To Decode Your Future”
            </p>

            {/* ACCREDITATIONS & LOGOS SECTION - COMPACT & PNG ONLY */}
            <div className="flex items-center gap-4 mt-2 mb-2 opacity-95 scale-90">
               <img crossOrigin="anonymous" src="https://upload.wikimedia.org/wikipedia/en/thumb/9/95/Digital_India_logo.svg/200px-Digital_India_logo.svg.png" alt="Digital India" className="h-9 w-auto object-contain" />
               <img src="/start.png" alt="Startup India" className="h-8 w-auto object-contain" />
               <img crossOrigin="anonymous" src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/MSME_Logo.png/300px-MSME_Logo.png" alt="MSME" className="h-9 w-auto object-contain" />
               <img crossOrigin="anonymous" src="https://upload.wikimedia.org/wikipedia/en/thumb/2/2e/Ministry_of_Corporate_Affairs_India.svg/300px-Ministry_of_Corporate_Affairs_India.svg.png" alt="MCA" className="h-9 w-auto object-contain" />
               <img src="/gem.png" alt="GeM" className="h-8 w-auto object-contain" />
               <img crossOrigin="anonymous" src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/ISO_9001-2015_%28EN%29.svg/200px-ISO_9001-2015_%28EN%29.svg.png" alt="ISO" className="h-9 w-auto object-contain" />
            </div>

            {/* FOOTER - Absolute Bottom 60px */}
            <div className="absolute bottom-[60px] left-[80px] right-[80px] flex items-end justify-between w-[calc(1123px-160px)]">
               <div className="flex flex-col items-center">
                  <div className="h-[40px] flex items-end justify-center mb-1">
                     <span className="font-['Great_Vibes'] text-4xl text-[#000] -rotate-6 transform translate-y-3">Savan Rai</span>
                  </div>
                  <div className="w-[180px] h-[1px] bg-[#ccc] mb-2"></div>
                  <p className="text-[18px] font-bold text-[#000]">Savan Rai</p>
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest leading-none mt-1">MANAGING DIRECTOR</p>
               </div>
               <div className="flex gap-12 items-center mb-2 translate-x-8">
                  <div className="w-20 h-20 rounded-full border-4 border-slate-100 flex items-center justify-center bg-white shadow-sm opacity-80">
                      <span className="text-[8px] font-black text-slate-300 text-center leading-none uppercase">Piedocx<br/>Official Seal</span>
                  </div>
               </div>
               <div className="bg-white p-2 border border-slate-100 rounded-lg shadow-sm">
                  <div className="w-[100px] h-[100px] flex items-center justify-center">
                     <QRCode 
                        size={90}
                        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                        value={`https://piedocx-dot-in-1.onrender.com/#/student/${student._id}`}
                        viewBox={`0 0 256 256`}
                     />
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="my-10 flex gap-4">
         <button 
           onClick={downloadCertificate}
           disabled={isDownloading}
           className={`${isDownloading ? 'bg-slate-400 cursor-not-allowed' : 'bg-[#0f172a] hover:bg-blue-600'} text-white px-12 py-5 rounded-2xl font-black text-xl transition-all flex items-center gap-3 shadow-2xl`}
         >
           {isDownloading ? (
              <div className="flex items-center gap-2">
                 <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                 GENERATING IMAGE...
              </div>
           ) : 'DOWNLOAD CERTIFICATE'}
         </button>
      </div>

    </div>
  );
};

export default Certificate;
