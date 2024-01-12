import express, { NextFunction, Request, RequestHandler, Response } from "express";
import { AppDataSource } from "../config/data-source";
import logger from "../config/logger";
import { MemoryController } from "../controllers/MemoryController";
import { Memories } from "../entity/Memory";
import authMiddleware from "../middlewares/authMiddleware";
import { upload } from "../middlewares/multerMiddleware";
import { CloudinaryService } from "../services/Cloudinary";
import { MemoryService } from "../services/MemoryService";
import memoryValidator from "../validators/memory-validator";

const memoryRoute = express.Router();
const memoryRepositroy = AppDataSource.getRepository(Memories);
const cloudinaryService = new CloudinaryService();
const memoryService = new MemoryService(memoryRepositroy);
const memoryController = new MemoryController(memoryService, logger, cloudinaryService);

memoryRoute.post(
    "/",
    upload.single("image"),
    authMiddleware as RequestHandler,
    memoryValidator,
    (req: Request, res: Response, next: NextFunction) =>
        memoryController.createMemories(req, res, next),
);

export default memoryRoute;
