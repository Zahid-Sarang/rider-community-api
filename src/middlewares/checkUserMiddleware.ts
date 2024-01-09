import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { AuthRequest } from "../types";

export const canAccess = () => {
    return (req: Request, res: Response, next: NextFunction) => {
        const _req = req as AuthRequest;
        const userId = _req.auth.sub;
        if (userId !== req.params.id) {
            const error = createHttpError(400, "you can't update this user info");
            next(error);
            return;
        }
        next();
    };
};
