import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import qrcode from 'qrcode-terminal';
import { getIO } from './socketService.js';

let client;
let isReady = false;

export const initializeWhatsApp = () => {
    console.log('Initializing WhatsApp Client...');

    client = new Client({
        authStrategy: new LocalAuth({
            dataPath: './.wwebjs_auth' // session persist
        }),
        puppeteer: {
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--single-process',
                '--disable-gpu'
            ]
        }
    });

    // 🔥 QR Event
    client.on('qr', (qr) => {
        console.log('QR RECEIVED. Scan this with WhatsApp:');
        qrcode.generate(qr, { small: true });

        const io = getIO();
        if (io) {
            io.emit('whatsapp-qr', qr);
        }
    });

    // ✅ Ready
    client.on('ready', () => {
        console.log('WhatsApp Client is ready!');
        isReady = true;

        const io = getIO();
        if (io) io.emit('whatsapp-ready', true);
    });

    // ✅ Authenticated
    client.on('authenticated', () => {
        console.log('WhatsApp Authenticated');

        const io = getIO();
        if (io) io.emit('whatsapp-auth', true);
    });

    // ❌ Auth Failure
    client.on('auth_failure', msg => {
        console.error('AUTHENTICATION FAILURE:', msg);
        isReady = false;
    });

    // 🔄 Disconnect Handling (Auto Reconnect)
    client.on('disconnected', (reason) => {
        console.log('WhatsApp was logged out:', reason);
        isReady = false;

        const io = getIO();
        if (io) io.emit('whatsapp-disconnected', reason);

        setTimeout(() => {
            try {
                client.destroy();
                client.initialize();
            } catch (err) {
                console.error("Reinitialize Error:", err);
            }
        }, 5000);
    });

    client.initialize();
};

// 📊 Status
export const outputWhatsAppStatus = () => isReady;

// 📩 Send Message
export const sendWhatsAppMessage = async (number, message) => {
    if (!isReady) {
        throw new Error('WhatsApp client is not ready. Please scan QR first.');
    }

    try {
        let formattedNumber = number.replace(/\D/g, '');

        // India default format
        if (formattedNumber.length === 10) {
            formattedNumber = '91' + formattedNumber;
        }

        const chatId = `${formattedNumber}@c.us`;

        const isRegistered = await client.isRegisteredUser(chatId);

        if (!isRegistered) {
            console.warn(`Number ${number} is not registered on WhatsApp.`);
            return false;
        }

        await client.sendMessage(chatId, message);
        console.log(`Message sent to ${formattedNumber}`);
        return true;

    } catch (error) {
        console.error('Error sending WhatsApp message:', error);
        return false;
    }
};
