import createHttpError from "http-errors";
import { Repository } from "typeorm";
import { Itinerary } from "../entity/Itinerary";
import { ItineraryData } from "../types";

export class ItineraryService {
    constructor(private itineraryRepository: Repository<Itinerary>) {}

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
                userId,
            });
        } catch (err) {
            const error = createHttpError(500, "Failed to create itinerary!");
            throw error;
        }
    }
}
