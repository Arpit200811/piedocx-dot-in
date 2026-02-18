import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import qrcode from 'qrcode-terminal';
import { getIO } from './socketService.js';
import puppeteer from 'puppeteer'; // Add this line

let client;
let isReady = false;

export const initializeWhatsApp = () => {
    console.log('Initializing WhatsApp Client...');

    client = new Client({
        authStrategy: new LocalAuth(),
        puppeteer: {
            executablePath: puppeteer.executablePath(), // Add this: Forces Puppeteer to use the installed browser
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
            ],
        }
    });



    client.on('qr', (qr) => {
        console.log('QR RECEIVED. Scan this with WhatsApp:');
        qrcode.generate(qr, { small: true });
        
        // Emit QR to Frontend via Socket.IO
        const io = getIO();
        if (io) {
            io.emit('whatsapp-qr', qr);
        }
    });

    client.on('ready', () => {
        console.log('WhatsApp Client is ready!');
        isReady = true;
        const io = getIO();
        if (io) io.emit('whatsapp-ready', true);
    });

    client.on('authenticated', () => {
        console.log('WhatsApp Authenticated');
        const io = getIO();
        if (io) io.emit('whatsapp-auth', true);
    });

    client.on('auth_failure', msg => {
        console.error('AUTHENTICATION FAILURE', msg);
    });

    client.on('disconnected', (reason) => {
        console.log('WhatsApp was logged out', reason);
        isReady = false;
        const io = getIO();
        if (io) io.emit('whatsapp-disconnected', reason);
        // Optional: Auto-reinitialize to show new QR
        client.destroy();
        client.initialize();
    });

    client.initialize();
};

export const outputWhatsAppStatus = () => isReady;

export const sendWhatsAppMessage = async (number, message) => {
    if (!isReady) {
        throw new Error('WhatsApp client is not ready. Please check server console for QR Code.');
    }

    try {
        // Format number: remove +, spaces, dashes. Ensure '91' prefix (or other country code)
        // Adjust logic based on your student data format. Assuming '91' for India + 10 digits.
        let formattedNumber = number.replace(/\D/g, ''); 
        
        if (formattedNumber.length === 10) {
            formattedNumber = '91' + formattedNumber;
        }

        const chatId = `${formattedNumber}@c.us`;
        
        // Check if number is registered on WhatsApp
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
