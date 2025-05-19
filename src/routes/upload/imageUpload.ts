import multer from 'multer';
import {
    Router,
    Request,
    Response
} from "express"
import {
    cloudinary
} from "../../utils/cloudinary/index"

const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: function (req, file, cb) {
        cb(null, "SomeImage" + "." + file.originalname.split(".").pop());
    },
});

const diskStorage = multer({ storage: storage });

const route = Router()

route.post('/image', diskStorage.single('image'), async (req: Request, res: Response) => {
    try {
        const file = req.file;

        if (!file) {
            res.status(400).json({ message: 'No image uploaded' });
            return
        }

        // Upload to Cloudinary
        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({ folder: 'images' }, (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }).end(file.buffer);
        });

        res.status(200).json({ message: 'Upload successful', result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Upload failed', error });
    }
});


export default route