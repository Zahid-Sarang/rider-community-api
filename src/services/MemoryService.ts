import createHttpError from "http-errors";
import { Repository } from "typeorm";
import { Comment } from "../entity/Comment";
import { Like } from "../entity/Like";
import { Memories } from "../entity/Memory";
import { User } from "../entity/User";
import { CommentData, MemoryData, UpdateMemoriesData } from "../types";
import { CloudinaryService } from "./Cloudinary";

export class MemoryService {
    constructor(
        private memoryRepository: Repository<Memories>,
        private cloudinaryService: CloudinaryService,
        private userRepository: Repository<User>,
        private likeRepository: Repository<Like>,
        private commentRepository: Repository<Comment>,
    ) {}

    async createMemory({ title, description, image, userId }: MemoryData) {
        try {
            return await this.memoryRepository.save({
                title,
                description,
                image,
                user: { id: userId },
            });
        } catch (err) {
            const error = createHttpError(500, "Failed to create Memory");
            throw error;
        }
    }

    async getAllMemories() {
        return this.memoryRepository.find({
            relations: ["user", "likes", "comments", "likes.user"],
        });
    }

    async getMemoryById(id: number) {
        return this.memoryRepository.findOne({
            where: {
                id,
            },
            relations: ["user", "likes", "comments", "likes.user", "comments.user"],
        });
    }

    async deleteById(id: number) {
        try {
            const memory = await this.memoryRepository.findOne({
                where: {
                    id,
                },
            });
            if (!memory) {
                const error = createHttpError(
                    400,
                    "Memory with ID ${itineraryId} not found.nerary!",
                );
                throw error;
            }
            const imageUrl = memory?.image;
            if (imageUrl) {
                await this.cloudinaryService.destroyFile(imageUrl);
            }
            return await this.memoryRepository.delete(id);
        } catch (error) {
            throw error;
        }
    }

    async updatememories(memoryId: number, { title, description, image }: UpdateMemoriesData) {
        try {
            return await this.memoryRepository.update(memoryId, {
                title,
                description,
                image,
            });
        } catch (error) {
            throw error;
        }
    }

    async addAndRemoveLikes(userId: number, memoryId: number) {
        try {
            const user = await this.userRepository.findOne({
                where: {
                    id: userId,
                },
            });
            if (!user) {
                const error = createHttpError(400, "user not found!");
                throw error;
            }
            const memory = await this.memoryRepository.findOne({
                where: {
                    id: memoryId,
                },
            });
            if (!memory) {
                const error = createHttpError(400, "memory not found!");
                throw error;
            }

            const isLikeExist = await this.likeRepository.findOne({
                where: {
                    user: { id: userId },
                    memory: { id: memoryId },
                },
            });

            if (isLikeExist) {
                // User has already liked this memory, remove the like
                await this.likeRepository.remove(isLikeExist);
            } else {
                // User has not liked this memory, add a new like
                const newLike = this.likeRepository.create({
                    user,
                    memory,
                });

                await this.likeRepository.save(newLike);
            }

            // Optionally, you can update the memory entity to reflect the new like count
            memory.likes = await this.likeRepository.find({ where: { memory: { id: memory.id } } });
            await this.memoryRepository.save(memory);
        } catch (error) {
            throw error;
        }
    }

    async addComments({ text, userId, memoryId }: CommentData) {
        try {
            return await this.commentRepository.save({
                text,
                user: { id: userId },
                memory: { id: memoryId },
            });
        } catch (error) {
            throw error;
        }
    }

    async memoriesUserCanSee(userId: number) {
        const queryBuilder = this.memoryRepository.createQueryBuilder("memory");
        const result = queryBuilder
            // Join memory's user
            .leftJoinAndSelect("memory.user", "user")
            // Left join likes with associated user information
            .leftJoinAndSelect("memory.likes", "likes")
            .leftJoin("likes.user", "likedUser")
            // Specify the fields you want to select for the liked user
            .addSelect([
                "likedUser.id",
                "likedUser.userName",
                "likedUser.firstName",
                "likedUser.lastName",
                "likedUser.email",
                "likedUser.profilePhoto",
                "likedUser.coverPhoto",
                "likedUser.bio",
                "likedUser.location",
                "likedUser.bikeDetails",
            ])
            // Left join comments
            .leftJoinAndSelect("memory.comments", "comments")
            // Left join user's followers
            .leftJoin("user.followers", "follower", "follower.id = :userId", { userId })
            // Filter memories based on user and followed users
            .where("memory.user = :userId OR follower.id IS NOT NULL", { userId })
            .orderBy("memory.createdAt", "DESC");

        return result.getMany();
    }
}
