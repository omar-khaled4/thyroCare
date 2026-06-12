const nodemailer = require("nodemailer");

/**
 * Sends an email using nodemailer.
 * @param {string} to      — Recipient email
 * @param {string} subject — Email subject
 * @param {string} html    — HTML body
 */
async function sendEmail({ to, subject, html }) {
    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,        // e.g. "gmail"
        auth: {
            user: process.env.EMAIL_USER,            // e.g. "omar.khaled30320@gmail.com"
            pass: process.env.EMAIL_PASS,            // App Password (not account password)
        },
    });

    await transporter.sendMail({
        from: `"ThyroCare" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
        headers: {
            "X-Priority": "1",
            "Importance": "high",
        },
    });
}

module.exports = sendEmail;