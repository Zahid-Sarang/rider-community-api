import request from "supertest";
import createJWKSMock from "mock-jwks";
import { DataSource } from "typeorm";
import app from "../../src/app";
import { AppDataSource } from "../../src/config/data-source";
import { User } from "../../src/entity/User";
import { Itinerary } from "../../src/entity/Itinerary";
import path from "path";

describe("POST/itinerary", () => {
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

    describe.skip("Given all fields", () => {
        it("should return 201 status code", async () => {
            //  Token generate
            const accessToken = jwks.token({
                sub: "1",
            });

            // send request
            const response = await request(app)
                .post("/itinerary")
                .set("Cookie", [`accessToken=${accessToken}`])
                .send();

            expect(response.statusCode).toBe(201);
        });
        it("should return a valid json object", async () => {
            //  Token generate
            const accessToken = jwks.token({
                sub: "1",
            });

            // send request
            const response = await request(app)
                .post("/itinerary")
                .set("Cookie", [`accessToken=${accessToken}`])
                .send();

            expect((response.headers as Record<string, string>)["content-type"]).toEqual(
                expect.stringContaining("json"),
            );
        });
        it("should persist the itinerary data in database", async () => {
            
        });
    });
});
