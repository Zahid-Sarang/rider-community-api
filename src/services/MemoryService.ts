import createHttpError from "http-errors";
import { Repository } from "typeorm";
import { Memories } from "../entity/Memory";
import { MemoryData, UpdateMemoriesData } from "../types";
import { CloudinaryService } from "./Cloudinary";

export class MemoryService {
    constructor(
        private memoryRepository: Repository<Memories>,
        private cloudinaryService: CloudinaryService,
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
            relations: ["user", "likes", "comments"],
        });
    }

    async getMemoryById(id: number) {
        return this.memoryRepository.findOne({
            where: {
                id,
            },
            relations: ["user", "likes", "comments"],
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
        } catch (err) {
            const error = createHttpError(500, "Failed to delete Memory");
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
        } catch (err) {
            const error = createHttpError(500, "Failed to update Memory!");
            throw error;
        }
    }
}
