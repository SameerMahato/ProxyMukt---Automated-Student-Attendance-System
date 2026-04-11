import nodemailer from 'nodemailer';

// Create reusable transporter
let transporter = null;

const initializeTransporter = () => {
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER) {
    console.log('⚠️  Email service not configured. Emails will not be sent.');
    return null;
  }

  try {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT || 587,
      secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    console.log('✅ Email service initialized');
    return transporter;
  } catch (error) {
    console.error('❌ Failed to initialize email service:', error.message);
    return null;
  }
};

/**
 * Send email notification
 */
export const sendEmail = async (to, subject, html, text = '') => {
  try {
    if (!transporter) {
      transporter = initializeTransporter();
    }

    if (!transporter) {
      console.log('Email not sent - service not configured');
      return false;
    }

    const mailOptions = {
      from: `"ProxyMukt Attendance" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text: text || subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    return false;
  }
};

/**
 * Send session started email
 */
export const sendSessionStartedEmail = async (userEmail, userName, className, sessionTitle) => {
  const subject = `🎓 Class Started: ${className}`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎓 Class Started!</h1>
        </div>
        <div class="content">
          <p>Hi ${userName},</p>
          <p><strong>${className}</strong> session has started!</p>
          <p><strong>Session:</strong> ${sessionTitle}</p>
          <p>Join now to mark your attendance. Don't forget to scan the QR code!</p>
          <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/student/scan-qr" class="button">Mark Attendance</a>
        </div>
        <div class="footer">
          <p>ProxyMukt Attendance System - Eliminating Proxy Attendance</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail(userEmail, subject, html);
};

/**
 * Send leave status update email
 */
export const sendLeaveStatusEmail = async (userEmail, userName, status, reason = '') => {
  const statusEmoji = status === 'APPROVED' ? '✅' : '❌';
  const subject = `${statusEmoji} Leave Request ${status}`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: ${status === 'APPROVED' ? '#10b981' : '#ef4444'}; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .status { font-size: 24px; font-weight: bold; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${statusEmoji} Leave Request ${status}</h1>
        </div>
        <div class="content">
          <p>Hi ${userName},</p>
          <p>Your leave request has been <strong>${status.toLowerCase()}</strong>.</p>
          ${reason ? `<p><strong>Faculty Response:</strong> ${reason}</p>` : ''}
          <p>Check your dashboard for more details.</p>
        </div>
        <div class="footer">
          <p>ProxyMukt Attendance System</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail(userEmail, subject, html);
};

/**
 * Send announcement email
 */
export const sendAnnouncementEmail = async (userEmail, userName, title, content, priority) => {
  const priorityColors = {
    HIGH: '#ef4444',
    MEDIUM: '#f59e0b',
    LOW: '#3b82f6'
  };
  
  const subject = `📢 ${priority === 'HIGH' ? '🔴 URGENT: ' : ''}${title}`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: ${priorityColors[priority] || '#667eea'}; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .priority { display: inline-block; padding: 5px 15px; background: ${priorityColors[priority]}; color: white; border-radius: 20px; font-size: 12px; margin-bottom: 15px; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📢 New Announcement</h1>
        </div>
        <div class="content">
          <span class="priority">${priority} PRIORITY</span>
          <h2>${title}</h2>
          <p>${content}</p>
        </div>
        <div class="footer">
          <p>ProxyMukt Attendance System</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail(userEmail, subject, html);
};

/**
 * Send low attendance warning email
 */
export const sendLowAttendanceWarning = async (userEmail, userName, className, percentage) => {
  const subject = `⚠️ Low Attendance Alert: ${className}`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f59e0b; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
        .percentage { font-size: 36px; font-weight: bold; color: #dc2626; text-align: center; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>⚠️ Low Attendance Alert</h1>
        </div>
        <div class="content">
          <p>Hi ${userName},</p>
          <div class="warning">
            <strong>⚠️ Warning:</strong> Your attendance in <strong>${className}</strong> is below the required threshold.
          </div>
          <div class="percentage">${percentage}%</div>
          <p>Please ensure you attend upcoming classes regularly to maintain the minimum attendance requirement.</p>
          <p><strong>Tip:</strong> Set reminders for your classes and arrive on time to mark your attendance.</p>
        </div>
        <div class="footer">
          <p>ProxyMukt Attendance System</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail(userEmail, subject, html);
};

export default {
  sendEmail,
  sendSessionStartedEmail,
  sendLeaveStatusEmail,
  sendAnnouncementEmail,
  sendLowAttendanceWarning,
};
