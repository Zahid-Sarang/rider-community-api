import { Repository } from "typeorm";
import { User } from "../entity/User";
import { UserData } from "../types";
import bcrypt from "bcrypt";
import createHttpError from "http-errors";

export class UserService {
    constructor(private userRepository: Repository<User>) {}
    async createUser({ firstName, lastName, email, password }: UserData) {
        // Check if user already exists
        const userEmail = await this.userRepository.findOne({
            where: { email: email },
        });
        if (userEmail) {
            const error = createHttpError(400, "Email is already exists!");
            throw error;
        }
        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        try {
            return await this.userRepository.save({
                firstName,
                lastName,
                email,
                password: hashedPassword,
            });
        } catch (err) {
            const error = createHttpError(500, "Failed to create user");
            throw error;
        }
    }

    async findByEmail(email: string) {
        return await this.userRepository.findOne({
            where: { email },
        });
    }
}
