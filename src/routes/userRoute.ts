import express, { NextFunction, Request, RequestHandler, Response } from "express";
import { AppDataSource } from "../config/data-source";
import logger from "../config/logger";

import { UserController } from "../controllers/UserController";
import { RefreshToken } from "../entity/RefreshToken";
import { User } from "../entity/User";
import authMiddleware from "../middlewares/authMiddleware";
import { TokenService } from "../services/TokenService";
import { UserService } from "../services/UserService";

const userRouter = express.Router();
const userRepository = AppDataSource.getRepository(User);
const userService = new UserService(userRepository);
const refreshToken = AppDataSource.getRepository(RefreshToken);
const tokenService = new TokenService(refreshToken);

const userContoller = new UserController(userService, logger, tokenService);

userRouter.get(
    "/",
    authMiddleware,
    (req: Request, res: Response, next: NextFunction) =>
        userContoller.getUsers(req, res, next) as unknown as RequestHandler,
);

userRouter.get(
    "/:id",
    authMiddleware,
    (req: Request, res: Response, next: NextFunction) =>
        userContoller.getOneUser(req, res, next) as unknown as RequestHandler,
);
export default userRouter;
