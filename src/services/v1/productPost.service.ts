import Product from "../../model/product.model";
import {
    productTypeCheck 
} from "../../types/product.type";

type availableAminities={
    name:string;
    count:number
}
type occupancy={
    occupancy:string
}
type images={
    url:string;
}
export type ProductPayload={
    vendorRef:string;
    productTitle:string;
    productType:string;
    postAt:string;
    availableStatus:boolean;
    metaData:{
        description:string;
        availableAminities:availableAminities[],
        rentInfo:{
            depositeAmount:string;
            rent_per_month:string
        },
        vendorContactInfo:{
            name:string;
            email:string;
            contactNumber:string;
        },
        addressInfo:{
            pinCode:string;
            district:string;
            state:string;
            town:string;
            localAdd:string;
        },
        geoLocation:any,
        propertyImages:images[]
    },
    propertyOccupancy:occupancy[]
}
export const PostProduct=(data:ProductPayload)=>{
    return new Promise(async(resolved,rejected)=>{
        try {
            const validateData = productTypeCheck.parse(data)
            const addProduct = new Product(validateData)
            const addedProduct = await addProduct.save()
            resolved({
                message:"Product added successfully!",
                product:addedProduct
            })
        } catch (error) {
            rejected(error)
        }
    })
}

