import "reflect-metadata";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { HttpError } from "http-errors";
import logger from "./config/logger";
import authRouter from "./routes/authRoute";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRoute";
import itineraryRouter from "./routes/itineraryRoute";
import memoryRouter from "./routes/memoryRoute";
import { Config } from "./config";
const app = express();
const ALLOWED_DOMAINS = [Config.CLIENT_URL!];

app.use(
    cors({
        credentials: true,
        origin: ALLOWED_DOMAINS,
    }),
);
app.use(express.static("public"));
app.use(cookieParser());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/itinerary", itineraryRouter);
app.use("/memory", memoryRouter);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
    logger.error(err.message);
    const statusCode = err.statusCode || err.status || 500;
    res.status(statusCode).json({
        errors: [
            {
                type: err.name,
                msg: err.message,
                path: "",
                location: "",
            },
        ],
    });
});

export default app;
