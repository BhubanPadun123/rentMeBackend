import UserModel from "../model/user.model"
import {
    userTypeCheck,
    userLoginCheck,
    refrechTokenCheck,
    forgetPasswordCheck,
    checkUserExistType
} from "../types/user.type"
import bcrypt from "bcryptjs"
import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken
} from "../utils/token.utils"

interface User {
    id?: number;
    userName: string;
    userEmail: string;
    userContactNumber: string;
    userType: string;
    password: string;
    isVerifyed:boolean;
    privillages:string[];
}
import { USER_ROLES,USER_PRIVILLAGES } from "../utils/privilages";

export const updateMetaData=(metaData:any,id:string)=>{
    return new Promise(async(resolved,rejected)=>{
        try {
            const update = await UserModel.findOneAndUpdate({_id:id},{metaData:JSON.stringify(metaData)},{new:true})
            resolved(update)
        } catch (error) {
            rejected(error)
        }
    })
}
export const createUser = (user: User) => {
    return new Promise(async (resolved, rejected) => {
        try {
            const validateUser = userTypeCheck.parse(user)
            const newUser = new UserModel({
                userName: validateUser.userName,
                userEmail: validateUser.userEmail,
                userContactNumber: validateUser.userContactNumber,
                userType: validateUser.userType,
                password: validateUser.password,
                isVerifyed: validateUser.isVerifyed,
                privillages:validateUser.privillages,
                metaData:"{}"
            })
            const saveUser = await newUser.save()
            resolved({message:"user register successfully!!"})
        } catch (error) {
            rejected(error)
        }
    })

}
interface userLoginData{
    userEmail:string;
    password:string
}
export const loginUser = (user:userLoginData)=>{
    return new Promise(async(resolved,rejected)=>{
        try {
            const validateData = userLoginCheck.parse(user);
            const userData = await UserModel.findOne({userEmail:validateData.userEmail})
            if(!userData || !userData.password){
                rejected({message:`User does not exist with email:${validateData.userEmail}`})
            }
            if(userData?.password){
                const isPasswordSame = await bcrypt.compare(validateData.password,userData?.password)
                if(!isPasswordSame){
                    rejected({message:"Invalid login credentials!!,password incorrect!!"})
                }else{
                    const accessToken = userData?._id && generateAccessToken(userData._id.toString());
                    const refreshToken = userData?._id && generateRefreshToken(userData._id.toString());
                    resolved({
                        accessToken,
                        refreshToken,
                        userData
                    })
                }
            }else{
                rejected({message:`User does not exist with email:${validateData.userEmail}`})
            }
        } catch (error) {
            rejected(error)
        }
    })
}

export const refreshAccessToken = (token:string)=>{
    return new Promise((resolved,rejected)=>{
        try {
            const refreshToken={
                token:token
            }
            const validateData = refrechTokenCheck.parse(refreshToken);
            const payload:any = verifyRefreshToken(validateData.token);
            const newAccessToken = generateAccessToken(payload.userId)
            resolved(newAccessToken)
        } catch (error) {
            rejected(error)
        }
    })
}

interface passwordForgetData{
    userEmail:string;
    password:string
}
export const forgetPassword=(data:passwordForgetData)=>{
    return new Promise(async(resolved,rejected)=>{
        try {
            const validateData = forgetPasswordCheck.parse(data)
            const checkUserExist = await UserModel.findOne({userEmail:validateData.userEmail})
            if(!checkUserExist){
                rejected({message:`User does not exist with email:${validateData.userEmail}`})
            }else{
                const hashPass = await bcrypt.hash(validateData.password,10)
                const updateUser = await UserModel.findOneAndUpdate(
                    {userEmail:validateData.userEmail},
                    {$set:{password:hashPass}},
                    {new:false}
                )
                resolved(updateUser)
            }
        } catch (error) {
            rejected(error)
        }
    })
}
export const checkUser=(_id:string)=>{
    return new Promise(async(resolved,rejected)=>{
        try {
            const isUserExist = await UserModel.findById(_id)
            if(isUserExist){
                resolved({
                    message:"User getting successfully",
                    data:isUserExist
                })
            }else{
                rejected({
                    message:`user does not exist with email:${_id}`,
                    data:[]
                })
            }
        } catch (error) {
            rejected({
                message:"error while checking user into DB!!",
                error
            })
        }
    })
}
export const GetUserById=(uId:string):User | any=>{
    return new Promise(async(resolved,rejected)=>{
        try {
            const user = await UserModel.findOne({_id:uId})
            if(user){
                let userInfo:User = user
                resolved(userInfo)
            }else{
                rejected({
                    message:`User does not exist with id : ${uId}`
                })
            }
        } catch (error) {
            rejected(error)
        }
    })
}
export const GetAllUser=()=>{
    return new Promise(async(resolved,rejeced)=>{
        try {
            const users = await UserModel.find({})
            if(users){
                resolved(users)
            }else{
                rejeced({
                    message:"user list empty"
                })
            }
        } catch (error) {
            rejeced(error)
        }
    })
}
export const ChangeUserRole=(id:string,role:string)=>{
    return new Promise(async(resolved,rejected)=>{
        try {
            const update = await UserModel.findByIdAndUpdate(id,{
                userType:role
            })
            if(update){
                resolved(update)
            }else{
                rejected({
                    message:"update data not found!"
                })
            }
        } catch (error) {
            rejected(error)
        }
    })
}



