import mongoose,{Document,Schema} from "mongoose";
import bcrypt from "bcryptjs"


export interface UserPayload{
    userName:string;
    userEmail:string;
    userContactNumber:string;
    userType:string;
    password:string;
    isVerifyed:boolean;
    privillages:string[]
}
export interface User extends Document{
    userName:string;
    userEmail:string;
    userContactNumber:string;
    userType:string;
    password:string;
    isVerifyed:boolean;
    privillages:string[];
    metaData?:any
}

const mongooseUserSchema = new Schema<User>({
    userName:{
        type:String,
        required:true,
        minlength:4,
        maxlength:8
    },
    userEmail:{
        type:String,
        required:true,
        unique:true,
    },
    userContactNumber:{
        type:String,
        required:true,
        min:10,
        max:13,
        unique:true
    },
    userType:{
        type:String,
        required:true
    },
    isVerifyed:{
        type:Boolean,
        required:true
    },
    password:{
        type:String,
        required:true,
        min:6,
        max:10
    },
    privillages:{type:[String],required:true},
    metaData:{type:Object,default:{}}
})

mongooseUserSchema.pre<User>('save',async function(next){
    if(!this.isModified('password')) return next();
    try {
        this.password = await bcrypt.hash(this.password,10);
        next();
    } catch (error:any) {
        next(error)
    }
})

const UserModel = mongoose.model<User>('User', mongooseUserSchema)

export default UserModel