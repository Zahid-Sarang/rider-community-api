import { Repository } from "typeorm";
import { User } from "../entity/User";
import { LimitedUserData, UserData, UserRelationshipData } from "../types";
import bcrypt from "bcryptjs";
import createHttpError from "http-errors";

export class UserService {
    constructor(private userRepository: Repository<User>) {}
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
            relations: ["itineraries", "memories", "likes", "comments", "followers", "following"],
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

    async addFollowers(userId: number, targetUserId: number) {
        const user = await this.findById(userId);

        const targetUser = await this.userRepository.findOne({
            where: {
                id: targetUserId,
            },
        });

        if (user && targetUser) {
            user.following.push(targetUser);
            await this.userRepository.save(user);
        }
    }

    async removeFollowers(userId: number, targetUserId: number) {
        const user = await this.findById(userId);

        if (user) {
            user.following = user.following.filter((u) => u.id !== targetUserId);
            await this.userRepository.save(user);
        }
    }
}
