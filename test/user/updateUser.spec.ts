import request from "supertest";
import createJWKSMock from "mock-jwks";
import { DataSource } from "typeorm";
import app from "../../src/app";
import { AppDataSource } from "../../src/config/data-source";
import { User } from "../../src/entity/User";

describe("PATCH/users/:id", () => {
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
            const userData = {
                userName: "john_doe",
                firstName: "Zahid",
                lastName: "Sarang",
                email: "zahidSarang@gmail.com",
                password: "password",
            };
            const userRepository = connection.getRepository(User);
            const users = await userRepository.save(userData);
            const id = users.id;

            const updateData = {
                firstname: "tester",
                lastName: "developer",
            };

            // Add token to cookie
            const response = await request(app)
                .patch(`/users/${id}`)
                .set("Cookie", [`accessToken=${accessToken}`])
                .send(updateData);
            expect(response.statusCode).toBe(200);
        });
    });
});
