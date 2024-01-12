import createHttpError from "http-errors";
import { Repository } from "typeorm";
import { Memories } from "../entity/Memory";
import { MemoryData } from "../types";

export class MemoryService {
    constructor(private memoryRepository: Repository<Memories>) {}

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
        }
    }
}