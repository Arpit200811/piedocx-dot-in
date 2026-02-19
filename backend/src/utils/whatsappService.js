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

const updateStatus = (newStatus, qr = null) => {
    // Only update QR if 30 seconds have passed, or if it's the first one
    // This stops the rapid refresh flickering
    const now = Date.now();
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
    console.log(`[WhatsApp] Status Update: ${status}`);
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
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
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
