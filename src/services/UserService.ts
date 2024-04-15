/* eslint-disable no-useless-catch */
import { Brackets, In, Not, Repository } from "typeorm";
import { User } from "../entity/User";
import {
    LimitedUserData,
    QueryParams,
    UserData,
    UserQueryParams,
    UserRelationshipData,
} from "../types";
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
            relations: [
                "itineraries",
                "memories",
                "likes.user",
                "comments.user",
                "followers",
                "following",
                "joinedItineraries",
            ],
        });
    }

    async getAll(validatedQuery: QueryParams) {
        try {
            const queryBuilder = this.userRepository.createQueryBuilder("user");
            if (validatedQuery.q) {
                const searchTerm = `%${validatedQuery.q}%`;
                queryBuilder.where(
                    new Brackets((db) => {
                        db.where("CONCAT(user.firstName, ' ', user.lastName) ILike :q", {
                            q: searchTerm,
                        });
                    }),
                );

                const result = await queryBuilder.getManyAndCount();
                return result;
            } else {
                return await this.userRepository.findAndCount({
                    relations: [
                        "itineraries",
                        "memories",
                        "likes",
                        "comments",
                        "followers",
                        "following",
                    ],
                });
            }
        } catch (error) {
            throw error;
        }
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
    async getUnfollowedUsers(userId: number, validatedQuery: UserQueryParams) {
        const followedUserIds = await this.getFollowedUserIds(userId);
        const offset = (validatedQuery.currentPage - 1) * validatedQuery.perPage;

        const queryBuilder = this.userRepository.createQueryBuilder("user");

        if (followedUserIds.length > 0) {
            queryBuilder.where("user.id NOT IN (:...ids)", { ids: [...followedUserIds, userId] });
        } else {
            queryBuilder.where("user.id != :userId", { userId });
        }

        const users = await queryBuilder
            .skip(offset)
            .take(validatedQuery.perPage)
            .getManyAndCount();

        return users;
    }

    private async getFollowedUserIds(userId: number): Promise<number[]> {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ["following"],
        });

        return user ? user.following.map((followedUser) => followedUser.id) : [];
    }
}
