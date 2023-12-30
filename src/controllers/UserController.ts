import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { Logger } from "winston";
import { TokenService } from "../services/TokenService";
import { UserService } from "../services/UserService";

export class UserController {
    constructor(
        private userService: UserService,
        private logger: Logger,
        private tokenService: TokenService,
    ) {}
    async getUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const userList = await this.userService.getAll();
            this.logger.info("All users have been fetched");
            res.json(userList);
        } catch (error) {
            next(error);
        }
    }

    async getOneUser(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.params.id;

            if (isNaN(Number(userId))) {
                next(createHttpError(400, "Invalid url params!"));
                return;
            }
            const user = await this.userService.findById(Number(userId));
            if (!user) {
                next(createHttpError(400, "User does not exist!"));
                return;
            }
            this.logger.info("User has been fetched", { id: user.id });
            res.json(user);
        } catch (error) {
            next(error);
        }
    }
}
