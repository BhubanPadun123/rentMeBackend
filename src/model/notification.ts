import mongoose,{Document,Schema} from "mongoose";

export interface NotificationPayload{
    userRef:string;
    token:string;
    message:string;
    title:string;
    redirectLink:string
}
export interface Notification extends Document{
    userRef:string;
    token:string;
    message:string;
    title:string;
    redirectLink:string
}
const mongooseNotificationSchema = new Schema<Notification>({
    userRef:{
        type:String,
        required:true
    },
    token:{
        type:String,
        required:true
    },
    message:{
        type:String,
        require:true
    },
    title:{
        type:String,
        required:true
    },
    redirectLink:{
        type:String,
        required:true
    }
},{timestamps:true})

const NotificationModel = mongoose.model<Notification>('NotoficationModel',mongooseNotificationSchema)

export default NotificationModel
