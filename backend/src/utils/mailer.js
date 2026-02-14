
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    },
    family: 4
});



export const sendRegistrationEmail = async (student) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn("Mailer suppressed: EMAIL_USER/PASS not configured.");
        return;
    }

    const mailOptions = {
        from: `"PIEDOCX Support" <${process.env.EMAIL_USER}>`,
        to: student.email,
        subject: 'Registration Successful - PIEDOCX Assessment',
        html: `
            <div style="font-family: sans-serif; padding: 20px; color: #333;">
                <h2 style="color: #2563eb;">Welcome to PIEDOCX!</h2>
                <p>Hello <b>${student.fullName}</b>,</p>
                <p>You have been successfully registered for the assessment platform.</p>
                <p><b>Your Student ID:</b> ${student.studentId}</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;"/>
                <p style="font-size: 12px; color: #666;">This is an automated message. Please do not reply.</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent to ${student.email}`);
    } catch (err) {
        console.error("❌ Mailer Error:", err);
    }
};

export const sendCertificateEmail = async (student, certificateId) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return;

    const mailOptions = {
        from: `"PIEDOCX Results" <${process.env.EMAIL_USER}>`,
        to: student.email,
        subject: 'Certificate Issued - PIEDOCX',
        html: `
            <div style="font-family: sans-serif; padding: 20px;">
                <h2 style="color: #059669;">Congratulations!</h2>
                <p>Your certificate for the assessment has been issued.</p>
                <p><b>Certificate ID:</b> ${certificateId}</p>
                <p>You can verify and download your certificate from your dashboard.</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (err) {
        console.error("Mailer Error:", err);
    }
};
