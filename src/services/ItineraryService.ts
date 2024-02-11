import createHttpError from "http-errors";
import { Brackets, Repository } from "typeorm";
import { Itinerary } from "../entity/Itinerary";
import { User } from "../entity/User";
import { ItineraryData, QueryParams, UpdateItineraryData } from "../types";
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

    async getItinerary(validatedQuery: QueryParams) {
        try {
            const queryBuilder = this.itineraryRepository.createQueryBuilder("itinerary");
            if (validatedQuery.q) {
                const searchTerm = `%${validatedQuery.q}%`;
                queryBuilder.where(
                    new Brackets((db) => {
                        db.where(
                            "CONCAT(itinerary.tripTitle, ' ', itinerary.startPoint) ILike :q",
                            {
                                q: searchTerm,
                            },
                        ).orWhere("itinerary.endingPoint ILike :q", { q: searchTerm });
                    }),
                );

                const result = await queryBuilder.getManyAndCount();
                return result;
            } else {
                return this.itineraryRepository.findAndCount({
                    relations: ["joinedUsers", "user"],
                });
            }
        } catch (error) {
            throw error;
        }
    }

    async getitineraryById(id: number) {
        return this.itineraryRepository.findOne({
            where: {
                id,
            },
            relations: ["joinedUsers", "user"],
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
            const userInfo = await this.userRepository.findOne({
                where: {
                    id: userId,
                },
                relations: ["joinedItineraries"],
            });

            const itineraryInfo = await this.itineraryRepository.findOne({
                where: {
                    id: itineraryId,
                },
            });

            if (!userInfo || !itineraryInfo) {
                const error = createHttpError(400, "User or Itinerary not found!");
                throw error;
            }
            // Check if the user is already joined to the itinerary
            if (!userInfo.joinedItineraries.some((i) => i.id === itineraryInfo.id)) {
                userInfo.joinedItineraries.push(itineraryInfo); // If not joined, add the user to the itinerary and save changes
                return await this.userRepository.save(userInfo);
            } else {
                const error = createHttpError(400, "User is already joined to the itinerary!");
                throw error;
            }
        } catch (err) {
            throw err;
        }
    }

    async leaveItineraries(userId: number, itineraryId: number) {
        try {
            const userInfo = await this.userRepository.findOne({
                where: {
                    id: userId,
                },
                relations: ["joinedItineraries"],
            });

            const itineraryInfo = await this.itineraryRepository.findOne({
                where: {
                    id: itineraryId,
                },
            });

            if (!userInfo || !itineraryInfo) {
                const error = createHttpError(400, "User or Itinerary not found!");
                throw error;
            }

            // Check if the user is joined to the itinerary
            if (userInfo.joinedItineraries.some((i) => i.id === itineraryInfo.id)) {
                // If joined, remove the user from the itinerary and save changes
                userInfo.joinedItineraries = userInfo.joinedItineraries.filter(
                    (i) => i.id !== itineraryInfo.id,
                );
                return await this.userRepository.save(userInfo);
            } else {
                const error = createHttpError(400, "User is not joined to the itinerary!");
                throw error;
            }
        } catch (err) {
            throw err;
        }
    }
}
