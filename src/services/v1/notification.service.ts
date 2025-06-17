import NotificationModel,{NotificationPayload} from "../../model/notification"

export const CreateNotification=(data:NotificationPayload)=>{
    return new Promise(async(resolved,rejected)=>{
        try {
            const notification = new NotificationModel(data)
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