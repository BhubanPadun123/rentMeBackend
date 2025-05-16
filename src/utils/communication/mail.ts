import nodemailer from "nodemailer"
import dotenv from "dotenv"
import {
    sendMailTypeCheck,
    sendMailPayloadType
} from "../../types/gmail.type"

dotenv.config()


const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: false,
    port: 9000,
    auth: {
        user: process.env.SERVER_GMAIL,
        // pass: "fbad ttjt wqrz hmhj",
        pass:process.env.SERVER_GMAIL_PASSWORD
    },
})

const SendMail=(props:sendMailPayloadType)=>{
    return new Promise(async(resolved,rejected)=>{
        try {
            const validateData = sendMailTypeCheck.parse(props);
            const info = await transporter.sendMail({
                from:process.env.SERVER_GMAIL,
                to:validateData.to,
                subject:validateData.subject,
                text:validateData.message
            }).then((response)=>{
                resolved({
                    message:"message send successfully!",
                    response
                })
            }).catch((err)=>{
                rejected({
                    message:"Error while send the mail!",
                    err
                })
            })
        } catch (error) {
            rejected(error)
        }
    })
}

export {
    SendMail
}