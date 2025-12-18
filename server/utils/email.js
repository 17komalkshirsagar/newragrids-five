


const nodemailer = require("nodemailer");

const sendEmail = async ({ subject, to, message }) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.FROM_EMAIL,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: `"NewRa Grids Pvt. Ltd." <${process.env.FROM_EMAIL}>`,
            to,
            subject,
            text: message.replace(/<[^>]+>/g, ""),
            html: message,
        });

        console.log(`📩 Email sent successfully to ${to}`);
    } catch (error) {
        console.error("❌ Email sending failed:", error);
        throw new Error("Email could not be sent");
    }
};

module.exports = sendEmail;
