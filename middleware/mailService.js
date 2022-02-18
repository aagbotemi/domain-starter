require('dotenv').config();
const nodemailer = require('nodemailer');
const mailGun = require('nodemailer-mailgun-transport');

const sendEmail = (email, token) => {
    // const _email = email;
    // const _token = token;

    console.log("email", email);
    console.log("token", token);

    const auth = {
        auth: {
            api_key: process.env.MAIL_API_KEY,
            domain: process.env.MAIL_DOMAIN,
        }
    };

    
    console.log("process.env.MAIL_API_KEY", process.env.MAIL_API_KEY);
    console.log("process.env.MAIL_DOMAIN", process.env.MAIL_DOMAIN);

    console.log("auth", auth);

    const transporter = nodemailer.createTransport(mailGun(auth));
    
    console.log("transporter", transporter);
    
    const mailOptions = {
        from: 'meia@gmail.com',
        to: email,
        subject: 'Reset Password Link - MEIA',
        html: '<p>You requested for reset password, kindly use this <a href="http://localhost:4000/reset-password?token=' + token + '">link</a> to reset your password</p>'
        
    };
    
    console.log("mailOptions", mailOptions);

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            // console.log(1);
            console.log(`Error: ${err}`);
            // cb(err, null);
        } else {
            // console.log(0);
            console.log(`Response: ${info}`);
            // cb(null, info);
        }
    });
    console.log("working", "working");
}

module.exports = sendEmail;