import { NextFunction, Request, Response } from "express";
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
        try {
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
            res.json({ message: "memory created!" });
        } catch (error) {
            next(error);
        }
    }

    async getMemories(req: Request, res: Response, next: NextFunction) {
        try {
            const memories = await this.memoryService.getAllMemories();
            res.json(memories);
        } catch (error) {
            next(error);
        }
    }

    async getOneMemory(req: Request, res: Response, next: NextFunction) {
        try {
            const memoryId = req.params.id;
            if (isNaN(Number(memoryId))) {
                next(createHttpError(400, "Invalid url param!"));
                return;
            }
            const memory = await this.memoryService.getMemoryById(Number(memoryId));
            if (!memory) {
                next(createHttpError(400, "Memory does not exist!"));
                return;
            }
            res.json(memory);
        } catch (error) {
            next(error);
        }
    }
}
