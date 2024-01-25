import express, { NextFunction, Request, RequestHandler, Response } from "express";
import { AppDataSource } from "../config/data-source";
import logger from "../config/logger";
import { ItineraryController } from "../controllers/ItineraryController";
import { Itinerary } from "../entity/Itinerary";
import { User } from "../entity/User";
import authMiddleware from "../middlewares/authMiddleware";
import { upload } from "../middlewares/multerMiddleware";
import { CloudinaryService } from "../services/Cloudinary";
import { ItineraryService } from "../services/ItineraryService";
import { UserService } from "../services/UserService";
import itineraryValidators from "../validators/itinerary-validators";
import updateItineriesValidators from "../validators/update-itineries-validators";

const itineraryRouter = express.Router();
const cloudinaryService = new CloudinaryService();
const itineraryRepository = AppDataSource.getRepository(Itinerary);

const userRepository = AppDataSource.getRepository(User);
const itineraryService = new ItineraryService(
    itineraryRepository,
    cloudinaryService,
    userRepository,
);
const userService = new UserService(userRepository);
const itineraryController = new ItineraryController(
    cloudinaryService,
    logger,
    itineraryService,
    userService,
);

itineraryRouter.post(
    "/",
    upload.single("destinationImage"),
    authMiddleware as RequestHandler,
    itineraryValidators,
    (req: Request, res: Response, next: NextFunction) =>
        itineraryController.createItinerary(req, res, next),
);

itineraryRouter.get(
    "/",
    authMiddleware as RequestHandler,
    (req: Request, res: Response, next: NextFunction) =>
        itineraryController.getAllItinerary(req, res, next),
);

itineraryRouter.get(
    "/:id",
    authMiddleware as RequestHandler,
    (req: Request, res: Response, next: NextFunction) =>
        itineraryController.getOneItineray(req, res, next),
);

itineraryRouter.patch(
    "/:id",
    upload.single("destinationImage"),
    updateItineriesValidators,
    authMiddleware as RequestHandler,
    (req: Request, res: Response, next: NextFunction) =>
        itineraryController.updateItinerary(req, res, next),
);

itineraryRouter.delete(
    "/:id",
    authMiddleware as RequestHandler,
    (req: Request, res: Response, next: NextFunction) =>
        itineraryController.deleteItinerary(req, res, next),
);

itineraryRouter.post("/joinItinerary", authMiddleware as RequestHandler, (req, res, next) =>
    itineraryController.joinItineraries(req, res, next),
);
export default itineraryRouter;
