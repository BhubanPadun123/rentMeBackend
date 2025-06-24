import {string, z} from "zod"


const userTypeCheck = z.object({
    userName:z.string(),
    userEmail:z.string().email("Invalid email address"),
    userContactNumber:z.string(),
    userType:z.string(),
    password:z.string(),
    isVerifyed:z.boolean(),
    privillages:z.array(z.string())
})
const userLoginCheck = z.object({
    userEmail:z.string().email("Invalid email address"),
    password:z.string()
})
const refrechTokenCheck = z.object({
    token:z.string()
})
const forgetPasswordCheck = z.object({
    userEmail:z.string().email("Invalid email address"),
    password:z.string()
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