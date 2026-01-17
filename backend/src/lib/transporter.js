import nodemailer from "nodemailer";
import { config } from "dotenv";

config({ path: ".env", quiet: true });

import mg from "nodemailer-mailgun-transport";

// Mailgun options
const options = {
  auth: {
    api_key: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
  },
};

export const transporter = nodemailer.createTransport(mg(options));

export const sender = "The Convoo Team <" + process.env.SENDER_EMAIL + ">";

// Email verification template
export const sendVerificationEmail = async (
  email,
  fullName,
  verificationToken
) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

  const mailOptions = {
    from: sender,
    to: email,
    subject: "Verify Your Email - Convoo",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
          .button { display: inline-block; padding: 12px 30px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Convoo!</h1>
          </div>
          <div class="content">
            <h2>Hi ${fullName},</h2>
            <p>Thank you for signing up! We're excited to have you join our community.</p>
            <p>To complete your registration and start chatting, please verify your email address by clicking the button below:</p>
            <center>
              <a href="${verificationUrl}" class="button">Verify Email Address</a>
            </center>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #4F46E5;">${verificationUrl}</p>
            <p><strong>This link will expire in 24 hours.</strong></p>
            <p>If you didn't create an account with Convoo, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; 2026 Convoo. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${email}`);
    return { success: true };
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error;
  }
};
