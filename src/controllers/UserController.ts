import { NextFunction, Request, Response } from "express";
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
}
