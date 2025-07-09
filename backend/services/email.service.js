import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail', // adjust as per your SMTP
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendResetPasswordEmail = async ({ toEmail, toName, resetUrl, isConfirmation = false }) => {
  const mailOptions = {
    from: process.env.EMAIL_SENDER,
    to: toEmail,
    subject: isConfirmation
      ? 'Your Shoe Store password has been reset'
      : 'Reset your Shoe Store password',
    html: isConfirmation
      ? `<p>Hi ${toName},</p>
         <p>Your password has been successfully reset. If this wasn’t you, please contact support immediately.</p>`
      : `<p>Hi ${toName},</p>
         <p>You requested a password reset. Click the link below to reset your password:</p>
         <a href="${resetUrl}">${resetUrl}</a>
         <p>If you did not request this, please ignore this email.</p>`
  };

  await transporter.sendMail(mailOptions);
};
