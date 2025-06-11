import express, { Application, Request, Response } from 'express';
import cors from "cors"
import connectDB from "./src/config/db"
import dotenv from "dotenv"
import rootRoute from "./src/routes/index"
import authRoute from "./src/routes/auth/auth.controller"
import {verifyToken} from "./src/middleware/auth.middleware"
import UploadImages from "./src/routes/upload/imageUpload"
import Rconnect from "./src/config/radisConnect"

dotenv.config()

const app: Application = express();
const PORT = process.env.PORT || 8080;

//middleware
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));
app.use(cors());
app.use(cors({
    origin: 'http://localhost:8082', // frontend origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

Rconnect().then((res) => {
    console.log("Radis connected!")
})
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    })
})

app.use('/auth', authRoute)
app.use('/upload', UploadImages)
app.use("/v1", verifyToken, rootRoute)