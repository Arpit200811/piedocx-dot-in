import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import { getIO } from './socketService.js';
import fs from 'fs';
import path from 'path';

let client = null;
let status = 'DISCONNECTED'; 
let lastQr = null; 
let lastQrTime = 0;

export const getWhatsAppStatus = () => ({ status, qr: lastQr });

let lastLoggedStatus = null;
let lastLoggedTime = 0;

const updateStatus = (newStatus, qr = null) => {
    const now = Date.now();
    
    // QR Throttling (Keep it for Internal Logic)
    if (qr && (now - lastQrTime < 30000)) {
        return; 
    }

    status = newStatus;
    if (qr) {
        lastQr = qr;
        lastQrTime = now;
    }

    const io = getIO();
    if (io) {
        io.emit('whatsapp-status', { status, qr: lastQr });
    }

    // LOGGING REDUCTION: Only log if status changed, or if it's QR_READY and 5 mins passed
    const shouldLog = (newStatus !== lastLoggedStatus) || 
                      (newStatus === 'QR_READY' && (now - lastLoggedTime > 300000));

    if (shouldLog) {
        console.log(`[WhatsApp] Status: ${status}${newStatus === 'QR_READY' ? ' (Check Admin Panel for QR)' : ''}`);
        lastLoggedStatus = newStatus;
        lastLoggedTime = now;
    }
};

export const initializeWhatsApp = async (isAuto = false) => {
    if (status === 'CONNECTED' || status === 'INITIALIZING') {
        return { success: false, message: 'Process already active.' };
    }

    const sessionExists = fs.existsSync('./.wwebjs_auth/session-admin-auth');
    if (isAuto && !sessionExists) return { success: false };

    if (client) {
        try { await client.destroy(); } catch (e) {}
        client = null;
    }

    updateStatus('INITIALIZING');

    client = new Client({
        authStrategy: new LocalAuth({
            clientId: 'admin-auth',
            dataPath: './.wwebjs_auth'
        }),
        puppeteer: {
            headless: true,
            args: [
                '--no-sandbox', 
                '--disable-setuid-sandbox', 
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--no-zygote'
            ],
            timeout: 60000
        },
        webVersionCache: {
            type: 'remote',
            remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html',
        }
    });

    client.on('qr', (qr) => {
        updateStatus('QR_READY', qr);
    });

    client.on('ready', () => {
        updateStatus('CONNECTED');
        lastQr = null; // Clear QR once connected
        console.log('✅ WhatsApp Hub Synchronized!');
    });

    client.on('auth_failure', () => {
        updateStatus('DISCONNECTED');
        console.error('❌ Auth Failed');
    });

    client.on('disconnected', async () => {
        updateStatus('DISCONNECTED');
        client = null;
    });

    try {
        await client.initialize();
        return { success: true, message: 'Init started.' };
    } catch (err) {
        updateStatus('DISCONNECTED');
        return { success: false, message: err.message };
    }
};

export const logoutWhatsApp = async () => {
    try {
        if (client) {
            await client.logout();
            await client.destroy();
        }
    } catch (e) {} finally {
        client = null;
        updateStatus('DISCONNECTED');
        const sessionPath = path.resolve('./.wwebjs_auth/session-admin-auth');
        if (fs.existsSync(sessionPath)) fs.rmSync(sessionPath, { recursive: true, force: true });
        return true;
    }
};

export const sendWhatsAppMessage = async (number, message) => {
    if (status !== 'CONNECTED' || !client) throw new Error('Offline');
    let num = number.replace(/\D/g, '');
    if (num.length === 10) num = '91' + num;
    await client.sendMessage(`${num}@c.us`, message);
    return true;
};

/**
 * FEATURE #5: Automated Result Dispatch (WhatsApp)
 */
export const broadcastResultLink = async (students, testTitle) => {
    if (status !== 'CONNECTED' || !client) return { success: false, message: 'WhatsApp Service is Offline.' };

    let successCount = 0;
    for (const student of students) {
        try {
            if (!student.mobile) continue;
            
            const message = `🎓 *Dear ${student.fullName}*,
Congratulations! Your results for *${testTitle}* have been published.

✅ *Score:* ${student.score}
🏆 *Check Result & Certificate:* https://piedocx.in/student-dashboard/results

_Best Regards,_
*Piedocx Team*`;
            
            await sendWhatsAppMessage(student.mobile, message);
            successCount++;
            
            // Anti-spam delay to prevent WhatsApp banning
            await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (err) {
            console.error(`Failed to send WhatsApp to ${student.email}:`, err.message);
        }
    }
    return { success: true, count: successCount };
};

