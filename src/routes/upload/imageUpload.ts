import express, {
    Router,
    Request,
    Response
} from "express"
import dotenv from "dotenv"
import {
    Upload,
    cloudinary
} from "../../utils/cloudinary/index"
import fs from "fs"


dotenv.config()

const route = Router()

route.post('/images', Upload.array('images', 5), async (req: Request, res: Response): Promise<void> => {
    try {
        console.log(req.file,req.files)
        const files = req.files as Express.Multer.File[];

        if (!files || files.length === 0) {
            res.status(400).json({ message: 'No images uploaded' });
            return;
        }

        // Upload all images to Cloudinary and delete local files
        const uploadAllImages = () => {
            return new Promise<string[]>(async (resolve, reject) => {
                try {
                    const urls: string[] = [];

                    for (const file of files) {
                        const result = await cloudinary.uploader.upload(file.path, {
                            folder: 'images',
                        });

                        urls.push(result.secure_url);

                        // Delete the file after uploading
                        fs.unlink(file.path, (err) => {
                            if (err) console.error(`Failed to delete ${file.path}:`, err);
                        });
                    }

                    resolve(urls);
                } catch (error) {
                    reject(error);
                }
            });
        };

        const imageUrls = await uploadAllImages()

        res.status(200).json({
            message: 'Images uploaded successfully',
            urls: imageUrls,
        });

    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Image upload failed' });
    }
});

export default route