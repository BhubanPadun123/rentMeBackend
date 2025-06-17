import mongoose,{Document,Schema} from "mongoose";

export interface PaymentPayload{
    orderRef:string;
    customerRef:string;
    productRef:string;
    paymentId:string;
    paymentStatus:string;
    numberOfAttep:number
}

export interface Payment extends Document{
    orderRef:string;
    customerRef:string;
    productRef:string;
    paymentId:string;
    paymentStatus:string;
    numberOfAttep:number
}

const mongoosePaymentSchema = new Schema<Payment>({
    orderRef:{
        type:String,
        required:true,
        unique:true
    },
    customerRef:{
        type:String,
        required:true
    },
    productRef:{
        type:String,
        required:true
    },
    paymentId:{
        type:String,
        required:true
    },
    paymentStatus:{
        type:String,
        required:true
    },
    numberOfAttep:{
        type:Number,
        required:true
    }
},{timestamps:true})

const PaymentModel = mongoose.model<Payment>("PaymentModel",mongoosePaymentSchema)
export default PaymentModel