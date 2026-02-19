import { sendWhatsAppMessage, getWhatsAppStatus, logoutWhatsApp, initializeWhatsApp } from '../utils/whatsappService.js';
import ExamStudent from '../models/ExamStudent.js';

export const sendBulkWhatsApp = async (req, res) => {
    const { ids } = req.body;
    const { status } = getWhatsAppStatus();

    if (status !== 'CONNECTED') {
        return res.status(503).json({ 
            message: 'WhatsApp connection lost due to server reset. Please click "Initialize Connection" in Admin Panel.',
            currentStatus: status 
        });
    }

    if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ message: 'No students selected.' });
    }

    try {
        const students = await ExamStudent.find({ _id: { $in: ids } });
        let successCount = 0;
        let failCount = 0;

        for (const student of students) {
            if (!student.mobile) {
                failCount++;
                continue;
            }

            const branch = (student.technology || student.branch || '').toUpperCase();
            const yearNum = parseInt(student.year);
            const isSenior = yearNum === 3 || yearNum === 4;
            
            const baseUrl = process.env.FRONTEND_URL || 'https://piedocx.in';
            const certUrl = `${baseUrl}/#/verify/${student.certificateId}`;
            
            // 1. Certificate Completion Header (Common for all)
            let message = `🎓 *Congratulations ${student.fullName}!* 🎓\n\n` +
                `We are thrilled to announce that you have successfully completed your one day workshop training in *${student.technology || student.branch}*.\n` +
                `🏆 *Your Score:* ${student.score}/100\n` +
                `🔗 *Certificate Link:* ${certUrl}\n\n` +
                `We wish you all the best for your future endeavors! 🚀\n\n` +
                `━━━━━━━━━━━━━━━━━━━\n\n`;

            // 2. Branch Specific Offer Content
            const isCSIT = /CS|IT|COMPUTER|SOFTWARE|DATA|MACHINE|AI/i.test(branch);
            const isECEE = /EC|EE|ELECTR|INSTRUM|COMMU/i.test(branch);

            if (isCSIT) {
                if (isSenior) {
                    message += `💼 *PREPARE FOR PLACEMENT DRIVES WITH PIEDOCX!* 💼\n\n` +
                        `Hey Final Year Techie! 🚀\n` +
                        `The industry is looking for *Product-Ready Developers*, not just students. Transition from learning to earning with our Placement-Focused Mastery Program.\n\n` +
                        `🔥 *Senior Career Tracks:*\n` +
                        `✅ *Advanced MERN & Next.js* — Crack technical rounds of top MNCs\n` +
                        `✅ *DS & Algorithms Specialization* — Master the core of FAANG interviews\n` +
                        `✅ *Full-Cycle DevOps* — Essential for high-package Roles\n\n` +
                        `🎓 *SENIOR PLACEMENT PACKAGE:*\n` +
                        `🚀 Direct Referrals to our hiring partners\n` +
                        `📝 Expert Resume Reviews & LinkedIn Optimization\n` +
                        `💬 Mock Interviews with Industry Experts\n\n` +
                        `🔗 *Jumpstart Your Career:* ${baseUrl}/register\n\n` +
                        `⏳ *Final Batch for the current Placement Season — Register Today!*`;
                } else {
                    message += `🚀 *MASTER THE FUTURE OF AI & MODERN TECH WITH PIEDOCX!* 🚀\n\n` +
                        `Hey Engineer 🛠️\n` +
                        `Theory builds knowledge — but *building real-world systems builds real developers*. Step beyond classrooms and start working on industry-level AI & Modern technologies with Piedocx.\n\n` +
                        `🔥 *Specialized Industrial Tracks:*\n` +
                        `✅ *Artificial Intelligence & ML* — Neural networks & predictive analytics\n` +
                        `✅ *Modern Web Stack (MERN/Next.js)* — Building for the next billion users\n` +
                        `✅ *Cyber Security & DevOps* — Automating cloud deployments\n\n` +
                        `🎓 *WHAT’S INCLUDED IN YOUR TRAINING:*\n` +
                        `🎁 Special 30% Student Discount for early birds\n` +
                        `📜 ISO-Certified Internship Certificate\n` +
                        `💼 Placement Support for Product-Based Tech Roles\n\n` +
                        `🚀 Build. Innovate. Engineer the Future.\n\n` +
                        `🔗 *Secure Your Spot Now:* ${baseUrl}/register\n\n` +
                        `⏳ *Limited Seats Available — Join the next generation of innovators!*`;
                }
            } else if (isECEE) {
                if (isSenior) {
                    message += `⚙️ *DOMINATE THE CORE INDUSTRY PLACEMENTS!* ⚙️\n\n` +
                        `Attention Final Year Engineer! 🛠️\n` +
                        `Core companies look for hands-on expertise in *Automation, EV & IoT*. Get the technical edge required to crack technical rounds in top manufacturing & tech firms.\n\n` +
                        `🔥 *Senior Career Tracks:*\n` +
                        `✅ *I-IoT 4.0 Pro* — Master industrial sensor networks and cloud integration\n` +
                        `✅ *EV Design Specialist* — Deep dive into BMS, Motor Control & EV Testing\n` +
                        `✅ *Advanced Robotics* — Expert-level control with ARM & Industrial ROS\n\n` +
                        `🎓 *JOB READINESS PROGRAM:*\n` +
                        `🛠️ Hand-on practice on Industry-Grade Hardware Kits\n` +
                        `📜 Internship Certificate + Live Project Experience\n` +
                        `🤝 Direct Placement Drives in Core Electronic Companies\n\n` +
                        `🔗 *Register for Placement Drive:* ${baseUrl}/register\n\n` +
                        `⏳ *Exclusive for 3rd & Final Year Students — Limited Entries!*`;
                } else {
                    message += `⚡ *MASTER THE FUTURE OF HARDWARE & IoT WITH PIEDOCX!* ⚡\n\n` +
                        `Hey Engineer 🛠️\n` +
                        `Theory builds knowledge — but *hands-on hardware experience builds real engineers*. Step beyond classrooms and start working on industry-level technologies with Piedocx.\n\n` +
                        `🔥 *Specialized Industrial Tracks:*\n` +
                        `✅ *Industrial IoT 4.0* — Smart sensors, automation & cloud data logging\n` +
                        `✅ *Robotics & Embedded Systems* — Practical learning with ARM & ROS\n` +
                        `✅ *EV Technology* — BMS systems, motor controllers & EV design\n\n` +
                        `🎓 *WHAT’S INCLUDED IN YOUR TRAINING:*\n` +
                        `📦 Free Hardware Kits for real hands-on practice\n` +
                        `📜 ISO-Certified Internship Certificate\n` +
                        `💼 Placement Support for Core Engineering Roles\n\n` +
                    `🚀 Build. Innovate. Engineer the Future.\n\n` +
                        `🔗 *Secure Your Hardware Kit:* ${baseUrl}/register\n\n` +
                        `⏳ *Limited Seats Available — Join the next generation of innovators!*`;
                }
            } else {
                // Fallback
                message += `🚀 *STEP INTO THE FUTURE OF INDUSTRY 4.0!* 🚀\n\n` +
                    `Upgrade your career with Piedocx Industry Certified Trainings. Master technologies that matter in the real world.\n\n` +
                    `📜 ISO-Certified Certificates\n` +
                    `💼 ${isSenior ? 'Direct Placement Support' : 'Industry Internship'}\n` +
                    `🎁 Special Student Discounts\n\n` +
                    `🔗 *Register Now:* ${baseUrl}/register`;
            }

            message += `\n\n*Regards,*\n*Team Piedocx*`;

            const sent = await sendWhatsAppMessage(student.mobile, message);
            if (sent) successCount++;
            else failCount++;
            
            await new Promise(r => setTimeout(r, 1200)); // Rate limiting
        }

        res.status(200).json({
            message: 'WhatsApp process complete.',
            summary: { total: students.length, succeeded: successCount, failed: failCount }
        });

    } catch (error) {
        console.error('Bulk WhatsApp Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const checkWhatsAppStatus = (req, res) => {
    const { status, qr } = getWhatsAppStatus();
    res.json({ status, qr, connected: status === 'CONNECTED' });
};

export const manualLogout = async (req, res) => {
    try {
        const success = await logoutWhatsApp();
        res.json({ success, message: success ? 'Logged out successfully.' : 'Logout failed.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const manualConnect = async (req, res) => {
    try {
        const result = await initializeWhatsApp();
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
