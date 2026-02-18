import { sendWhatsAppMessage, outputWhatsAppStatus } from '../utils/whatsappService.js';
import ExamStudent from '../models/ExamStudent.js';

export const sendBulkWhatsApp = async (req, res) => {
    const { ids } = req.body;

    if (!outputWhatsAppStatus()) {
        return res.status(503).json({ message: 'WhatsApp service is not ready. Please scan QR Code on server console.' });
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

            const certUrl = `${process.env.FRONTEND_URL || 'https://piedocx.in'}/#/verify/${student.certificateId}`;
            
            const message = `*Congratulations ${student.fullName}!* 🎓\n\n` +
                `We are thrilled to announce that you have successfully completed your training in *${student.technology || student.branch}*.\n\n` +
                `*Your Score:* ${student.score}/100 🏆\n` +
                `*Certificate Link:* ${certUrl}\n\n` +
                `We wish you all the best for your future endeavors!\n\n` +
                `_Regards,_\n` +
                `_Team Piedocx_`;

            const sent = await sendWhatsAppMessage(student.mobile, message);
            if (sent) successCount++;
            else failCount++;
            
            // Add a small delay to avoid spam detection
            await new Promise(r => setTimeout(r, 1000));
        }

        res.status(200).json({
            message: 'WhatsApp bulk process complete.',
            summary: {
                total: students.length,
                succeeded: successCount,
                failed: failCount
            }
        });

    } catch (error) {
        console.error('Bulk WhatsApp Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const checkWhatsAppStatus = (req, res) => {
    if (outputWhatsAppStatus()) {
        res.json({ connected: true, message: 'WhatsApp is connected.' });
    } else {
        res.json({ connected: false, message: 'WhatsApp is DISCONNECTED. Check server logs for QR.' });
    }
};
