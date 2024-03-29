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
import { UserService } from "../services/UserService";
import commentValidator from "../validators/comment-validator";
import likesValidators from "../validators/likes-validators";
import memoryValidator from "../validators/memory-validator";
import searchValidators from "../validators/search-validators";
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
const userService = new UserService(userRepository);
const memoryController = new MemoryController(
    memoryService,
    logger,
    cloudinaryService,
    userService,
);

memoryRoute.post(
    "/",
    upload.single("image"),
    authMiddleware as RequestHandler,
    memoryValidator,
    (req: Request, res: Response, next: NextFunction) =>
        memoryController.createMemories(req, res, next),
);

memoryRoute.get(
    "/",
    authMiddleware as RequestHandler,
    searchValidators,
    (req: Request, res: Response, next: NextFunction) => {
        memoryController.getMemories(req, res, next);
    },
);

memoryRoute.get(
    "/:id",
    authMiddleware as RequestHandler,
    (req: Request, res: Response, next: NextFunction) => {
        memoryController.getOneMemory(req, res, next);
    },
);
memoryRoute.patch(
    "/:id",
    updateMemoryValidators,
    upload.single("image"),
    authMiddleware as RequestHandler,
    (req: Request, res: Response, next: NextFunction) => {
        memoryController.updateMemory(req, res, next);
    },
);

memoryRoute.delete(
    "/:id",
    authMiddleware as RequestHandler,
    (req: Request, res: Response, next: NextFunction) => {
        memoryController.deleteMemory(req, res, next);
    },
);

memoryRoute.put(
    "/addLikes",
    likesValidators,
    authMiddleware as RequestHandler,
    (req: Request, res: Response, next: NextFunction) => {
        memoryController.addAndRemoveLikes(req, res, next);
    },
);

memoryRoute.put(
    "/addComment",
    commentValidator,
    authMiddleware,
    (req: Request, res: Response, next: NextFunction) => {
        memoryController.AddcommentToMemory(req, res, next);
    },
);

memoryRoute.delete(
    "/removeComment/:id",
    authMiddleware,
    (req: Request, res: Response, next: NextFunction) => {
        memoryController.destoryComment(req, res, next);
    },
);

memoryRoute.get(
    "/:id/userCanSee",
    authMiddleware as RequestHandler,
    (req: Request, res: Response, next: NextFunction) => {
        memoryController.memoriesForUser(req, res, next);
    },
);
export default memoryRoute;
