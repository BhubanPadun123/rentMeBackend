import express,{Application,Request,Response} from 'express';
import cors from "cors"
import connectDB from "./config/db"
import dotenv from "dotenv"
import rootRoute from "./routes/index"
import authRoute from "./routes/auth/auth.controller"
import {verifyToken} from "./middleware/auth.middleware"
import UploadImages from "./routes/upload/imageUpload"

dotenv.config()

const app:Application = express();
const PORT =  process.env.PORT || 8080;

//middleware
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));
app.use(cors());


connectDB().then(()=>{
    app.listen(PORT,()=>{
        console.log(`Server running on port ${PORT}`);
    })
})

app.use('/auth',authRoute)
app.use('/upload',verifyToken,UploadImages)
app.use("/v1",verifyToken,rootRoute)