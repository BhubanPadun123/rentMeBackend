import BookingModel,{
    BookingPayload
} from "../../model/stockBooking.model";
import BookingConfirmationModel,{
    BookingConfirmationPayload
} from "../../model/bookingConfirmation.model";
import { bookingConfirmationPayloadCheck } from "../../types/vendor.type";

export const GetVendorBooking=(vendorId:string,productId:string):BookingPayload[] | any=>{
    return new Promise(async(resolved,rejected)=>{
        try {
            const list = await BookingModel.find({vendorRef:vendorId,productRef:productId})
            let productIds:BookingPayload[] = []
            if(Array.isArray(list) && list.length > 0){
                list.map((item)=>{
                    productIds.push(item)
                })
            }
            resolved(productIds)
        } catch (error) {
            rejected(error)
        }
    })
}

export const CreateOrderStatus=(data:BookingConfirmationPayload)=>{
    return new Promise(async(resolved,rejected)=>{
        try {
            const dataValidation = bookingConfirmationPayloadCheck.parse(data)
            const newConfirmOrder = new BookingConfirmationModel(dataValidation)
            const saveData = await newConfirmOrder.save()
            resolved({
                message:"Updated successfully!"
            })
        } catch (error) {
            rejected(error)
        }
    })
}