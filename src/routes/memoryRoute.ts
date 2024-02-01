import express, { NextFunction, Request, RequestHandler, Response } from "express";
import { AppDataSource } from "../config/data-source";
import logger from "../config/logger";
import { MemoryController } from "../controllers/MemoryController";
import { Comment } from "../entity/Comment";
import { Like } from "../entity/Like";
import { Memories } from "../entity/Memory";
import { User } from "../entity/User";
import authMiddleware from "../middlewares/authMiddleware";
import { upload } from "../middlewares/multerMiddleware";
import { CloudinaryService } from "../services/Cloudinary";
import { MemoryService } from "../services/MemoryService";
import likesCommentsValidators from "../validators/likes-comments-validators";
import memoryValidator from "../validators/memory-validator";
import updateMemoryValidators from "../validators/update-memory-validators";

const memoryRoute = express.Router();
const memoryRepositroy = AppDataSource.getRepository(Memories);
const cloudinaryService = new CloudinaryService();
const userRepository = AppDataSource.getRepository(User);
const likesRepository = AppDataSource.getRepository(Like);
const commentsRepository = AppDataSource.getRepository(Comment);
const memoryService = new MemoryService(
    memoryRepositroy,
    cloudinaryService,
    userRepository,
    likesRepository,
    commentsRepository,
);
const memoryController = new MemoryController(memoryService, logger, cloudinaryService);

memoryRoute.post(
    "/",
    upload.single("image"),
    authMiddleware as RequestHandler,
    memoryValidator,
    (req: Request, res: Response, next: NextFunction) =>
        memoryController.createMemories(req, res, next),
);

memoryRoute.get("/", authMiddleware as RequestHandler, (req, res, next) => {
    memoryController.getMemories(req, res, next);
});

memoryRoute.get("/:id", authMiddleware as RequestHandler, (req, res, next) => {
    memoryController.getOneMemory(req, res, next);
});
memoryRoute.patch(
    "/:id",
    updateMemoryValidators,
    upload.single("image"),
    authMiddleware as RequestHandler,
    (req: Request, res: Response, next: NextFunction) => {
        memoryController.updateMemory(req, res, next);
    },
);

memoryRoute.delete("/:id", authMiddleware as RequestHandler, (req, res, next) => {
    memoryController.deleteMemory(req, res, next);
});

memoryRoute.put(
    "/addLikes",
    likesCommentsValidators,
    authMiddleware as RequestHandler,
    (req: Request, res: Response, next: NextFunction) => {
        memoryController.addAndRemoveLikes(req, res, next);
    },
);
export default memoryRoute;
