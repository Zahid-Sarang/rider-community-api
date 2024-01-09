import express, { NextFunction, Request, RequestHandler, Response } from "express";
import { AppDataSource } from "../config/data-source";
import logger from "../config/logger";

import { UserController } from "../controllers/UserController";
import { User } from "../entity/User";
import authMiddleware from "../middlewares/authMiddleware";
import { canAccess } from "../middlewares/checkUserMiddleware";
import { upload } from "../middlewares/multerMiddleware";
import { CloudinaryService } from "../services/Cloudinary";
import { UserService } from "../services/UserService";
import { UpdateUserRequest } from "../types";
import updateUserValidators from "../validators/update-user-validators";

const userRouter = express.Router();
const userRepository = AppDataSource.getRepository(User);
const userService = new UserService(userRepository);
const cloudinaryService = new CloudinaryService();
const userContoller = new UserController(userService, logger, cloudinaryService);

userRouter.get(
    "/",
    authMiddleware as RequestHandler,
    (req: Request, res: Response, next: NextFunction) =>
        userContoller.getUsers(req, res, next) as unknown as RequestHandler,
);

userRouter.get(
    "/:id",
    authMiddleware as RequestHandler,
    (req: Request, res: Response, next: NextFunction) =>
        userContoller.getOneUser(req, res, next) as unknown as RequestHandler,
);

userRouter.patch(
    "/:id",
    upload.fields([
        {
            name: "profilePhoto",
            maxCount: 1,
        },
        {
            name: "coverPhoto",
            maxCount: 1,
        },
    ]),
    authMiddleware as RequestHandler,
    canAccess(),
    updateUserValidators,
    (req: UpdateUserRequest, res: Response, next: NextFunction) =>
        userContoller.updateUser(req, res, next) as unknown as RequestHandler,
);

userRouter.delete(
    "/:id",
    authMiddleware as RequestHandler,
    updateUserValidators,
    (req: Request, res: Response, next: NextFunction) =>
        userContoller.deleteUser(req, res, next) as unknown as RequestHandler,
);
export default userRouter;
