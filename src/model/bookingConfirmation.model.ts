import mongoose,{
    Document,
    Schema
} from "mongoose";

export interface BookingConfirmationPayload {
    bookingRef:string;
    customerRef:string;
    vendorRef:string;
    productRef:string;
    bookingConfirmationStatus:boolean
}

const BookingConfirmationSchema = new Schema<BookingConfirmationPayload>({
    customerRef:{type:String,required:true},
    vendorRef:{type:String,required:true},
    bookingRef:{type:String,required:true,unique:true},
    productRef:{type:String,required:true},
    bookingConfirmationStatus:{type:Boolean,required:true}
})

const BookingConfirmationModel =  mongoose.model<BookingConfirmationPayload>("BookingConfirmationModel",BookingConfirmationSchema)

export default BookingConfirmationModel