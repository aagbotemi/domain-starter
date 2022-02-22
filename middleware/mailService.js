require('dotenv').config();
const nodemailer = require('nodemailer');
const sendEmail = async (email, subject, text) => {

    try {
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            // service: process.env.SERVICE,
            port: process.env.MAIL_PORT,
            secure: true,
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD,
            },
        });

        await transporter.sendMail({
            from: process.env.USER,
            to: email,
            subject: subject,
            text: text,
        });
        console.log("email sent sucessfully"); 
    } catch (error) {
        console.log(error, "email not sent");
    }
}

module.exports = sendEmail;