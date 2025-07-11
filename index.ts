import express, { Router, Request } from "express"
import AddProduct from "./src/routes/v1/postProperty"
import ManageProduct from "./src/routes/v1/vendor"
import { CheckPrivillage } from "./src/middleware/apiAccessPermissionCheck"
import bodyParser from "body-parser"
import cors from "cors"
import auth from "./src/routes/auth/auth.controller"
import { verifyToken } from "./src/middleware/auth.middleware"
import connectDB from "./src/config/db"
// import Rconnect from "./src/config/radisConnect"
import CustomerManage from "./src/routes/v1/customer"
import dotenv from "dotenv"
import {sendMailTypeCheck} from "./src/types/gmail.type"
import {SendMail} from "./src/utils/communication/mail"

dotenv.config()

const route = Router()
const app = express();
const PORT = process.env.PORT || 8080

app.use(cors())
app.use(bodyParser.json())
app.use('/api/product',AddProduct)
app.use('/api/manage', verifyToken, ManageProduct)
app.use("/api/customer", verifyToken, CustomerManage)
app.use('/api/auth', auth)
app.get('/', (req, res) => {
    res.send('Server is running...')
});
app.get('/version', (req, res) => {
    res.json({
        version: 'v1.0.3',
        deployedAt: '2025-06-18 11:57',
    });
});
(async function () {
    await connectDB()
    // await Rconnect()
})()
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
})