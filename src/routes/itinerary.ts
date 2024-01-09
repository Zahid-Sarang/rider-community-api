import express, { NextFunction, Request, RequestHandler, Response } from "express";
import { AppDataSource } from "../config/data-source";
import logger from "../config/logger";
import { ItineraryController } from "../controllers/ItineraryController";
import { Itinerary } from "../entity/Itinerary";
import authMiddleware from "../middlewares/authMiddleware";
import { upload } from "../middlewares/multerMiddleware";
import { CloudinaryService } from "../services/Cloudinary";
import { ItineraryService } from "../services/ItineraryService";

const itineraryRouter = express.Router();
const cloudinaryService = new CloudinaryService();
const itineraryRepository = AppDataSource.getRepository(Itinerary);
const itineraryService = new ItineraryService(itineraryRepository);
const itineraryController = new ItineraryController(cloudinaryService, logger, itineraryService);

itineraryRouter.post(
    "/",
    upload.single("destinationImage"),
    authMiddleware as RequestHandler,
    (req: Request, res: Response, next: NextFunction) =>
        itineraryController.createItinerary(req, res, next),
);

export default itineraryRouter;
