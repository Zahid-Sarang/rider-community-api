import { NextFunction, Response } from "express";
import { MemoryRequestData } from "../types";

export class MemoryController {
    constructor() {}

    async createMemories(req: MemoryRequestData, res: Response, next: NextFunction) {
        const { title, description, userId } = req.body;
        console.log(title, description, userId);
        res.json({ message: "Hello from memories" });
    }
}
