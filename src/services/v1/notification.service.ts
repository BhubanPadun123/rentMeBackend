import NotificationModel,{NotificationPayload} from "../../model/notification"
import {
    NotificationModelCheck
} from "../../types/product.type"

export const CreateNotification=(data:NotificationPayload)=>{
    return new Promise(async(resolved,rejected)=>{
        try {
            const validate = NotificationModelCheck.parse(data)
            const notification = new NotificationModel(validate)
            await notification.save()
            resolved(notification)
        } catch (error) {
            rejected(error)
        }
    })
}

export const GetNotifications=(userRef:string)=>{
    return new Promise(async(resolved,rejected)=>{
        try {
            const notification = await NotificationModel.find({userRef:userRef})
            resolved(notification)
        } catch (error) {
            rejected(error)
        }
    })
}

export const DeleteNotification=(id:string)=>{
    return new Promise(async(resolved,rejected)=>{
        try {
            const deleteData = await NotificationModel.findByIdAndDelete(id)
            resolved(deleteData)
        } catch (error) {
            rejected(error)
        }
    })
}