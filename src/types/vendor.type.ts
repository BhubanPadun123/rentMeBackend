import {z} from "zod"

export const bookingConfirmationPayloadCheck = z.object({
    customerRef:z.string(),
    vendorRef:z.string(),
    bookingRef:z.string(),
    productRef:z.string(),
    bookingConfirmationStatus:z.boolean()
})