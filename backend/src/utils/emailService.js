import nodemailer from 'nodemailer';

import EmailLog from '../models/EmailLog.js';

export const getTransporter = () => {
  const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS, EMAIL_SECURE } = process.env;

  if (!EMAIL_USER || !EMAIL_PASS) {
    throw new Error('Email credentials (EMAIL_USER or EMAIL_PASS) are missing in .env file');
  }

  // If host is provided, use custom SMTP (SendGrid, SES, Mailtrap etc.)
  if (EMAIL_HOST) {
    return nodemailer.createTransport({
      host: EMAIL_HOST,
      port: parseInt(EMAIL_PORT || "587"),
      secure: EMAIL_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });
  }

  // Default to Gmail if no host is specified
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });
};

export const sendCertificateEmail = async (studentEmail, studentName, certificateBase64) => {
  let status = 'sent';
  let errorMessage = '';
  try {
    const transporter = getTransporter();
    const mailOptions = {
      from: `"Piedocx Technologies" <${process.env.EMAIL_USER}>`,
      to: studentEmail,
      subject: `Congratulations ${studentName}! Your Certificate is Ready 🏆`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden;">
          <div style="background: #0ea5e9; padding: 20px; text-align: center; color: white;">
            <h1 style="margin: 0;">Piedocx Technologies</h1>
          </div>
          <div style="padding: 20px;">
            <h2 style="color: #0c4a6e;">Congratulations, ${studentName}!</h2>
            <p>We are thrilled to inform you that your registration is successful and your certificate of completion has been generated.</p>
            <p>Please find your digital certificate attached to this email.</p>
            <div style="background: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 15px; margin: 20px 0;">
              <p style="margin: 0; font-weight: bold; color: #0369a1;">Code With Piedocx To Decode Your Future</p>
            </div>
          </div>
        </div>
      `,
      attachments: [{
        filename: `${studentName.replace(/\s+/g, '_')}_Certificate.png`,
        content: certificateBase64.split("base64,")[1],
        encoding: 'base64'
      }]
    };
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    status = 'failed';
    errorMessage = error.message;
    return false;
  } finally {
    try {
      await EmailLog.create({
        recipient: studentEmail,
        subject: `Certificate for ${studentName}`,
        type: 'certificate',
        status,
        errorMessage
      });
    } catch (logError) {
      // Failed to log, but don't crash the main process
    }
  }
};

export const sendAdminOTP = async (adminEmail, otp) => {
  let status = 'sent';
  let errorMessage = '';
  try {
    const transporter = getTransporter();
    const mailOptions = {
      from: `"Piedocx Security" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      subject: `Your Admin Login OTP: ${otp}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 500px; margin: auto; padding: 40px; border: 1px solid #e2e8f0; border-radius: 24px; text-align: center;">
          <h2 style="color: #0f172a; font-weight: 800; font-size: 24px;">Admin Security Check</h2>
          <p style="color: #64748b; font-size: 16px;">You are attempting to log in to the Piedocx Admin Panel. Use the following OTP to verify your identity.</p>
          <div style="margin: 30px 0; background: #f8fafc; padding: 20px; border-radius: 16px; border: 2px solid #3b82f6;">
             <span style="font-family: monospace; font-size: 42px; font-weight: 800; color: #1e3a8a; letter-spacing: 12px; margin-left: 12px;">${otp}</span>
          </div>
          <p style="color: #ef4444; font-size: 12px; font-weight: bold;">This OTP will expire in 5 minutes.</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;">
          <p style="color: #94a3b8; font-size: 11px;">If you did not request this code, please ignore this email or change your password immediately.</p>
        </div>
      `
    };
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("OTP SMTP Error:", error);
    status = 'failed';
    errorMessage = error.message;
    return false;
  } finally {
    try {
      await EmailLog.create({
        recipient: adminEmail,
        subject: 'Admin Login OTP',
        type: 'otp',
        status,
        errorMessage
      });
    } catch (logError) {
      // Failed to log
    }
  }
};
