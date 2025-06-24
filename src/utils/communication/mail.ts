import nodemailer from "nodemailer";
import dotenv from "dotenv";
import {
    sendMailTypeCheck,
    sendMailPayloadType
} from "../../types/gmail.type"; // Make sure this contains correct zod validation

dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "in-v3.mailjet.com", // fallback for safety
    port: Number(process.env.EMAIL_PORT || 587),
    secure: false, // false for 587 (STARTTLS)
    auth: {
        user: process.env.MAILJET_API_KEY,
        pass: process.env.MAILJET_SECRET_KEY,
    },
});

const SendMail = async (props: sendMailPayloadType) => {
    try {
        const validateData = sendMailTypeCheck.parse(props);

        const info = await transporter.sendMail({
            from: `"Ukum24x7" <${process.env.SERVER_GMAIL}>`, // Recommended: use a verified domain here
            to: validateData.to,
            subject: validateData.subject,
            text: validateData.message,
            html: `<p>${validateData.message}</p>`, // Optionally add HTML
        });

        return {
            message: "Message sent successfully!",
            response: info,
        };
    } catch (error) {
        return {
            message: "Error while sending the mail!",
            error,
        };
    }
};

export { SendMail };
