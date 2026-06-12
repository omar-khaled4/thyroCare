const nodemailer = require("nodemailer");

async function sendEmail({ to, subject, html, text }) {
    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    await transporter.sendMail({
        from: `"ThyroCare" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
        text: text || html.replace(/<[^>]*>/g, ""), // Strip HTML as fallback plain text
        headers: {
            "X-Priority": "1",
            "Importance": "high",
        },
    });
}

module.exports = sendEmail;