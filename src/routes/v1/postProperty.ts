import express,{
    Router,
    Request,
    Response
} from "express"
import dotenv from "dotenv"
import { 
    productTypeCheck 
} from "../../types/product.type"
import {
    checkUser 
} from "../../services/auth.service"
import {
    PostProduct 
} from "../../services/v1/productPost.service"
import { ProductPayload } from "../../services/v1/productPost.service"
import { SendMail } from "../../utils/communication/mail"
import { sendMailTypeCheck,sendMailPayloadType } from "../../types/gmail.type"

dotenv.config()

const route = Router()

route.post('/property/post',async(req:Request,res:Response)=>{
    const body = req.body
    const validateData = productTypeCheck.parse(body);
    checkUser(validateData.metaData.vendorContactInfo.email).then((result_1)=>{
        const data:ProductPayload={
            vendorRef:validateData.vendorRef,
            productTitle:validateData.productTitle,
            productType:validateData.productType,
            postAt:validateData.postAt,
            availableStatus:validateData.availableStatus,
            metaData:{
                description:validateData.metaData.description,
                availableAminities:validateData.metaData.availableAminities,
                rentInfo:validateData.metaData.rentInfo,
                vendorContactInfo:validateData.metaData.vendorContactInfo,
                addressInfo:validateData.metaData.addressInfo,
                geoLocation:validateData.metaData.geoLocation,
                propertyImages:validateData.metaData.propertyImages
            },
            propertyOccupancy:validateData.propertyOccupancy

        }
        PostProduct(data).then((result_2)=>{
            const mailData:sendMailPayloadType={
                to:validateData.metaData.vendorContactInfo.email,
                message:"Thank you for using our platform.Your property is being uploaded successfully!!.Our people will visit soon and verify your Property for customer trust.",
                subject:"Property uploaded successfully!!"
            }
            const validateEmailData = sendMailTypeCheck.parse(mailData)
            SendMail(validateEmailData).then((result_3)=>{
                return res.status(200).json({
                    message:"Message sent to owner",
                    data:result_2
                })
            }).catch((err)=>{
                return res.status(200).json({
                    message:"Error occured while sent message to the owner!",
                    data:result_2
                })
            })
        }).catch((err)=>{
            return res.status(502).json(err)
        })
    }).catch((err)=>{
        return res.status(500).json(err)
    })
})

export default route
