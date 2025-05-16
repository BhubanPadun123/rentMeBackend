import {string, z} from "zod"


const userTypeCheck = z.object({
    userName:z.string().min(4,"userName should be atleast 4").max(8,"userName should not be more than 8"),
    userEmail:z.string().email("Invalid email address"),
    userContactNumber:z.string(),
    userType:z.string(),
    password:z.string().min(6, "Password must be at least 6 characters long"),
    isVerifyed:z.boolean()
})
const userLoginCheck = z.object({
    userEmail:z.string().email("Invalid email address"),
    password:z.string().min(6, "Password must be at least 6 characters long")
})
const refrechTokenCheck = z.object({
    token:z.string()
})
const forgetPasswordCheck = z.object({
    userEmail:z.string().email("Invalid email address"),
    password:z.string().min(6, "Password must be at least 6 characters long")
})

const checkUserExistType = z.object({
    userEmail:z.string().email("Invalid email address")
})

export {
    userTypeCheck,
    userLoginCheck,
    refrechTokenCheck,
    forgetPasswordCheck,
    checkUserExistType
}