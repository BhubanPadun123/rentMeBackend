import PaymentModel,{PaymentPayload} from "../../model/payment.model";
import {
    PaymentModelCheck
} from "../../types/product.type"

export const CreatePayment=(data:PaymentPayload)=>{
    return new Promise(async(resolved,rejected)=>{
        try {
            const validate = PaymentModelCheck.parse(data)
            const newPayment = new PaymentModel(validate)
            const saveData = await newPayment.save()
            resolved({
                message:"Payment data save successfully!",
            })
        } catch (error) {
            rejected(error)
        }
    })
}
export const GetPaymentStatus=(orderRef:string)=>{
    return new Promise(async(resolved,rejected)=>{
        try {
            const data = await PaymentModel.findOne({orderRef:orderRef})
            resolved(data ? data : null)
        } catch (error) {
            rejected(error)
        }
    })
}

export const UpdatePayment=(orderRef:string,data:PaymentPayload)=>{
    return new Promise(async(resolved,rejected)=>{
        try {
            const update = await PaymentModel.findOneAndReplace(
                {orderRef:orderRef},
                data,
                {new:true}
            )
            resolved(update)
        } catch (error) {
            rejected(error)
        }
    })
}
export const GetAllPayment=()=>{
    return new Promise(async(resolved,rejected)=>{
        try {
            const data = await PaymentModel.find({})
            resolved(data)
        } catch (error) {
            rejected(error)
        }
    })
}