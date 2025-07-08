import {string, z} from "zod"

const productTypeCheck = z.object({
    vendorRef:z.string(),
    productTitle:z.string(),
    productType:z.string(),
    postAt:z.string(),
    availableStatus:z.boolean(),
    metaData:z.any(),
    propertyOccupancy:z.array(z.string()),
    tag:z.string()
})

const BookingModelCheck = z.object({
    vendorRef:z.string(),
    customerRef:z.string(),
    productRef:z.string(),
    bookingStatus:z.string(),
    message:z.string(),
    rating:z.string(),
    review:z.string(),
    bookingDate:z.string()
})

const PaymentModelCheck=z.object({
    orderRef:z.string(),
    customerRef:z.string(),
    productRef:z.string(),
    paymentId:z.string(),
    paymentStatus:z.string(),
    numberOfAttep:z.number()
})
const NotificationModelCheck=z.object({
    userRef:z.string(),
    token:z.string(),
    message:z.string(),
    title:z.string(),
    redirectLink:string()
})

export {
    productTypeCheck,
    BookingModelCheck,
    PaymentModelCheck,
    NotificationModelCheck
}