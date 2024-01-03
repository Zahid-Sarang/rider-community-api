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
}
