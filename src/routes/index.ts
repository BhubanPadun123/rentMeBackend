import {Router,Request} from "express"
import AddProduct from "../routes/v1/postProperty"
import ManageProduct from "../routes/v1/vendor"
import { CheckPrivillage } from "../middleware/apiAccessPermissionCheck"


const route = Router()
route.use('/product',AddProduct)
route.use("/manage",ManageProduct)


export default route