// backend/utils/emailService.js
// ===========================================
// Email Service for OTP and Notifications
// ===========================================

const nodemailer = require('nodemailer');

// Check if Gmail credentials are configured
if (!process.env.GMAIL_USER || !process.env.GMAIL_PASSWORD) {
  console.warn('⚠️  WARNING: Gmail credentials not configured!');
  console.warn('   Please add to Backend/.env:');
  console.warn('   GMAIL_USER=your-email@gmail.com');
  console.warn('   GMAIL_PASSWORD=xxxx-xxxx-xxxx-xxxx');
}

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD
  }
});

// Test transporter connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email service error:', error.message);
  } else {
    console.log('✅ Email service ready!');
  }
});

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email
const sendOTPEmail = async (email, otp, username) => {
  try {
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'ReMarket - Email Verification OTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px 10px 0 0;">
            <h2 style="color: white; margin: 0;">Welcome to ReMarket!</h2>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <p style="color: #333; font-size: 16px;">Hi <strong>${username}</strong>,</p>
            
            <p style="color: #666; font-size: 15px; line-height: 1.6;">
              Thank you for creating your ReMarket account! To complete your registration and verify your email address, 
              please use the verification code below:
            </p>
            
            <div style="background: white; border: 2px solid #667eea; border-radius: 8px; padding: 20px; margin: 25px 0; text-align: center;">
              <p style="margin: 0; color: #999; font-size: 13px;">VERIFICATION CODE</p>
              <p style="margin: 10px 0 0 0; font-size: 36px; font-weight: bold; color: #667eea; letter-spacing: 5px;">
                ${otp}
              </p>
            </div>
            
            <p style="color: #666; font-size: 14px;">
              This code will expire in <strong>10 minutes</strong>. Do not share this code with anyone.
            </p>
            
            <p style="color: #999; font-size: 13px; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px;">
              If you didn't create this account, please ignore this email.
            </p>
          </div>
          
          <div style="text-align: center; color: #999; font-size: 12px; margin-top: 20px;">
            <p>© 2024 ReMarket. All rights reserved.</p>
          </div>
        </div>
      `
    };
    
    await transporter.sendMail(mailOptions);
    console.log(`✓ OTP email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    throw new Error('Failed to send verification email. Please try again.');
  }
};

// Send welcome email after verification
const sendWelcomeEmail = async (email, username) => {
  try {
    const mailOptions = {
      from: process.env.GMAIL_USER || 'noreply@remarket.com',
      to: email,
      subject: 'Welcome to ReMarket!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px 10px 0 0;">
            <h2 style="color: white; margin: 0;">Welcome to ReMarket! 🎉</h2>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <p style="color: #333; font-size: 16px;">Hi <strong>${username}</strong>,</p>
            
            <p style="color: #666; font-size: 15px; line-height: 1.6;">
              Your email has been successfully verified! Your account is now active and ready to use.
            </p>
            
            <p style="color: #666; font-size: 15px; line-height: 1.6;">
              You can now:
            </p>
            
            <ul style="color: #666; font-size: 15px;">
              <li>Browse second-hand items</li>
              <li>Create listings to sell your items</li>
              <li>Message other sellers and buyers</li>
              <li>Track your sales and inquiries</li>
            </ul>
            
            <p style="color: #999; font-size: 13px; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px;">
              © 2024 ReMarket. All rights reserved.
            </p>
          </div>
        </div>
      `
    };
    
    await transporter.sendMail(mailOptions);
    console.log(`✓ Welcome email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Welcome email error:', error);
    // Don't throw - welcome email is not critical
    return false;
  }
};

module.exports = {
  generateOTP,
  sendOTPEmail,
  sendWelcomeEmail
};
