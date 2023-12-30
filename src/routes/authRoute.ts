import express, { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import logger from "../config/logger";
import { AuthController } from "../controllers/AuthController";
import { RefreshToken } from "../entity/RefreshToken";
import { User } from "../entity/User";
import { UserService } from "../services/UserService";
import registerValidators from "../validators/register-validators";
import { TokenService } from "../services/TokenService";
import loginValidators from "../validators/login-validators";
import { CredentialService } from "../services/CredentialService";
import authMiddleware from "../middlewares/authMiddleware";
import { AuthRequest } from "../types";
import validateRefreshTokenMiddleware from "../middlewares/validateRefreshTokenMiddleware";
import parseRefreshToken from "../middlewares/parseRefreshToken";

const authRouter = express.Router();
const userRepository = AppDataSource.getRepository(User);
const userService = new UserService(userRepository);
const refreshToken = AppDataSource.getRepository(RefreshToken);
const tokenService = new TokenService(refreshToken);
const credentialsService = new CredentialService();
const authController = new AuthController(userService, logger, tokenService, credentialsService);

authRouter.post(
    "/register",
    registerValidators,
    (req: Request, res: Response, next: NextFunction) => authController.register(req, res, next),
);

authRouter.post("/login", loginValidators, (req: Request, res: Response, next: NextFunction) =>
    authController.login(req, res, next),
);

authRouter.get("/self", authMiddleware, (req: Request, res: Response) =>
    authController.self(req as AuthRequest, res),
);

authRouter.post(
    "/refreshToken",
    validateRefreshTokenMiddleware,
    (req: Request, res: Response, next: NextFunction) =>
        authController.refresh(req as AuthRequest, res, next),
);

authRouter.post(
    "/logout",
    authMiddleware,
    parseRefreshToken,
    (req: Request, res: Response, next: NextFunction) =>
        authController.logout(req as AuthRequest, res, next),
);



export default authRouter;
