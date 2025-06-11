import {Router,Request} from "express"
import AddProduct from "./src/routes/v1/postProperty"
import ManageProduct from "./src/routes/v1/vendor"
import { CheckPrivillage } from "./src/middleware/apiAccessPermissionCheck"


const route = Router()
route.use('/product',AddProduct)
route.use("/manage",ManageProduct)


export default route