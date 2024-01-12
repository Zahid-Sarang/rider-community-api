import { NextFunction, Response } from "express";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import { Logger } from "winston";
import { CloudinaryService } from "../services/Cloudinary";
import { MemoryService } from "../services/MemoryService";
import { MemoryRequestData } from "../types";

export class MemoryController {
    constructor(
        private memoryService: MemoryService,
        private logger: Logger,
        private cloudinaryService: CloudinaryService,
    ) {}

    async createMemories(req: MemoryRequestData, res: Response, next: NextFunction) {
        // validation
        const validationError = validationResult(req);
        if (!validationError.isEmpty()) {
            return res.status(400).json({ errors: validationError.array() });
        }
        const { title, description, userId } = req.body;

        // validate image path
        const imageLocalPath = req.file?.path;
        if (!imageLocalPath) {
            return next(createHttpError(400, "Please Upload Image"));
        }

        // upload image on cloudinary
        const memoryImage = await this.cloudinaryService.uploadFile(imageLocalPath);
        await this.memoryService.createMemory({
            title,
            description,
            image: memoryImage.url,
            userId,
        });
        res.json({ message: "Hello from memories" });
    }
}
