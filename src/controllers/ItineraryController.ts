import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import { Logger } from "winston";
import { CloudinaryService } from "../services/Cloudinary";
import { ItineraryService } from "../services/ItineraryService";
import { UserService } from "../services/UserService";
import { ItineraryRequestData, UpdateItineriesRequestData } from "../types";

export class ItineraryController {
    constructor(
        private cloudinaryService: CloudinaryService,
        private logger: Logger,
        private itineraryService: ItineraryService,
        private userSerivce: UserService,
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

        // validate Time

        // validate image path
        const destinationImagelocalPath = req.file?.path;
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

    async updateItinerary(req: UpdateItineriesRequestData, res: Response, next: NextFunction) {
        // validate itinerary Id
        const itineraryId = req.params.id;
        if (isNaN(Number(itineraryId))) {
            next(createHttpError(400, "Invalid url param!"));
            return;
        }

        // validate request fields
        const validationError = validationResult(req);
        if (!validationError.isEmpty()) {
            return res.status(400).json({ error: validationError.array() });
        }

        const {
            tripTitle,
            tripDescription,
            tripDuration,
            startDateTime,
            endDateTime,
            startPoint,
            endingPoint,
        } = req.body;

        // validate ImagePath
        const destinationImagelocalPath = req.file?.path;
        if (!destinationImagelocalPath) {
            return next(createHttpError(400, "Please Upload Image"));
        }

        try {
            // upload image to cloudinary
            const destinationImage =
                await this.cloudinaryService.uploadFile(destinationImagelocalPath);

            // destory previos image
            const itineraryInfo = await this.itineraryService.getitineraryById(Number(itineraryId));
            if (itineraryInfo?.destinationImage) {
                await this.cloudinaryService.destroyFile(itineraryInfo.destinationImage);
            }

            // update Itinerary
            await this.itineraryService.updateItineries(Number(itineraryId), {
                tripTitle,
                tripDescription,
                tripDuration,
                startDateTime,
                endDateTime,
                startPoint,
                endingPoint,
                destinationImage: destinationImage.url,
            });
            res.json({ message: "Itinerary updated!" });
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

    async getOneItineray(req: Request, res: Response, next: NextFunction) {
        try {
            const itineraryId = req.params.id;
            if (isNaN(Number(itineraryId))) {
                next(createHttpError(400, "Invalid url param!"));
                return;
            }
            const itinerary = await this.itineraryService.getitineraryById(Number(itineraryId));
            if (!itinerary) {
                next(createHttpError(400, "Itinerary does not exist!"));
                return;
            }
            res.json(itinerary);
        } catch (error) {
            next(error);
        }
    }

    async deleteItinerary(req: Request, res: Response, next: NextFunction) {
        const itineraryId = req.params.id;

        if (isNaN(Number(itineraryId))) {
            next(createHttpError(400, "Invalid url param!"));
            return;
        }

        try {
            await this.itineraryService.deleteById(Number(itineraryId));
            res.json({ message: "Itinerary Deleted" });
        } catch (error) {
            next(error);
        }
    }

    async joinItineraries(req: ItineraryRequestData, res: Response, next: NextFunction) {
        const itineraryId = req.params.id;

        if (isNaN(Number(itineraryId))) {
            next(createHttpError(400, "Invalid url param!"));
            return;
        }

        try {
            const { userId } = req.body;
            if (!userId) {
                next(createHttpError(400, "Please give user info!"));
                return;
            }
            await this.itineraryService.joinItineraries(Number(userId), Number(itineraryId));
            res.json({ message: "Itinerary Joined" });
        } catch (error) {
            next(error);
        }
    }
}
