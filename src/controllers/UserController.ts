import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import { Logger } from "winston";
import { CloudinaryService } from "../services/Cloudinary";
import { UserService } from "../services/UserService";
import { UpdateUserRequest, UserRelationshipRequestData } from "../types";
import fs from "fs";

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

        const userNameExist = await this.userService.findByUserName(userName);

        if (userNameExist) {
            if (profileLocalPath) {
                fs.unlinkSync(profileLocalPath);
            }
            if (coverLocalPath) {
                fs.unlinkSync(coverLocalPath);
            }
            next(createHttpError(400, "UserName Already Taken!"));
            return;
        }

        // upload profile photo on cloudinary
        const profilePhoto = profileLocalPath
            ? await this.cloudinaryService.uploadFile(profileLocalPath)
            : null;

        // upload cover photo on cloudinary
        const coverPhoto = coverLocalPath
            ? await this.cloudinaryService.uploadFile(coverLocalPath)
            : null;

        try {
            // delete previous image
            const userInfo = await this.userService.findById(Number(userId));
            if (profileLocalPath && userInfo?.profilePhoto) {
                await this.cloudinaryService.destroyFile(userInfo.profilePhoto);
            }
            if (coverLocalPath && userInfo?.coverPhoto) {
                await this.cloudinaryService.destroyFile(userInfo.coverPhoto);
            }

            await this.userService.update(Number(userId), {
                firstName,
                lastName,
                userName,
                profilePhoto: profilePhoto ? profilePhoto.url : undefined,
                coverPhoto: coverPhoto ? coverPhoto.url : undefined,
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
            // delete cloudinary image
            const userInfo = await this.userService.findById(Number(userId));

            const userProfileImage = userInfo?.profilePhoto;
            if (userProfileImage) {
                await this.cloudinaryService.destroyFile(userProfileImage);
            }

            const coverImage = userInfo?.coverPhoto;
            if (coverImage) {
                await this.cloudinaryService.destroyFile(coverImage);
            }

            await this.userService.deleteById(Number(userId));
            this.logger.info("User has been deleted!", {
                id: Number(userId),
            });
            res.json({ message: "User has been Deleted" });
        } catch (error) {
            next(error);
        }
    }

    async followUser(req: UserRelationshipRequestData, res: Response, next: NextFunction) {
        const validationError = validationResult(req);
        if (!validationError.isEmpty()) {
            return res.status(400).json({ error: validationError.array() });
        }
        try {
            const { followerId, followedId } = req.body;
            if (isNaN(Number(followerId)) || isNaN(Number(followedId))) {
                next(createHttpError(400, "Invalid url param!"));
                return;
            }
            await this.userService.addFollowers(Number(followerId), Number(followedId));
            res.status(200).json({ message: "User followed successfully." });
        } catch (error) {
            next(error);
        }
    }
}
