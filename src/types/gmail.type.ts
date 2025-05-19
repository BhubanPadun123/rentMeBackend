import {z} from "zod"

const sendMailTypeCheck = z.object({
    to:z.string().email(),
    subject:z.string(),
    message:z.string()
})
type sendMailPayloadType={
    to:string;
    subject:string;
    message:string;
}

export {
    sendMailTypeCheck,
    sendMailPayloadType
}