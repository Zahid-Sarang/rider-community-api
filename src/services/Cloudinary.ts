/* eslint-disable no-console */
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import { Config } from "../config";
import createHttpError from "http-errors";

cloudinary.config({
    cloud_name: Config.CLOUD_NAME,
    api_key: Config.API_KEY,
    api_secret: Config.API_SECRET,
});

export class CloudinaryService {
    constructor() {}

    async uploadFile(localFilePath: string) {
        try {
            if (!localFilePath) {
                const error = createHttpError(400, "Please include a file path! ");
                throw error;
            }
            const response = await cloudinary.uploader.upload(localFilePath, {
                resource_type: "auto",
            });
            fs.unlinkSync(localFilePath);
            return response;
        } catch (err) {
            fs.unlinkSync(localFilePath);
            const error = createHttpError(400, "Failed to upload file on server, try Again!");
            throw error;
        }
    }

    async destroyFile(imageUrl: string) {
        const cloudinaryUrlParts = imageUrl.split("/");
        const filenameWithExtension = cloudinaryUrlParts[cloudinaryUrlParts.length - 1];

        // If you specifically want the filename without the extension, you can further split by '.'
        const publicId = filenameWithExtension.split(".")[0];

        await cloudinary.uploader.destroy(publicId, (error, result) => {
            if (error) {
                console.log(error);
            } else {
                console.log(result);
            }
        });
    }
}
