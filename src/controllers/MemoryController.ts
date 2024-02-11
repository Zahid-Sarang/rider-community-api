import { NextFunction, Request, Response } from "express";
import { matchedData, validationResult } from "express-validator";
import createHttpError from "http-errors";
import { Logger } from "winston";
import { CloudinaryService } from "../services/Cloudinary";
import { MemoryService } from "../services/MemoryService";
import { UserService } from "../services/UserService";
import {
    CommentRequestData,
    MemoryRequestData,
    QueryParams,
    UpdateMemoriesRequestData,
} from "../types";

export class MemoryController {
    constructor(
        private memoryService: MemoryService,
        private logger: Logger,
        private cloudinaryService: CloudinaryService,
        private userService: UserService,
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
            const memoryImage = imageLocalPath
                ? await this.cloudinaryService.uploadFile(imageLocalPath)
                : null;

            // upload image on cloudinary

            await this.memoryService.createMemory({
                title,
                description,
                image: memoryImage ? memoryImage.url : undefined,
                userId,
            });
            res.json({ message: "memory created!" });
        } catch (error) {
            next(error);
        }
    }

    async getMemories(req: Request, res: Response, next: NextFunction) {
        const validatedQuery = matchedData(req, { onlyValidData: true });
        try {
            const [memories, count] = await this.memoryService.getAllMemories(
                validatedQuery as QueryParams,
            );
            res.json({
                total: count,
                data: memories,
            });
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
    async updateMemory(req: UpdateMemoriesRequestData, res: Response, next: NextFunction) {
        // validate memory Id
        const memoryId = req.params.id;
        if (isNaN(Number(memoryId))) {
            next(createHttpError(400, "Invalid url param!"));
            return;
        }

        // validate request fields
        const validationError = validationResult(req);
        if (!validationError.isEmpty()) {
            return res.status(400).json({ error: validationError.array() });
        }

        const { title, description } = req.body;

        // validate imagePath
        const imageLocalPath = req.file?.path;

        try {
            // upload image on cloudinary
            const memoryImage = imageLocalPath
                ? await this.cloudinaryService.uploadFile(imageLocalPath)
                : null;

            // delete previous image from cloudinary
            const memoryInfo = await this.memoryService.getMemoryById(Number(memoryId));
            if (memoryInfo?.image) {
                await this.cloudinaryService.destroyFile(memoryInfo.image);
            }

            // update data
            await this.memoryService.updatememories(Number(memoryId), {
                title,
                description,
                image: memoryImage ? memoryImage.url : null,
            });
            res.json({ message: "Memory Updated!" });
        } catch (error) {
            next(error);
        }
    }

    async deleteMemory(req: Request, res: Response, next: NextFunction) {
        try {
            const memoryId = req.params.id;
            if (isNaN(Number(memoryId))) {
                next(createHttpError(400, "Invalid url param!"));
                return;
            }
            await this.memoryService.deleteById(Number(memoryId));
            res.json({ message: "Memory Deleted!" });
        } catch (error) {
            next(error);
        }
    }

    async addAndRemoveLikes(req: Request, res: Response, next: NextFunction) {
        try {
            const validationError = validationResult(req);
            if (!validationError.isEmpty()) {
                return res.status(400).json({ errors: validationError.array() });
            }

            const { userId, memoryId } = req.body;
            if (isNaN(Number(memoryId)) || isNaN(Number(userId))) {
                next(createHttpError(400, "Invalid url param!"));
                return;
            }
            await this.memoryService.addAndRemoveLikes(Number(userId), Number(memoryId));
            res.json({ message: "Liked!" });
        } catch (error) {
            next(error);
        }
    }

    async destoryComment(req: Request, res: Response, next: NextFunction) {
        try {
            const { id: commentId } = req.params;
            if (isNaN(Number(commentId))) {
                return next(createHttpError(400, "invalid param!"));
            }
            await this.memoryService.deleteComment(Number(commentId));
            res.json({ message: "comment deleted!" });
        } catch (error) {
            next(error);
        }
    }

    async AddcommentToMemory(req: CommentRequestData, res: Response, next: NextFunction) {
        try {
            const validationError = validationResult(req);
            if (!validationError.isEmpty()) {
                return res.status(400).json({ errors: validationError.array() });
            }
            const { text, userId, memoryId } = req.body;
            const isUserExist = await this.userService.findById(Number(userId));
            if (!isUserExist) {
                next(createHttpError(400, "User not exist!"));
                return;
            }
            const isMemoryExist = await this.memoryService.getMemoryById(Number(memoryId));
            if (!isMemoryExist) {
                next(createHttpError(400, "Memory not exist!"));
                return;
            }
            await this.memoryService.addComments({ text, userId, memoryId });
            res.json({ message: "Comment Added!" });
        } catch (error) {
            next(error);
        }
    }

    async memoriesForUser(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.params.id;

            if (isNaN(Number(userId))) {
                next(createHttpError(400, "Invalid url param!"));
                return;
            }

            const usersMemories = await this.memoryService.memoriesUserCanSee(Number(userId));

            res.json(usersMemories);
        } catch (error) {
            next(error);
        }
    }
}
