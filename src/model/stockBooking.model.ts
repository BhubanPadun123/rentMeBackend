import mongoose,{Document,Schema} from "mongoose";


export interface BookingPayload {
    _id?:string;
    vendorRef:string;
    customerRef:string;
    productRef:string;
    bookingStatus:string;
    message:string;
    rating:string;
    review:string;
    bookingDate:string
}
const BookingSchema = new Schema<BookingPayload>({
    vendorRef:{type:String,required:true},
    customerRef:{type:String,required:true},
    productRef:{type:String,required:true},
    bookingStatus:{type:String,required:true},
    message:{type:String,required:true},
    rating:{type:String,required:true},
    review:{type:String,required:true},
    bookingDate:{type:String,required:true}
})

const BookingModel = mongoose.model<BookingPayload>("BookingModel",BookingSchema)

export default BookingModel