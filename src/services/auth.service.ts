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
    isVerifyed:boolean
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
                isVerifyed: validateUser.isVerifyed
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
export const checkUser=(userEmail:string)=>{
    return new Promise(async(resolved,rejected)=>{
        try {
            const data = {
                userEmail:userEmail
            }
            const validateData = checkUserExistType.parse(data);
            const isUserExist = await UserModel.findOne({userEmail:validateData.userEmail});
            if(isUserExist){
                resolved({
                    message:"User getting successfully",
                    data:isUserExist
                })
            }else{
                rejected({
                    message:`user does not exist with email:${validateData.userEmail}`,
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



