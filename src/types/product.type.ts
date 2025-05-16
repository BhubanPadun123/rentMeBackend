import {string, z} from "zod"

const productTypeCheck = z.object({
    vendorRef:z.string(),
    productTitle:z.string().min(6,"Title should not be less than 6").max(100,"Title should not be greater than 100"),
    productType:z.string().min(4,"product type is mandatory"),
    postAt:z.string(),
    availableStatus:z.boolean(),
    metaData:z.object({
        description:z.string(),
        availableAminities:z.array(z.object({
            name:z.string(),
            count:z.number()
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
    propertyOccupancy:z.array(z.object({
        occupancy:z.string()
    }))
})

export {
    productTypeCheck
}