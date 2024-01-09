import express, { NextFunction, Request, RequestHandler, Response } from "express";
import { ItineraryController } from "../controllers/ItineraryController";
import authMiddleware from "../middlewares/authMiddleware";

const itineraryRouter = express.Router();

const itineraryController = new ItineraryController();

itineraryRouter.post(
    "/",
    authMiddleware as RequestHandler,
    (req: Request, res: Response, next: NextFunction) =>
        itineraryController.createitinerary(req, res, next),
);

export default itineraryRouter;
