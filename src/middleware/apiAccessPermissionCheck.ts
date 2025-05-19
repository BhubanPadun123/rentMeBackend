import {
    Router,
    Request,
    Response,
    NextFunction
} from "express"
import { USER_PRIVILLAGES,USER_ROLES } from "../utils/privilages"
import { GetUserById } from "../services/auth.service"
import { User } from "../model/user.model"

export const CheckPrivillage = (
    req:Request,
    res:Response,
    next:NextFunction
):void=>{
    const userId = req.query.userId as string
    if(!userId){
        res.status(401).json({
            message:"User id missing!"
        })
        return
    }
    GetUserById(userId).then((result:User)=>{
        if(result){
            const {
                userType,
                privillages
            } = result
            let userPrivillages:string[] = []
            Object.entries(USER_PRIVILLAGES).map((item)=>{
                if(item[0] === userType){
                    userPrivillages = item[1]
                }
            })
            let isAllow:boolean = false
            privillages.forEach((i)=>{
                if(userPrivillages.includes(i)){
                    isAllow = true
                    return
                }
            })
            if(isAllow){
                next()
            }else{
                res.status(400).json({
                    message:"Not Allow to access,If you want to access this side please connect with flatform team"
                })
                return
            }
        }
    }).catch((error:any)=>{
        res.status(500).json(error)
        return
    })
}