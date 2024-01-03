import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import { Logger } from "winston";
import { CloudinaryService } from "../services/Cloudinary";
import { UserService } from "../services/UserService";
import { UpdateUserRequest } from "../types";

export class UserController {
    constructor(
        private userService: UserService,
        private logger: Logger,
        private cloudinaryService: CloudinaryService,
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
    async updateUser(req: UpdateUserRequest, res: Response, next: NextFunction) {
        const validationError = validationResult(req);
        if (!validationError.isEmpty()) {
            return res.status(400).json({ error: validationError.array() });
        }
        const { firstName, lastName, userName, bio, location, bikeDetails } = req.body;

        const userId = req.params.id;

        if (isNaN(Number(userId))) {
            next(createHttpError(400, "Invalid url param!"));
            return;
        }

        this.logger.debug("Request for updating a user", req.body);
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        const profileLocalPath = files?.profilePhoto?.[0]?.path;
        const coverLocalPath = files?.coverPhoto?.[0]?.path;

        // upload profile photo on cloudinary
        const profilePhoto = profileLocalPath
            ? await this.cloudinaryService.uploadFile(profileLocalPath)
            : null;

        // upload cover photo on cloudinary
        const coverPhoto = coverLocalPath
            ? await this.cloudinaryService.uploadFile(coverLocalPath)
            : null;

        try {
            await this.userService.update(Number(userId), {
                firstName,
                lastName,
                userName,
                profilePhoto: profilePhoto ? profilePhoto.url : "profileImages",
                coverPhoto: coverPhoto ? coverPhoto.url : "coverImages",
                bio,
                location,
                bikeDetails,
            });
            res.json({ message: "user updated!" });
        } catch (error) {
            next(error);
        }
    }

    async deleteUser(req: Request, res: Response, next: NextFunction) {
        const userId = req.params.id;
        if (isNaN(Number(userId))) {
            next(createHttpError(400, "Invalid url param!"));
            return;
        }
        try {
            // Delet the user
            await this.userService.deleteById(Number(userId));
            this.logger.info("User has been deleted!", {
                id: Number(userId),
            });
            res.json({ message: "User has been Deleted" });
        } catch (error) {
            next(error);
        }
    }
}
