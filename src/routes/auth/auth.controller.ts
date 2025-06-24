import {
    Router,
    Request,
    Response
} from "express"
import dotenv from "dotenv"
import {
    createUser,
    loginUser,
    refreshAccessToken,
    forgetPassword,
    GetUserById,
    GetAllUser,
    ChangeUserRole
} from "../../services/auth.service"
import {
    userTypeCheck,
    userLoginCheck,
    refrechTokenCheck,
    forgetPasswordCheck
} from "../../types/user.type"
import {
    RadisCline
} from "../../config/radisConnect"
import { USER_ROLES, USER_PRIVILLAGES } from "../../utils/privilages"
import { UserPayload } from "../../model/user.model"
import { verifyToken } from "../../middleware/auth.middleware"
import updateProfile from "./updateProfile"

dotenv.config()

const route = Router()
route.post('/forget_password', (req: Request, res: Response) => {
    const {
        userEmail,
        password
    } = req.body
    const data = {
        userEmail,
        password
    }
    
    const validateData = forgetPasswordCheck.parse(data);
    forgetPassword(validateData).then((result) => {
        return res.status(200).json(result)
    }).catch((err) => {
        res.status(401).json(err)
    })
})
route.post('/refresh', (req: Request, res: Response) => {
    const { token } = req.body
    const refreshToken = {
        token: token
    }
    const validateData = refrechTokenCheck.parse(refreshToken);
    refreshAccessToken(validateData.token).then((result) => {
        return res.status(200).json(result)
    }).catch((err) => {
        return res.status(501).json(err)
    })
})

route.post('/login', (req: Request, res: Response) => {
    const {
        userEmail,
        password
    } = req.body
    const loginData = {
        userEmail,
        password
    }
    const validateData = userLoginCheck.parse(loginData)
    loginUser(validateData).then((result) => {
        return res.status(200).json(result)
    }).catch((err) => {
        return res.status(501).json(err)
    })
})

route.post("/register", async (req: Request, res: Response) => {
    console.log(req.body)
    const {
        userName,
        userEmail,
        userContactNumber,
        userType,
        password,
        isVerifyed = false
    } = req.body
    let user:UserPayload = {
        userName,
        userEmail,
        userContactNumber,
        userType,
        password,
        isVerifyed,
        privillages:[]
    }
    let privilages: string[] = []
    Object.entries(USER_PRIVILLAGES).map(([key, val]) => {
        if (key.trim().toLowerCase() === userType.trim().toLowerCase()) {
            privilages = val
        }
    })
    user.privillages = privilages
    const validateUser = userTypeCheck.parse(user)
    createUser(validateUser).then((result) => {
        return res.status(200).json(result)
    }).catch((err) => {
        return res.status(500).json(err)
    })
})
route.get('/privilages', (req: Request, res: Response) => {
    res.status(200).json({
        roles: USER_ROLES,
        privillages: USER_PRIVILLAGES
    })
    return
})
route.get('/user',async(req:Request,res:Response)=>{
    const body = req.query
    const id = body.id as string
    if(!id){
        res.status(400).json({
            message:"User id missing"
        })
        return
    }
    const user = await GetUserById(id)
    if(user){
        res.status(200).json({
            userName:user?.userName,
            userEmail:user?.userEmail,
            userContactNumber:user?.userContactNumber,
        })
        return
    }else{
        res.status(500).json({
            message:"user does not exist!"
        })
    }
})
route.get("/all",(req:Request,res:Response)=>{
    GetAllUser().then((result)=>{
        return res.status(200).json(result)
    }).catch((err)=>{
        return res.status(500).json(err)
    })
})
route.put('/user',(req:Request,res:Response)=>{
    const body =req.body
    const id = body.id as string
    const role = body.role as string
    if(!id || !role){
        res.status(400).json({
            message:"id or role missing!"
        })
        return
    }
    ChangeUserRole(id,role).then((result)=>{
        return res.status(200).json(result)
    }).catch((err)=>{
        return res.status(500).json(err)
    })

})
route.use('/profile',verifyToken,updateProfile)

export default route