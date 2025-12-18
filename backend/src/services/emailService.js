const nodemailer = require('nodemailer');

/**
 * Email service for sending alert notifications
 * Uses nodemailer with SMTP configuration
 */

// Create transporter
let transporter = null;

const initializeTransporter = () => {
    if (transporter) return transporter;

    // Check if email configuration exists
    if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER) {
        console.warn('⚠️  Email service not configured. Alerts will only be logged.');
        return null;
    }

    transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT) || 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    return transporter;
};

/**
 * Send alert email
 */
const sendAlertEmail = async (to, symbol, message) => {
    try {
        const transport = initializeTransporter();

        if (!transport) {
            console.log(`📧 [MOCK EMAIL] To: ${to}, Subject: Alert for ${symbol}, Message: ${message}`);
            return { success: true, mock: true };
        }

        const mailOptions = {
            from: process.env.EMAIL_FROM || 'Trading Analytics <noreply@tradinganalytics.com>',
            to,
            subject: `🔔 Trading Alert: ${symbol}`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Trading Alert Triggered</h2>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #1f2937;">Symbol: ${symbol}</h3>
            <p style="font-size: 16px; color: #374151;">${message}</p>
          </div>
          <p style="color: #6b7280; font-size: 14px;">
            This is an automated alert from your Trading Analytics Platform.
            <br>
            Login to your dashboard to view more details.
          </p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="color: #9ca3af; font-size: 12px;">
            You're receiving this email because you set up an alert for ${symbol}.
            <br>
            To manage your alerts, visit your dashboard.
          </p>
        </div>
      `
        };

        const info = await transport.sendMail(mailOptions);
        console.log(`✅ Alert email sent to ${to}: ${info.messageId}`);

        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error sending alert email:', error.message);
        // Don't throw error - log and continue
        return { success: false, error: error.message };
    }
};

/**
 * Send welcome email (optional)
 */
const sendWelcomeEmail = async (to, name) => {
    try {
        const transport = initializeTransporter();

        if (!transport) {
            console.log(`📧 [MOCK EMAIL] Welcome email to: ${to}`);
            return { success: true, mock: true };
        }

        const mailOptions = {
            from: process.env.EMAIL_FROM || 'Trading Analytics <noreply@tradinganalytics.com>',
            to,
            subject: '🎉 Welcome to Trading Analytics Platform',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Welcome to Trading Analytics, ${name}!</h2>
          <p style="font-size: 16px; color: #374151;">
            Thank you for signing up. You can now start tracking your portfolio and get smart trading insights.
          </p>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Get Started:</h3>
            <ul style="color: #374151;">
              <li>Create your first portfolio</li>
              <li>Add your holdings</li>
              <li>Set up smart alerts</li>
              <li>View analytics and insights</li>
            </ul>
          </div>
          <p style="color: #6b7280;">
            Happy trading!<br>
            The Trading Analytics Team
          </p>
        </div>
      `
        };

        const info = await transport.sendMail(mailOptions);
        console.log(`✅ Welcome email sent to ${to}: ${info.messageId}`);

        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error sending welcome email:', error.message);
        return { success: false, error: error.message };
    }
};

module.exports = {
    sendAlertEmail,
    sendWelcomeEmail
};
