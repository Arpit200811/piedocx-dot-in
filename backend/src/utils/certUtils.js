
import crypto from 'crypto';
import QRCode from 'qrcode';


const SIGNING_SECRET = process.env.CERTIFICATE_SECRET || 'super-secure-cert-secret-2026';

export const generateCertificateSignature = (data) => {
    // Create a hash of critical data: StudentID + Course + Date + Score
    const payload = `${data.studentId}:${data.course}:${data.issueDate}:${data.score}`;
    return crypto.createHmac('sha256', SIGNING_SECRET).update(payload).digest('hex');
};

export const verifyCertificateSignature = (data, signature) => {
    const expected = generateCertificateSignature(data);
    return expected === signature;
};

export const generateQR = async (verificationUrl) => {
    try {
        return await QRCode.toDataURL(verificationUrl);
    } catch (err) {
        console.error('QR Generation Error', err);
        return null;
    }
};

export const generateCertificateID = (year) => {
    // High-entropy unique ID: PDCX-2026-XXXX-XXXX
    // Format: Year - Timestamp(hex) - Random(hex)
    const timestamp = Date.now().toString(16).toUpperCase().slice(-4);
    const random = crypto.randomBytes(2).toString('hex').toUpperCase();
    return `PDCX-${year}-${timestamp}-${random}`;
};
