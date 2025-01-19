import nodemailer from "nodemailer";
import "dotenv/config";

const { SMTP_PASSWORD, SMTP_USER, SMTP_FROM, SMTP_HOST, SMTP_PORT} = process.env;

const nodemailerConfig = {
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: true,
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASSWORD
    }
};

const transporter = nodemailer.createTransport(nodemailerConfig);

export const sendEmail = data => {
    const email = { ...data, from: SMTP_FROM };
    return transporter.sendMail(email);
};
