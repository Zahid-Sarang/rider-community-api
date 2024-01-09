import { NextFunction, Request, Response } from "express";

export class ItineraryController {
    constructor() {}

    async createitinerary(req: Request, res: Response, next: NextFunction) {
        res.status(201).json();
    }
}
