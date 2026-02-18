import React, { useRef, useEffect, useState } from 'react';
import html2canvas from 'html2canvas';
import QRCode from "react-qr-code";
import { base_url } from '../utils/info';
import Swal from 'sweetalert2';

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

            const token = localStorage.getItem('studentToken');
            const response = await fetch(`${base_url}/api/certificate/send-email`, {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
               },
               body: JSON.stringify({
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

            // Wait for rendering to complete and fonts to settle
            await new Promise(r => setTimeout(r, 1000));

            const canvas = await html2canvas(certificateRef.current, {
               scale: 2,
               useCORS: true,
               allowTaint: true, // Mixed mode for local/remote reliability
               backgroundColor: '#f8fbff',
               logging: true,
               width: 1123,
               height: 794,
               onclone: (clonedDoc) => {
                  const el = clonedDoc.querySelector('.certificate-body');
                  if (el) {
                     el.style.transform = 'none';
                  }
               }
            });

            certificateRef.current.style.transform = originalStyle;

            // Use Blob for better browser compatibility
            canvas.toBlob((blob) => {
               if (!blob) throw new Error("Canvas to Blob failed");
               const url = URL.createObjectURL(blob);
               const link = document.createElement('a');
               link.download = `${student.name.replace(/\s+/g, '_')}_Certificate.png`;
               link.href = url;
               document.body.appendChild(link);
               link.click();
               document.body.removeChild(link);
               URL.revokeObjectURL(url);
            }, 'image/png', 1.0);

         } catch (err) {
            console.error("Certificate Download Error:", err);
            Swal.fire({
               icon: 'error',
               title: 'Download Limit or Error',
               text: 'Your browser might be blocking the file generation. Please try in Chrome or Desktop for best results.',
               footer: 'Error Details: ' + (err.message || 'Unknown code issue'),
               confirmButtonColor: '#0f172a'
            });
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
               className="relative shadow-2xl origin-center flex-shrink-0 overflow-hidden certificate-body"
               style={{
                  width: '1123px',
                  height: '794px',
                  backgroundColor: '#f8fbff',
                  transform: `scale(${scale})`,
                  fontFamily: "'Montserrat', sans-serif"
               }}
            >
               {/* BACKGROUND DESIGN - USING CSS BORDERS FOR MAXIMUM RELIABILITY */}
               <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
                  {/* Top Left Design */}
                  <div style={{ position: 'absolute', top: 0, left: 0, width: 0, height: 0, borderTop: '400px solid #0284c7', borderRight: '480px solid transparent' }}></div>
                  <div style={{ position: 'absolute', top: 0, left: 0, width: 0, height: 0, borderTop: '352px solid #0c4a6e', borderRight: '422px solid transparent' }}></div>
                  <div style={{ position: 'absolute', top: '40px', left: '120px', width: '500px', height: '40px', backgroundColor: 'rgba(56,189,248,0.4)', transform: 'rotate(45deg)', transformOrigin: 'left top' }}></div>

                  {/* Bottom Right Design */}
                  <div style={{ position: 'absolute', bottom: 0, right: 0, width: 0, height: 0, borderBottom: '400px solid #0284c7', borderLeft: '480px solid transparent' }}></div>
                  <div style={{ position: 'absolute', bottom: 0, right: 0, width: 0, height: 0, borderBottom: '352px solid #0c4a6e', borderLeft: '422px solid transparent' }}></div>
                  <div style={{ position: 'absolute', bottom: '40px', right: '120px', width: '500px', height: '40px', backgroundColor: 'rgba(56,189,248,0.4)', transform: 'rotate(45deg)', transformOrigin: 'right bottom' }}></div>

                  <div style={{ position: 'absolute', top: '10%', left: '32px', width: '2px', height: '80%', backgroundColor: '#cbd5e1' }}></div>
                  <div style={{ position: 'absolute', top: '10%', right: '32px', width: '2px', height: '80%', backgroundColor: '#cbd5e1' }}></div>
               </div>

               <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '60px', paddingLeft: '80px', paddingRight: '80px', textAlign: 'center', width: '100%', height: '100%', color: '#111' }}>

                  {/* TOP LEFT METADATA (ID & DATE) - COMPACT & HIGHER */}
                  <div style={{ position: 'absolute', top: '20px', left: '32px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 0, transformOrigin: 'top left', zIndex: 20 }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '15px', fontWeight: 900, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>ID:</span>
                        <span style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff', fontFamily: 'monospace' }}>{student.studentId}</span>
                     </div>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '15px', fontWeight: 900, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>DATE:</span>
                        <span style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff', fontFamily: 'monospace' }}>
                           {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                        </span>
                     </div>
                  </div>
                  {/* WATERMARK - ANTI-FORGERY LAYER */}
                  <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.05, overflow: 'hidden', userSelect: 'none', zIndex: 0 }}>
                     <div style={{ fontSize: '100px', fontWeight: 900, letterSpacing: '0.4em', transform: 'rotate(-45deg)', whiteSpace: 'nowrap', color: '#0c4a6e' }}>
                        PIEDOCX PIEDOCX PIEDOCX
                     </div>
                  </div>

                  {/* PIEDOCX LOGO & BRANDING */}
                  <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '8px', marginTop: '-10px' }}>
                     <img src="/Logo_Pie.png" crossOrigin="anonymous" alt="Piedocx Logo" style={{ height: '75px', width: 'auto', marginBottom: '4px' }} />
                     <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#0c4a6e', textTransform: 'uppercase', letterSpacing: '0.2em', lineHeight: 1 }}>
                        PIEDOCX TECHNOLOGIES PVT LTD
                     </h2>
                     <div style={{ width: '280px', height: '1.5px', background: 'linear-gradient(to right, transparent, rgba(12,74,110,0.3), transparent)', marginTop: '4px' }}></div>
                  </div>

                  <h1 style={{ position: 'relative', zIndex: 10, fontSize: '40px', fontWeight: 700, letterSpacing: '2px', marginBottom: '4px', lineHeight: 1, fontFamily: "'Playfair Display', serif" }}>
                     CERTIFICATE OF COMPLETION
                  </h1>
                  <p style={{ position: 'relative', zIndex: 10, fontSize: '15px', fontWeight: 600, lineHeight: 1.3, marginTop: '2px', color: '#444' }}>
                     Registered With Ministry of Corporate Affairs (Government of India)<br />
                     CIN No. U62099UP2025PTC226765 | <span style={{ fontWeight: 900, color: '#0c4a6e' }}>GSTIN: 09AAPCP9169H1ZK</span>
                  </p>
                  <div style={{ position: 'relative', zIndex: 10, width: '80px', height: '4px', background: 'linear-gradient(to right, transparent, #cbd5e1, transparent)', marginTop: '12px', marginBottom: '12px' }}></div>

                  <p style={{ position: 'relative', zIndex: 10, fontSize: '17px', letterSpacing: '2px', marginBottom: '8px', color: '#555', fontWeight: 500, textTransform: 'uppercase' }}>
                     THIS CERTIFICATE IS PROUDLY PRESENTED TO
                  </p>

                  <div style={{ position: 'relative', zIndex: 10, fontSize: '60px', color: '#000', marginBottom: '8px', lineHeight: 'tight', fontFamily: "'Great Vibes', cursive" }}>
                     {student.name}
                  </div>

                  <div style={{ position: 'relative', zIndex: 10, fontSize: '17px', lineHeight: 1.4, color: '#334155', maxWidth: '896px', paddingLeft: '16px', paddingRight: '16px' }}>
                     From <span style={{ fontWeight: 700, textDecoration: 'underline', textDecorationColor: '#cbd5e1', textUnderlineOffset: '4px' }}>{student.college} .</span><br />
                     has successfully completed {(() => {
                        const y = (student.year || '').toLowerCase();
                        if (y.includes('3') || y.includes('4')) return "1 Day";
                        return "1 Day";
                     })()} <span style={{ fontWeight: 700, color: '#111' }}>{(() => {
                        const y = (student.year || '').toLowerCase();
                        if (y.includes('3') || y.includes('4')) return "Placement Drive";
                        return "Workshop";
                     })()}</span> in {(() => {
                        if (student.technology && student.technology !== 'Default') return student.technology;

                        const b = (student.branch || '').toUpperCase();
                        const y = (student.year || '').toLowerCase();
                        const isJunior = y.includes('1') || y.includes('2');

                        if (b.includes('CS') || b.includes('IT') || b.includes('COMPUTER') || b.includes('INFORMATION') || b.includes('AI') || b.includes('DATA')) {
                           return isJunior ? "Python With Gen-AI" : "Placement Drive Assessment";
                        }

                        if (b.includes('EC') || b.includes('EE') || b.includes('ME') || b.includes('IC') || b.includes('ELECTRONIC') || b.includes('MECHANICAL') || b.includes('ELECTRICAL') || b.includes('CIVIL') || b.includes('AUTO')) {
                           return isJunior ? "Automation controlling Rover" : "Placement Drive Assessment";
                        }

                        return student.branch;
                     })()} ({student.branch}, {student.year}) With “A++” Grade.
                  </div>

                  <p style={{ position: 'relative', zIndex: 10, fontSize: '21px', fontWeight: 700, marginTop: '8px', color: '#0c4a6e', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                     {(() => {
                        if (student.technology && student.technology !== 'Default') return `Technology: ${student.technology}`;

                        const b = (student.branch || '').toUpperCase();
                        const y = (student.year || '').toLowerCase();
                        const isJunior = y.includes('1') || y.includes('2');

                        if (b.includes('CS') || b.includes('IT') || b.includes('COMPUTER') || b.includes('INFORMATION') || b.includes('AI') || b.includes('DATA')) {
                           return isJunior ? "Technology: Python With Gen-AI" : "Placement Drive Assessment";
                        }

                        if (b.includes('EC') || b.includes('EE') || b.includes('ME') || b.includes('IC') || b.includes('ELECTRONIC') || b.includes('MECHANICAL') || b.includes('ELECTRICAL') || b.includes('CIVIL') || b.includes('AUTO')) {
                           return isJunior ? "Technology: Automation controlling Rover" : "Placement Drive Assessment";
                        }

                        return `Branch: ${student.branch}`;
                     })()}
                  </p>

                  <p style={{ position: 'relative', zIndex: 10, fontSize: '14px', fontStyle: 'italic', marginTop: '4px', color: '#64748b', fontWeight: 500 }}>
                     “Code With Piedocx To Decode Your Future”
                  </p>

                  <div style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', gap: '20px', marginTop: '12px', marginBottom: '4px', opacity: 0.95, transform: 'scale(0.9)' }}>
                     <img src="https://upload.wikimedia.org/wikipedia/en/thumb/9/95/Digital_India_logo.svg/1200px-Digital_India_logo.svg.png" crossOrigin="anonymous" alt="Digital India" style={{ height: '36px', width: 'auto', objectFit: 'contain' }} />
                     <img src="/start.png" crossOrigin="anonymous" alt="Startup India" style={{ height: '32px', width: 'auto', objectFit: 'contain' }} />
                     <img src="/msme.png" crossOrigin="anonymous" alt="MSME" style={{ height: '36px', width: 'auto', objectFit: 'contain' }} />
                     <img src="/mca.png" crossOrigin="anonymous" alt="MCA" style={{ height: '40px', width: 'auto', objectFit: 'contain' }} />
                     <img src="/gem.png" crossOrigin="anonymous" alt="GeM" style={{ height: '32px', width: 'auto', objectFit: 'contain' }} />
                     <img src="/iso.png" crossOrigin="anonymous" alt="ISO" style={{ height: '36px', width: 'auto', objectFit: 'contain' }} />
                  </div>

                  {/* FOOTER AREA */}
                  <div style={{ position: 'absolute', bottom: '60px', left: '80px', right: '80px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', width: '963px', zIndex: 20 }}>
                     {/* Signature Section */}
                     <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ position: 'relative', height: '60px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', marginBottom: '4px', width: '200px' }}>
                           <span style={{ fontFamily: "'Great Vibes', cursive", fontSize: '36px', color: '#1e293b', transform: 'rotate(-3deg) translateY(8px)', opacity: 0.9, pointerEvents: 'none', userSelect: 'none' }}>Savan Rai</span>
                        </div>
                        <div style={{ width: '180px', height: '1px', backgroundColor: '#cbd5e1', marginBottom: '8px' }}></div>
                        <p style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', lineHeight: 1, marginTop: '4px' }}>MANAGING DIRECTOR</p>
                     </div>

                     {/* QR Code Section */}
                     <div style={{ backgroundColor: '#ffffff', padding: '10px', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
                        <div style={{ width: '95px', height: '95px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px', backgroundColor: '#ffffff', borderRadius: '8px' }}>
                           <QRCode
                              size={85}
                              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                              value={`https://piedocx.in/#/verify/${student.certificateId || student.studentId}`}
                              viewBox={`0 0 256 256`}
                              fgColor="#0c4a6e"
                           />
                        </div>
                        <p style={{ fontSize: '7px', fontWeight: 900, color: '#94a3b8', marginTop: '4px', textTransform: 'uppercase', textAlign: 'center', letterSpacing: '-0.02em' }}>Scan to Verify</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         <div className="my-10 flex gap-4">
            <button
               onClick={downloadCertificate}
               disabled={isDownloading}
               className={`${isDownloading ? 'bg-[#94a3b8] cursor-not-allowed' : 'bg-[#0f172a] hover:bg-blue-600'} text-white px-12 py-5 rounded-2xl font-black text-xl transition-all flex items-center gap-3 shadow-2xl`}
            >
               {isDownloading ? (
                  <div className="flex items-center gap-2">
                     <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                     GENERATING IMAGE...
                  </div>
               ) : 'DOWNLOAD CERTIFICATE'}
            </button>
         </div>

      </div >
   );
};

export default Certificate;
