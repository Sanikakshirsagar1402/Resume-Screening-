const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send shortlisting email to candidate
 * @param {string} to - Candidate's email
 * @param {string} candidateName - Candidate's name
 * @param {object} jobDetails - Object containing title, company, etc.
 * @param {object} interviewDetails - Object containing date, time, location/link
 */
exports.sendShortlistEmail = async (to, candidateName, jobDetails, interviewDetails) => {
  const mailOptions = {
    from: `"ResumeIQ Recruitment" <${process.env.EMAIL_USER}>`,
    to: to,
    subject: `Congratulations! You've been shortlisted for ${jobDetails.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;">
        <div style="background-color: #4f46e5; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">Application Shortlisted</h1>
        </div>
        <div style="padding: 30px;">
          <p>Dear <strong>${candidateName}</strong>,</p>
          <p>We are pleased to inform you that your application for the position of <strong>${jobDetails.title}</strong> at <strong>${jobDetails.company}</strong> has been shortlisted!</p>
          
          <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #4f46e5;">Interview Details</h3>
            <p style="margin: 5px 0;"><strong>📅 Date:</strong> ${interviewDetails.date}</p>
            <p style="margin: 5px 0;"><strong>⏰ Time:</strong> ${interviewDetails.time}</p>
            <p style="margin: 5px 0;"><strong>📍 Location/Link:</strong> ${interviewDetails.location}</p>
          </div>

          <p>Please confirm your availability for this slot. If you have any questions, feel free to reach out to us.</p>
          
          <div style="margin-top: 30px; border-top: 1px solid #e0e0e0; pt: 20px;">
            <p style="font-size: 0.9em; color: #666;">
              Best regards,<br>
              <strong>Hiring Team</strong><br>
              ${jobDetails.company}
            </p>
          </div>
        </div>
        <div style="background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 0.8em; color: #999;">
          © ${new Date().getFullYear()} AI Resume Screening System. All rights reserved.
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};
