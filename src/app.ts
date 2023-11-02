import "reflect-metadata";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { HttpError } from "http-errors";
import logger from "./config/logger";
import authRouter from "./routes/authRoute";
import cookieParser from "cookie-parser";
const app = express();
app.use(express.static("public"));
const corsOptions = {
    credentials: true,
    origin: "http://localhost:3000",
};
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.json());

app.use("/auth", authRouter);

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
