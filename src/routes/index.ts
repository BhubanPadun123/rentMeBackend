import {Router,Request} from "express"
import AddProduct from "../routes/v1/postProperty"


const route = Router()
route.use('/product',AddProduct)


export default route