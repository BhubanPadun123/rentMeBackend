import express,{
    Router,
    Request,
    Response
} from "express"
import dotenv from "dotenv"
import { 
    productTypeCheck,
    BookingModelCheck,
    NotificationModelCheck
} from "../../types/product.type"
import {
    checkUser 
} from "../../services/auth.service"
import {
    PostProduct,
    GetProductList,
    BookingProperty,
    FindAllProperty
} from "../../services/v1/productPost.service"
import { ProductPayload } from "../../services/v1/productPost.service"
import { SendMail } from "../../utils/communication/mail"
import { sendMailTypeCheck,sendMailPayloadType } from "../../types/gmail.type"
import { BookingPayload } from "model/stockBooking.model"
import { UserPayload } from "model/user.model"
import { CreateNotification } from "../../services/v1/notification.service"
import { NotificationPayload } from "../../model/notification"
import { getRandomColor } from "../../utils/randomColor"

dotenv.config()

const route = Router()


route.post('/booking',async(req:Request,res:Response)=>{
    const bodyData = req.body
    const data:BookingPayload={
        vendorRef:bodyData.vendorRef,
        customerRef:bodyData.customerRef,
        productRef:bodyData.productRef,
        rating:"__",
        review:"__",
        bookingStatus:"1",
        message:"__",
        bookingDate:bodyData.bookingDate
    }
    const validateBooking = BookingModelCheck.parse(data)
    BookingProperty(validateBooking).then(async(result:any)=>{
        const notificationData:NotificationPayload={
            userRef:result.customerRef,
            token:getRandomColor(),
            message:"You Booking has been place,We will notify you when it's update by owner",
            title:"New booking alert",
            redirectLink:"ServiceBookingScreen" 
        }
        const vendorNotification:NotificationPayload={
            userRef:result.vendorRef,
            token:getRandomColor(),
            message:"Someone is booking your propperty,Please update the status",
            title:"New Booking Alert",
            redirectLink:"FeedBackScreen"
        }
        const validateNotification = NotificationModelCheck.parse(notificationData)
        const validateNotificationVendor = NotificationModelCheck.parse(vendorNotification)
        await CreateNotification(validateNotification)
        await CreateNotification(validateNotificationVendor)
        return res.status(200).json(result)
    }).catch((error)=>{
        return res.status(501).json(error)
    })
})

route.get('/list',async(req:Request,res:Response)=>{
    const param =  req.query
    const start = parseInt(param.start as string) || 0
    const end = parseInt(param.end as string) || 5

    if(end <= start){
        res.status(400).json({
            message:"pagination start should not greater or equal to end!!"
        })
        return
    }
    GetProductList(start,end).then((result)=>{
        return res.status(200).json(result)
    }).catch((err)=>{
        return res.status(500).json(err)
    })
})
route.post('/add',async(req:Request,res:Response)=>{
    const body = req.body
    const validateData = productTypeCheck.parse(body);
    checkUser(validateData.vendorRef).then((result_1)=>{
        const data:ProductPayload={
            vendorRef:validateData.vendorRef,
            productTitle:validateData.productTitle,
            productType:validateData.productType,
            postAt:validateData.postAt,
            availableStatus:validateData.availableStatus,
            metaData:validateData.metaData,
            propertyOccupancy:validateData.propertyOccupancy

        }
        PostProduct(data).then((result_2)=>{
            return res.status(200).json(result_2)
            // const mailData:sendMailPayloadType={
            //     to:result_1?.userEmail,
            //     message:"Thank you for using our platform.Your property is being uploaded successfully!!.Our people will visit soon and verify your Property for customer trust.",
            //     subject:"Property uploaded successfully!!"
            // }
            // const validateEmailData = sendMailTypeCheck.parse(mailData)
            // SendMail(validateEmailData).then((result_3)=>{
            //     return res.status(200).json({
            //         message:"Message sent to owner",
            //         data:result_2
            //     })
            // }).catch((err)=>{
            //     return res.status(200).json({
            //         message:"Error occured while sent message to the owner!",
            //         data:result_2
            //     })
            // })
        }).catch((err)=>{
            console.log(err)
            return res.status(502).json(err)
        })
    }).catch((err)=>{
        return res.status(500).json(err)
    })
})


route.get('/area', (req: Request, res: Response) => {
    const params = req.query;
    const town = params.town as string;
    const type = params.type as string;

    if (!town) {
        res.status(500).json({
            message: "town missing",
        });
        return;
    }

    FindAllProperty().then((result: any) => {
        let dataCollection: any = [];

        if (result && Array.isArray(result) && result.length > 0) {
            for (const item of result) {
                const metaData = item.metaData;
                const metaDataInfo = metaData ? JSON.parse(metaData) : null;
                const address = metaDataInfo && metaDataInfo.hasOwnProperty('addressInfo')
                    ? metaDataInfo.addressInfo
                    : null;
                const geoLocation = metaDataInfo && metaDataInfo.hasOwnProperty('geoLocation')
                    ? JSON.parse(metaDataInfo.geoLocation)
                    : null;

                if (type && type.trim() === "map") {
                    if (metaDataInfo && metaDataInfo.hasOwnProperty('town')) {
                        const townName = JSON.parse(JSON.stringify(metaDataInfo)).town
                        if (metaDataInfo.town.trim().toLowerCase() == town.trim().toLowerCase()) {
                            dataCollection.push({
                                id: item._id,
                                title: item.productTitle,
                                latitude: geoLocation ? geoLocation.coords.latitude : "",
                                longitude: geoLocation ? geoLocation.coords.longitude : "",
                                color: getRandomColor(),
                            });
                        }
                    }
                } else {
                    if (type && type.trim().toLowerCase() === item.productType.trim().toLowerCase()) {
                        dataCollection.push(item);
                    }
                }
            }
        }
        return res.status(200).json(dataCollection);
    }).catch((err) => {
        return res.status(500).json(err);
    });
});


export default route
