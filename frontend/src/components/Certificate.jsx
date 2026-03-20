import React, { useRef, useEffect, useState } from 'react';
import html2canvas from '../utils/html2canvasSafe';
import QRCode from "react-qr-code";
import { base_url } from '../utils/info';
import api from '../utils/api';
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
            // Wait for fonts/rendering stability
            await new Promise(r => setTimeout(r, 1000));

            const canvas = await html2canvas(certificateRef.current, {
               scale: 2, // 2 is enough for email
               useCORS: true,
               allowTaint: false,
               backgroundColor: '#f8fbff',
               width: 1123,
               height: 794,
               scrollX: 0,
               scrollY: 0,
               x: 0,
               y: 0,
               onclone: (clonedDoc) => {
                  const el = clonedDoc.querySelector('.certificate-body');
                  if (el) {
                     el.style.transform = 'none';
                     el.style.margin = '0';
                     el.style.position = 'fixed';
                     el.style.top = '0';
                     el.style.left = '0';
                  }
                }
            });
            const base64Image = canvas.toDataURL('image/png');

            const token = localStorage.getItem('studentToken');
            const response = await api.post('/api/certificate/send-email', {
               certificateImage: base64Image
            });

            if (response) {
               setMailSent(true);
            }
         } catch (err) {
            console.error("Auto-email Error:", err);
         }
      }
   };


   const downloadCertificate = async () => {
      if (!certificateRef.current || isDownloading) return;

      try {
         setIsDownloading(true);

         // Wait for fonts to be ready
         if (document.fonts) {
            await document.fonts.ready;
         }
         // Give browser a moment to settle layout
         await new Promise((r) => setTimeout(r, 800));

         const canvas = await html2canvas(certificateRef.current, {
            scale: 2.2, // Balanced quality and memory (prevents mobile crash)
            useCORS: true,
            allowTaint: false,
            backgroundColor: "#ffffff",
            width: 1123,
            height: 794,
            windowWidth: 1123,
            windowHeight: 794,
            scrollX: 0,
            scrollY: 0,
            onclone: (clonedDoc) => {
               const el = clonedDoc.querySelector('.certificate-body');
               if (el) {
                  // Hard reset transforms in the clone for perfect capture
                  el.style.transform = 'none';
                  el.style.webkitTransform = 'none';
                  el.style.margin = '0';
                  el.style.position = 'fixed';
                  el.style.top = '0';
                  el.style.left = '0';
               }
            }
         });

         const base64Image = canvas.toDataURL("image/png", 1.0);
         const link = document.createElement("a");
         link.href = base64Image;
         link.download = `${student.name.replace(/\s+/g, "_")}_Certificate.png`;
         document.body.appendChild(link);
         link.click();
         document.body.removeChild(link);
      } catch (error) {
         console.error("Download failure:", error);
         Swal.fire({
            icon: "error",
            title: "Download Error",
            text: "Please try again.",
            confirmButtonColor: "#0f172a"
         });
      } finally {
         setIsDownloading(false);
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
               className="relative shadow-2xl flex-shrink-0 overflow-hidden certificate-body"
               style={{
                  width: '1123px',
                  height: '794px',
                  backgroundColor: '#f8fbff',
                  transform: `scale(${scale})`,
                  transformOrigin: 'center center',
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

                  {/* CENTRAL WATERMARK TEXT */}
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 0, opacity: 0.05, pointerEvents: 'none', userSelect: 'none' }}>
                     <span style={{ fontSize: '140px', fontWeight: 900, color: '#0c4a6e', letterSpacing: '0.2em', transform: 'rotate(-35deg)', whiteSpace: 'nowrap' }}>
                        PIEDOCX
                     </span>
                  </div>
               </div>

               <div style={{ position: 'relative', zIndex: 10, width: '100%', height: '100%', color: '#111' }}>

                  {/* 1. TOP LEFT METADATA */}
                  <div style={{ position: 'absolute', top: '25px', left: '40px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '2px', zIndex: 20 }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '16px', fontWeight: 900, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}>ID:</span>
                        <span style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', fontFamily: 'monospace' }}>{student.studentId}</span>
                     </div>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '16px', fontWeight: 900, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}>DATE:</span>
                        <span style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', fontFamily: 'monospace' }}>
                           {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                        </span>
                     </div>
                  </div>

                  {/* 2. BRANDING SECTION */}
                  <div style={{ position: 'absolute', top: '40px', left: '0', right: '0', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10 }}>
                     <img src="/Logo_Pie.png" crossOrigin="anonymous" alt="Piedocx Logo" style={{ height: '70px', width: 'auto', marginBottom: '6px' }} />
                     <h2 style={{ fontSize: '18px', fontWeight: 900, color: '#0c4a6e', textTransform: 'uppercase', letterSpacing: '0.2em', margin: 0 }}>
                        PIEDOCX TECHNOLOGIES PVT LTD
                     </h2>
                     <div style={{ width: '250px', height: '1.5px', background: 'linear-gradient(to right, transparent, rgba(12,74,110,0.3), transparent)', marginTop: '6px' }}></div>
                  </div>

                  {/* 3. MAIN TITLE */}
                  <div style={{ position: 'absolute', top: '150px', left: '0', right: '0', textAlign: 'center', zIndex: 10 }}>
                     <h1 style={{ fontSize: '46px', fontWeight: 700, letterSpacing: '1px', margin: 0, lineHeight: 1, fontFamily: "'Playfair Display', serif" }}>
                        CERTIFICATE OF COMPLETION
                     </h1>
                  </div>

                  {/* 4. MINISTRY DETAILS */}
                  <div style={{ position: 'absolute', top: '210px', left: '0', right: '0', textAlign: 'center', zIndex: 10 }}>
                     <p style={{ fontSize: '14px', fontWeight: 600, margin: 0, color: '#444', lineHeight: 1.4 }}>
                        Registered With Ministry of Corporate Affairs (Government of India)<br />
                        CIN No. U62099UP2025PTC226765 | <span style={{ fontWeight: 900, color: '#0c4a6e' }}>GSTIN: 09AAPCP9169H1ZK</span>
                     </p>
                  </div>

                  {/* 5. DECORATIVE DIVIDER */}
                  <div style={{ position: 'absolute', top: '260px', left: '50%', transform: 'translateX(-50%)', width: '80px', height: '3px', background: 'linear-gradient(to right, transparent, #cbd5e1, transparent)', zIndex: 10 }}></div>

                  {/* 6. PRESENTATION TEXT */}
                  <div style={{ position: 'absolute', top: '280px', left: '0', right: '0', textAlign: 'center', zIndex: 10 }}>
                     <p style={{ fontSize: '18px', letterSpacing: '1px', margin: 0, color: '#555', fontWeight: 500, textTransform: 'uppercase' }}>
                        THIS CERTIFICATE IS PROUDLY PRESENTED TO
                     </p>
                  </div>

                  {/* 7. STUDENT NAME (HARD LOCKED HEIGHT) */}
                  <div style={{ position: 'absolute', top: '310px', left: '0', right: '0', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                     <span style={{ fontSize: '72px', color: '#000', fontFamily: "'Great Vibes', cursive", lineHeight: 1 }}>
                        {student.name}
                     </span>
                  </div>

                  {/* 8. MAIN DESCRIPTION */}
                  <div style={{ position: 'absolute', top: '425px', left: '110px', right: '110px', textAlign: 'center', zIndex: 10 }}>
                     <p style={{ fontSize: '19px', lineHeight: '1.4', color: '#334155', margin: 0 }}>
                        From <span style={{ fontWeight: 700, textDecoration: 'underline', textDecorationColor: '#cbd5e1' }}>{student.college} .</span><br />
                        has successfully completed {(() => {
                           const y = (student.year || '').toLowerCase();
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
                        })()} ({student.branch}, {student.year}) With "A++" Grade.
                     </p>
                  </div>

                  {/* 9. TECHNOLOGY LABEL */}
                  <div style={{ position: 'absolute', top: '535px', left: '0', right: '0', textAlign: 'center', zIndex: 10 }}>
                     <h3 style={{ fontSize: '20px', fontWeight: 800, margin: 0, color: '#0c4a6e', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
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
                     </h3>
                  </div>

                  {/* 10. MOTIVATIONAL QUOTE */}
                  <div style={{ position: 'absolute', top: '575px', left: '0', right: '0', textAlign: 'center', zIndex: 10 }}>
                     <p style={{ fontSize: '15px', fontStyle: 'italic', margin: 0, color: '#64748b', fontWeight: 500 }}>
                        "Code With Piedocx To Decode Your Future"
                     </p>
                  </div>

                  {/* 11. PARTNER LOGOS */}
                  <div style={{ position: 'absolute', top: '608px', left: '0', right: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', zIndex: 10, transform: 'scale(0.85)' }}>
                     <img src="/digital_india.png" crossOrigin="anonymous" alt="Digital India" style={{ height: '36px', width: 'auto' }} />
                     <img src="/start.png" crossOrigin="anonymous" alt="Startup India" style={{ height: '32px', width: 'auto' }} />
                     <img src="/msme.png" crossOrigin="anonymous" alt="MSME" style={{ height: '36px', width: 'auto' }} />
                     <img src="/mca.png" crossOrigin="anonymous" alt="MCA" style={{ height: '40px', width: 'auto' }} />
                     <img src="/gem.png" crossOrigin="anonymous" alt="GeM" style={{ height: '32px', width: 'auto' }} />
                     <img src="/iso.png" crossOrigin="anonymous" alt="ISO" style={{ height: '36px', width: 'auto' }} />
                  </div>

                  {/* 12. FOOTER (SIGNATURE & QR) */}
                  <div style={{ position: 'absolute', bottom: '55px', left: '80px', right: '80px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', zIndex: 20 }}>
                     <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ height: '50px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', marginBottom: '4px', width: '200px' }}>
                           <span style={{ fontFamily: "'Great Vibes', cursive", fontSize: '36px', color: '#1e293b', transform: 'rotate(-3deg) translateY(5px)' }}>Savan Rai</span>
                        </div>
                        <div style={{ width: '180px', height: '1px', backgroundColor: '#cbd5e1' }}></div>
                        <p style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '4px', margin: 0 }}>MANAGING DIRECTOR</p>
                     </div>

                     <div style={{ backgroundColor: '#ffffff', padding: '8px', borderRadius: '12px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                        <QRCode
                           size={75}
                           style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                           value={`${window.location.origin}/#/verify/${student.certificateId || student.studentId}`}
                           viewBox={`0 0 256 256`}
                           fgColor="#0c4a6e"
                        />
                        <p style={{ fontSize: '7px', fontWeight: 900, color: '#94a3b8', marginTop: '4px', textTransform: 'uppercase', textAlign: 'center', margin: 0 }}>Scan to Verify</p>
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

      </div>
   );
};

export default Certificate;
