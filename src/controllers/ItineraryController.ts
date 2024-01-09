import { NextFunction, Request, Response } from "express";
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

        console.log(req.file);
        const destinationImagelocalPath = req.file?.path;

        console.log(destinationImagelocalPath);

        if (!destinationImagelocalPath) {
            return next(createHttpError(400, "Please Upload Image"));
        }

        const destinationImage = await this.cloudinaryService.uploadFile(destinationImagelocalPath);

        const itinerary = await this.itineraryService.createItinerary({
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
    }
}
