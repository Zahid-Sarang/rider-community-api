import { NextFunction, Response } from "express";
import { validationResult } from "express-validator";
import { Logger } from "winston";
import { UserService } from "../services/UserService";
import { AuthRequest, RegisterUserRequest } from "../types";
import { TokenService } from "../services/TokenService";
import { JwtPayload } from "jsonwebtoken";
import { CredentialService } from "../services/CredentialService";
import createHttpError from "http-errors";

export class AuthController {
    constructor(
        private userService: UserService,
        private logger: Logger,
        private tokenService: TokenService,
        private credentialsService: CredentialService,
    ) {}

    private setCookies(res: Response, accessToken: string, refreshToken: string) {
        res.cookie("accessToken", accessToken, {
            domain: "localhost",
            sameSite: "strict",
            maxAge: 1000 * 60 * 60, // 60 minutes
            httpOnly: true,
        });

        res.cookie("refreshToken", refreshToken, {
            domain: "localhost",
            sameSite: "strict",
            maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
            httpOnly: true,
        });
    }

    async register(req: RegisterUserRequest, res: Response, next: NextFunction) {
        // validate request fields
        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            return res.status(400).json({ errors: validationErrors.array() });
        }

        const { firstName, lastName, email, password } = req.body;
        this.logger.debug("New request to register a user: ", {
            firstName,
            lastName,
            email,
            password: "****",
        });
        try {
            const user = await this.userService.createUser({
                firstName,
                lastName,
                email,
                password,
            });
            this.logger.info("User has been registered", { id: user.id });

            // generate tokens
            const payload: JwtPayload = {
                sub: String(user.id),
                email: user.email,
            };

            const accessToken = this.tokenService.generateAccessToken(payload);
            const newRefreshToken = await this.tokenService.persistRefreshToken(user);
            const refreshToken = this.tokenService.generateRefreshToken({
                ...payload,
                id: String(newRefreshToken.id),
            });

            this.setCookies(res, accessToken, refreshToken);
            res.status(201).json({ id: user.id });
        } catch (error) {
            next(error);
        }
    }

    // Login Method
    async login(req: RegisterUserRequest, res: Response, next: NextFunction) {
        // Validation
        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            return res.status(400).json({ errors: validationErrors.array() });
        }

        const { email, password } = req.body;
        this.logger.debug("New request to register a user:", {
            email,
            password: "******",
        });

        // check if email is existing in database
        try {
            const user = await this.userService.findByEmail(email);
            if (!user) {
                const error = createHttpError(400, "Email and password dosn't match!");
                next(error);
                return;
            }

            // compare password
            const passwordMatch = await this.credentialsService.comparePassword(
                password,
                user.password,
            );
            if (!passwordMatch) {
                const error = createHttpError(400, "Email and password dosn't match!");
                next(error);
                return;
            }
            // generate token
            const payload: JwtPayload = {
                sub: String(user.id),
                email: user.email,
            };

            const accessToken = this.tokenService.generateAccessToken(payload);
            const newRefreshToken = await this.tokenService.persistRefreshToken(user);
            const refreshToken = this.tokenService.generateRefreshToken({
                ...payload,
                id: String(newRefreshToken.id),
            });

            this.setCookies(res, accessToken, refreshToken);
            this.logger.info("User hasb been logged in successfully", {
                id: user.id,
            });

            res.status(200).json({ id: user.id });
        } catch (err) {
            next(err);
            return;
        }
    }

    async self(req: AuthRequest, res: Response) {
        const user = await this.userService.findById(Number(req.auth.sub));
        res.json({ ...user, password: undefined });
    }

    async refresh(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const payload: JwtPayload = {
                sub: req.auth.sub,
                email: req.auth.email,
            };
            const accessToken = this.tokenService.generateAccessToken(payload);

            // Find the user by Id
            const user = await this.userService.findById(Number(req.auth.sub));
            if (!user) {
                const error = createHttpError(400, "User with token could not find");
                next(error);
                return;
            }

            const newRefreshToken = await this.tokenService.persistRefreshToken(user);

            // Delet Old Refresh Token
            await this.tokenService.deleteRefreshToken(Number(req.auth.id));

            const refreshToken = this.tokenService.generateRefreshToken({
                ...payload,
                id: String(newRefreshToken.id),
            });

            this.setCookies(res, accessToken, refreshToken);
            this.logger.info("new refresh token generated for", req.auth.sub);

            res.json();
        } catch (err) {
            next(err);
            return;
        }
    }

    async logout(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            await this.tokenService.deleteRefreshToken(Number(req.auth.id));
            this.logger.info("Refresh token has been deleted", {
                id: req.auth.id,
            });
            this.logger.info("User has been logged out", { id: req.auth.sub });

            res.clearCookie("accessToken");
            res.clearCookie("RefreshToken");
            res.json({ message: "Sucessfully logged out" });
        } catch (err) {
            next(err);
            return;
        }
    }
}
