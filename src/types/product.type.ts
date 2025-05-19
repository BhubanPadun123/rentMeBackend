import {string, z} from "zod"

const productTypeCheck = z.object({
    vendorRef:z.string(),
    productTitle:z.string(),
    productType:z.string(),
    postAt:z.string(),
    availableStatus:z.boolean(),
    metaData:z.object({
        description:z.string(),
        availableAminities:z.array(z.object({
            name:z.string(),
            count:z.string()
        })),
        rentInfo:z.object({
            depositeAmount:z.string(),
            rent_per_month:z.string()
        }),
        vendorContactInfo:z.object({
            name:z.string(),
            email:z.string().email("Invalid Email!!"),
            contactNumber:z.string().min(10,"invalid contact number").max(12,"invalid contact number")
        }),
        addressInfo:z.object({
            pinCode:z.string(),
            district:z.string(),
            state:z.string(),
            town:z.string(),
            localAdd:z.string()
        }),
        geoLocation:z.any(),
        propertyImages:z.array(z.object({
            url:z.string()
        }))
    }),
    propertyOccupancy:z.array(z.string())
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

export {
    productTypeCheck,
    BookingModelCheck
}