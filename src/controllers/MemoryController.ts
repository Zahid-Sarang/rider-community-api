import { NextFunction, Response } from "express";
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
        const { title, description, image, userId } = req.body;
        console.log(title, description, userId);

        await this.memoryService.createMemory({ title, description, image, userId });
        res.json({ message: "Hello from memories" });
    }
}
