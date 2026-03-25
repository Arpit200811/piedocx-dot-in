import puppeteer from 'puppeteer';
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';

export const generateCertificatePDF = async (student, certificateId) => {
    let browser = null;
    try {
        // Generate QR Code as Base64
        const verifyUrl = `https://piedocx.in/#/verify/${certificateId || student.studentId}`;
        const qrCodeBase64 = await QRCode.toDataURL(verifyUrl, {
            margin: 1,
            color: {
                dark: '#0c4a6e',
                light: '#ffffff'
            }
        });

        // Current Date
        const currentDate = new Date().toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });

        const techLabel = (() => {
            const b = (student.branch || '').toUpperCase();
            const y = (student.year || '').toLowerCase();
            const isJunior = y.includes('1') || y.includes('2');
            if (b.includes('CS') || b.includes('IT') || b.includes('COMPUTER') || b.includes('INFORMATION') || b.includes('AI') || b.includes('DATA')) {
                return isJunior ? "Python With Gen-AI" : "Placement Drive Assessment";
            }
            if (b.includes('EC') || b.includes('EE') || b.includes('ME') || b.includes('IC') || b.includes('ELECTRONIC') || b.includes('MECHANICAL') || b.includes('ELECTRICAL') || b.includes('CIVIL') || b.includes('AUTO')) {
                return isJunior ? "Automation controlling Rover" : "Placement Drive Assessment";
            }
            return student.branch || 'Technical Assessment';
        })();

        const eventType = (student.year || '').toLowerCase().includes('3') || (student.year || '').toLowerCase().includes('4') ? "Placement Drive" : "Workshop";

        const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;900&family=Great+Vibes&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
            <style>
                body { margin: 0; padding: 0; font-family: 'Montserrat', sans-serif; background-color: #f8fbff; }
                .certificate-container {
                    width: 1123px;
                    height: 794px;
                    position: relative;
                    overflow: hidden;
                    background-color: #f8fbff;
                    color: #111;
                    box-sizing: border-box;
                }
                /* Background designs */
                .bg-accent-1 { position: absolute; top: 0; left: 0; width: 0; height: 0; border-top: 400px solid #0284c7; border-right: 480px solid transparent; z-index: 0; }
                .bg-accent-2 { position: absolute; top: 0; left: 0; width: 0; height: 0; border-top: 352px solid #0c4a6e; border-right: 422px solid transparent; z-index: 1; }
                .bg-accent-3 { position: absolute; bottom: 0; right: 0; width: 0; height: 0; border-bottom: 400px solid #0284c7; border-left: 480px solid transparent; z-index: 0; }
                .bg-accent-4 { position: absolute; bottom: 0; right: 0; width: 0; height: 0; border-bottom: 352px solid #0c4a6e; border-left: 422px solid transparent; z-index: 1; }
                
                .watermark { 
                    position: absolute; inset: 0; display: flex; items-center; justify-content: center; 
                    z-index: 0; opacity: 0.05; pointer-events: none; user-select: none;
                    font-size: 140px; font-weight: 900; color: #0c4a6e; letter-spacing: 0.2em; 
                    transform: rotate(-35deg); white-space: nowrap;
                    display: flex; align-items: center; justify-content: center;
                }

                .content { position: relative; z-index: 10; width: 100%; height: 100%; }
                
                .header-meta { position: absolute; top: 25px; left: 40px; color: white; z-index: 20; }
                .meta-item { display: flex; align-items: center; gap: 8px; font-size: 16px; margin-bottom: 2px; }
                .meta-label { font-weight: 900; opacity: 0.7; text-transform: uppercase; }
                .meta-value { font-weight: 700; font-family: monospace; }

                .branding { position: absolute; top: 40px; left: 0; right: 0; text-align: center; }
                .branding h2 { font-size: 18px; font-weight: 900; color: #0c4a6e; text-transform: uppercase; letter-spacing: 0.2em; margin: 6px 0 0 0; }
                
                .title { position: absolute; top: 150px; left: 0; right: 0; text-align: center; }
                .title h1 { font-size: 46px; font-weight: 700; letter-spacing: 1px; margin: 0; font-family: 'Playfair Display', serif; }

                .ministry { position: absolute; top: 210px; left: 0; right: 0; text-align: center; font-size: 14px; font-weight: 600; color: #444; }
                
                .presentation { position: absolute; top: 280px; left: 0; right: 0; text-align: center; font-size: 18px; letter-spacing: 1px; color: #555; text-transform: uppercase; }

                .student-name { position: absolute; top: 310px; left: 0; right: 0; text-align: center; font-size: 72px; font-family: 'Great Vibes', cursive; }

                .description { position: absolute; top: 425px; left: 110px; right: 110px; text-align: center; font-size: 19px; line-height: 1.4; color: #334155; }
                
                .tech-label { position: absolute; top: 535px; left: 0; right: 0; text-align: center; font-size: 20px; font-weight: 800; color: #0c4a6e; text-transform: uppercase; }

                .footer { position: absolute; bottom: 55px; left: 80px; right: 80px; display: flex; align-items: flex-end; justify-content: space-between; }
                .signature { text-align: center; }
                .sig-text { font-family: 'Great Vibes', cursive; font-size: 36px; color: #1e293b; transform: rotate(-3deg); margin-bottom: 5px; }
                .sig-line { width: 180px; height: 1px; background-color: #cbd5e1; margin: 0 auto; }
                .sig-title { font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-top: 4px; }

                .qr-box { background: white; padding: 8px; border-radius: 12px; border: 1px solid #f1f5f9; text-align: center; }
                .qr-box img { width: 75px; height: 75px; }
                .qr-text { font-size: 7px; font-weight: 900; color: #94a3b8; margin-top: 4px; text-transform: uppercase; }
            </style>
        </head>
        <body>
            <div class="certificate-container">
                <div class="bg-accent-1"></div>
                <div class="bg-accent-2"></div>
                <div class="bg-accent-3"></div>
                <div class="bg-accent-4"></div>
                
                <div class="watermark">PIEDOCX</div>

                <div class="content">
                    <div class="header-meta">
                        <div class="meta-item"><span class="meta-label">ID:</span><span class="meta-value">${student.studentId}</span></div>
                        <div class="meta-item"><span class="meta-label">DATE:</span><span class="meta-value">${currentDate}</span></div>
                    </div>

                    <div class="branding">
                        <h2 style="margin-top: 50px;">PIEDOCX TECHNOLOGIES PVT LTD</h2>
                    </div>

                    <div class="title">
                        <h1>CERTIFICATE OF COMPLETION</h1>
                    </div>

                    <div class="ministry">
                        Registered With Ministry of Corporate Affairs (Government of India)<br>
                        CIN No. U62099UP2025PTC226765 | <span style="font-weight: 900; color: #0c4a6e;">GSTIN: 09AAPCP9169H1ZK</span>
                    </div>

                    <div class="presentation">THIS CERTIFICATE IS PROUDLY PRESENTED TO</div>

                    <div class="student-name">${student.fullName}</div>

                    <div class="description">
                        From <span style="font-weight: 700; text-decoration: underline;">${student.college}</span><br>
                        has successfully completed 1 Day <span style="font-weight: 700; color: #111;">${eventType}</span> in ${techLabel}<br>
                        (${student.branch}, ${student.year}) With "A++" Grade.
                    </div>

                    <div class="tech-label">Technology: ${techLabel}</div>

                    <div class="footer">
                        <div class="signature">
                            <div class="sig-text">Savan Rai</div>
                            <div class="sig-line"></div>
                            <div class="sig-title">MANAGING DIRECTOR</div>
                        </div>

                        <div class="qr-box">
                            <img src="${qrCodeBase64}">
                            <div class="qr-text">Scan to Verify</div>
                        </div>
                    </div>
                </div>
            </div>
        </body>
        </html>
        `;

        browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();
        await page.setViewport({ width: 1123, height: 794, deviceScaleFactor: 2 });
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
        
        const pdfBuffer = await page.pdf({
            width: '1123px',
            height: '794px',
            printBackground: true,
            margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' }
        });

        return pdfBuffer;
    } catch (error) {
        console.error("PDF Generation Error:", error);
        throw error;
    } finally {
        if (browser) await browser.close();
    }
};
