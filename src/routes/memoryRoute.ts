import express from "express";
import { MemoryController } from "../controllers/MemoryController";

const memoryRoute = express.Router();
const memoryController = new MemoryController();

memoryRoute.post("/", (req, res, next) => memoryController.createMemories(req, res, next));

export default memoryRoute;
