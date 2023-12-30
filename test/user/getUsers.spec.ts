import request from "supertest";
import createJWKSMock from "mock-jwks";
import { DataSource } from "typeorm";
import app from "../../src/app";
import { AppDataSource } from "../../src/config/data-source";
import { User } from "../../src/entity/User";

describe("GET/users", () => {
    let connection: DataSource;
    let jwks: ReturnType<typeof createJWKSMock>;

    beforeAll(async () => {
        jwks = createJWKSMock("http://localhost:8003");
        connection = await AppDataSource.initialize();
    });

    beforeEach(async () => {
        jwks.start();
        await connection.dropDatabase();
        await connection.synchronize();
    });

    afterEach(() => {
        jwks.stop();
    });

    afterAll(async () => {
        await connection.destroy();
    });

    describe("Given all fields", () => {
        it("should return 200 status code", async () => {
            const accessToken = jwks.token({
                sub: "1",
            });

            // Add token to cookie
            const response = await request(app)
                .get("/users/")
                .set("Cookie", [`accessToken=${accessToken}`])
                .send();
            expect(response.statusCode).toBe(200);
        });
    });

    it("should return List of All users", async () => {
        const userData = {
            userName: "john_doe",
            firstName: "Zahid",
            lastName: "Sarang",
            email: "zahidSarang@gmail.com",
            password: "password",
        };

        const adminToken = jwks.token({
            sub: "1",
        });

        const userRepository = connection.getRepository(User);
        await userRepository.save({
            ...userData,
        });

        const users = await userRepository.find();

        // Add token to cookie
        const response = await request(app)
            .get("/users/")
            .set("Cookie", [`accessToken=${adminToken}`])
            .send();

        const keys = Object.keys(response.body as Record<string, string>);

        const userArray = keys.map((key) => (response.body as Record<string, string>)[key]);
        expect(Array.isArray(userArray)).toBe(true);
        expect(userArray.length).toBe(users.length);
        for (let i = 0; i < users.length; i++) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            const userInResponse = response.body[i] as Record<string, string>;
            const userInDatabase = users[i];
            expect(userInResponse.email).toBe(userInDatabase.email);
        }
    });
});
