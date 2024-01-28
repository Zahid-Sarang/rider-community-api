import { Repository } from "typeorm";
import { User } from "../entity/User";
import { LimitedUserData, UserData, UserRelationshipData } from "../types";
import bcrypt from "bcryptjs";
import createHttpError from "http-errors";
import { UserRelationship } from "../entity/UserRelationship";

export class UserService {
    constructor(
        private userRepository: Repository<User>,
        private userRelationShipRepository: Repository<UserRelationship>,
    ) {}
    async createUser({ firstName, lastName, email, password, userName }: UserData) {
        // Check if user already exists
        const userEmail = await this.userRepository.findOne({
            where: { email: email },
        });
        if (userEmail) {
            const error = createHttpError(400, "Email is already exists!");
            throw error;
        }
        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        try {
            return await this.userRepository.save({
                userName,
                firstName,
                lastName,
                email,
                password: hashedPassword,
            });
        } catch (err) {
            const error = createHttpError(500, "Failed to create user");
            throw error;
        }
    }

    async findByEmail(email: string) {
        return await this.userRepository.findOne({
            where: { email },
            select: [
                "id",
                "firstName",
                "lastName",
                "userName",
                "profilePhoto",
                "password",
                "coverPhoto",
                "bio",
                "location",
                "bikeDetails",
            ],
        });
    }

    async findById(id: number) {
        return await this.userRepository.findOne({
            where: { id },
            relations: ["itineraries", "memories", "likes", "comments", "followers", "following"],
        });
    }

    async getAll() {
        return await this.userRepository.find({
            relations: ["itineraries", "memories", "likes", "comments"],
        });
    }

    async findByUserName(userName: string) {
        return await this.userRepository.findOne({
            where: {
                userName,
            },
        });
    }

    async update(
        userId: number,
        {
            firstName,
            lastName,
            userName,
            profilePhoto,
            coverPhoto,
            bio,
            location,
            bikeDetails,
        }: LimitedUserData,
    ) {
        try {
            return await this.userRepository.update(userId, {
                firstName,
                lastName,
                userName,
                profilePhoto,
                coverPhoto,
                bio,
                location,
                bikeDetails,
            });
        } catch (error) {
            throw error;
        }
    }

    async deleteById(userId: number) {
        return await this.userRepository.delete(userId);
    }

    async addFollowers(followerId: number, followedId: number) {
        const follower = await this.findById(followerId);
        const followed = await this.findById(followedId);

        if (!follower || !followed) {
            const error = createHttpError(400, "Users Not Found!");
            throw error;
        }

        const userRelationship = new UserRelationship();
        userRelationship.follower = follower;
        userRelationship.followed = followed;

        try {
            await this.userRelationShipRepository.save(userRelationship);
            return "Successfully followed the user!";
        } catch (error) {
            throw error;
        }
    }
}
