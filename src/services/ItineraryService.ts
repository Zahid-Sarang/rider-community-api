import createHttpError from "http-errors";
import { Repository } from "typeorm";
import { Itinerary } from "../entity/Itinerary";
import { User } from "../entity/User";
import { ItineraryData, UpdateItineraryData } from "../types";
import { CloudinaryService } from "./Cloudinary";

export class ItineraryService {
    constructor(
        private itineraryRepository: Repository<Itinerary>,
        private cloudinaryService: CloudinaryService,
        private userRepository: Repository<User>,
    ) {}

    async createItinerary({
        tripTitle,
        tripDescription,
        tripDuration,
        startDateTime,
        endDateTime,
        startPoint,
        endingPoint,
        destinationImage,
        userId,
    }: ItineraryData) {
        try {
            return await this.itineraryRepository.save({
                tripTitle,
                tripDescription,
                tripDuration,
                startDateTime,
                endDateTime,
                startPoint,
                endingPoint,
                destinationImage,
                user: { id: userId },
            });
        } catch (err) {
            const error = createHttpError(500, "Failed to create itinerary!");
            throw error;
        }
    }

    async updateItineries(
        itineraryId: number,
        {
            tripTitle,
            tripDescription,
            tripDuration,
            startDateTime,
            endDateTime,
            startPoint,
            endingPoint,
            destinationImage,
        }: UpdateItineraryData,
    ) {
        try {
            return await this.itineraryRepository.update(itineraryId, {
                tripTitle,
                tripDescription,
                tripDuration,
                startDateTime,
                endDateTime,
                startPoint,
                endingPoint,
                destinationImage,
            });
        } catch (err) {
            const error = createHttpError(500, "Failed to update Itinerary!");
            throw error;
        }
    }

    async getItinerary() {
        return this.itineraryRepository.find({
            relations: ["participants", "user"],
        });
    }

    async getitineraryById(id: number) {
        return this.itineraryRepository.findOne({
            where: {
                id,
            },
            relations: ["participants", "user"],
        });
    }

    async deleteById(itineraryId: number) {
        const itinerary = await this.itineraryRepository.findOne({
            where: {
                id: itineraryId,
            },
        });
        if (!itinerary) {
            const error = createHttpError(
                400,
                "Itinerary with ID ${itineraryId} not found.nerary!",
            );
            throw error;
        }
        const imageUrl = itinerary?.destinationImage;
        console.log("imageUrl", imageUrl);
        await this.cloudinaryService.destroyFile(imageUrl);
        return await this.itineraryRepository.delete(itineraryId);
    }

    async joinItineraries(userId: number, itineraryId: number) {
        try {
            // fetch user and itinerary
            const userInfo = await this.userRepository.findOne({
                where: {
                    id: userId,
                },
            });
            if (!userInfo) {
                const error = createHttpError(400, "User not found!");
                throw error;
            }
            const itineraryInfo = await this.itineraryRepository.findOne({
                where: {
                    id: itineraryId,
                },
                relations: ["participants"],
            });
            if (!itineraryInfo) {
                const error = createHttpError(400, "Itinerary not found!");
                throw error;
            }

            // Check if the user already a participant
            const isParticipant = itineraryInfo.participants.some(
                (participant) => participant.id === userId,
            );
            if (isParticipant) {
                const error = createHttpError(400, "You already Joined!");
                throw error;
            }

            // add the user to the participants
            itineraryInfo.participants.push(userInfo);
            await this.itineraryRepository.save(itineraryInfo);
        } catch (err) {
            console.log(err);
            const error = createHttpError(500, "Failed to update Itinerary!");
            throw error;
        }
    }
}
