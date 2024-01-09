import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import { Logger } from "winston";
import { CloudinaryService } from "../services/Cloudinary";
import { ItineraryService } from "../services/ItineraryService";
import { ItineraryRequestData } from "../types";

export class ItineraryController {
    constructor(
        private cloudinaryService: CloudinaryService,
        private logger: Logger,
        private itineraryService: ItineraryService,
    ) {}

    async createItinerary(req: ItineraryRequestData, res: Response, next: NextFunction) {
        // Validation
        const validationError = validationResult(req);
        if (!validationError.isEmpty()) {
            return res.status(400).json({ errors: validationError.array() });
        }
        const {
            tripTitle,
            tripDescription,
            tripDuration,
            startDateTime,
            endDateTime,
            startPoint,
            endingPoint,
            userId,
        } = req.body;
        const destinationImagelocalPath = req.file?.path;

        // validate image path
        if (!destinationImagelocalPath) {
            return next(createHttpError(400, "Please Upload Image"));
        }
        try {
            // upload image on Cloudinary
            const destinationImage =
                await this.cloudinaryService.uploadFile(destinationImagelocalPath);

            // store data in database
            await this.itineraryService.createItinerary({
                tripTitle,
                tripDescription,
                tripDuration,
                startDateTime,
                endDateTime,
                startPoint,
                endingPoint,
                destinationImage: destinationImage.url,
                userId,
            });

            res.status(201).json({ message: "Itinerary Created SuccessFully!" });
        } catch (error) {
            next(error);
        }
    }

    async getAllItinerary(req: Request, res: Response, next: NextFunction) {
        try {
            const itineraries = await this.itineraryService.getItinerary();
            res.json(itineraries);
        } catch (error) {
            next(error);
        }
    }
}
