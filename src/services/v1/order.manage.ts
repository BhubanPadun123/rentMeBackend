import BookingModel from "../../model/stockBooking.model";

export const GetVendorBooking=(vendorId:string,productId:string)=>{
    return new Promise(async(resolved,rejected)=>{
        try {
            const list = await BookingModel.find({vendorRef:vendorId,productRef:productId})
            let productIds:string[] = []
            if(Array.isArray(list) && list.length > 0){
                list.map((item)=>{
                    productIds.push(item.productRef)
                })
            }
            resolved(productIds)
        } catch (error) {
            rejected(error)
        }
    })
}