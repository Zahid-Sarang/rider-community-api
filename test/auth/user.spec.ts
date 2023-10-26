import app from "../../src/app";
import { AppDataSource } from "../../src/config/data-source";
import { DataSource } from "typeorm";
import request from "supertest";
import { User } from "../../src/entity/User";
import createJWKSMock from "mock-jwks";
describe("POST /auth/login", () => {
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
                .get("/auth/self")
                .set("Cookie", [`accessToken=${accessToken}`])
                .send();
            expect(response.statusCode).toBe(200);
        });

        it("should return user data ", async () => {
            // Arrange
            // Register user
            const userData = {
                firstName: "zahid",
                lastName: "sarang",
                email: "zahid@gmail.com",
                password: "password",
            };
            const userRepository = connection.getRepository(User);
            const data = await userRepository.save(userData);

            // Generate Token
            const accessToken = jwks.token({
                sub: String(data.id),
            });

            // Add token to cookie
            const response = await request(app)
                .get("/auth/self")
                .set("Cookie", [`accessToken=${accessToken}`])
                .send();

            // Assert
            // check if user id matches with registered user
            expect((response.body as Record<string, string>).id).toBe(data.id);
        });

        it("should not return passwors d field ", async () => {
            // Arrange
            // Register user
            const userData = {
                firstName: "zahid",
                lastName: "sarang",
                email: "zahid@gmail.com",
                password: "password",
            };
            const userRepository = connection.getRepository(User);
            const data = await userRepository.save(userData);

            // Generate Token
            const accessToken = jwks.token({
                sub: String(data.id),
            });

            // Add token to cookie
            const response = await request(app)
                .get("/auth/self")
                .set("Cookie", [`accessToken=${accessToken}`])
                .send();

            // Assert
            // check if user id matches with registered user
            expect(response.body as Record<string, string>).not.toHaveProperty("password");
        });

        it("should return 401 status code if token is missing ", async () => {
            // Arrange
            // Register user
            const userData = {
                firstName: "zahid",
                lastName: "sarang",
                email: "zahid@gmail.com",
                password: "password",
            };
            const userRepository = connection.getRepository(User);
            await userRepository.save(userData);

            // Add token to cookie
            const response = await request(app).get("/auth/self").send();

            // Assert
            // check if user id matches with registered user
            expect(response.statusCode).toBe(401);
        });
    });
});
