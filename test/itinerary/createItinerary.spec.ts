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
    let accessToken: string;

    beforeAll(async () => {
        jwks = createJWKSMock("http://localhost:8003");
        connection = await AppDataSource.initialize();
    });

    beforeEach(async () => {
        jwks.start();
        await connection.dropDatabase();
        await connection.synchronize();

        accessToken = jwks.token({
            sub: "1",
        });
    });

    afterEach(() => {
        jwks.stop();
    });

    afterAll(async () => {
        await connection.destroy();
    });

    describe.skip("Given all fields", () => {
        it("should return 201 status code", async () => {
            // send request
            const filePath = path.join(__dirname, "image/destination.jpg");
            console.log("path", filePath);
            const response = await request(app)
                .post("/itinerary")
                .set("Cookie", [`accessToken=${accessToken}`])
                .field("tripTitle", "Your Trip Title")
                .field("tripDescription", "Your Trip Description")
                .field("tripDuration", "Your Trip Duration")
                .field("startDateTime", "Your Start Date and Time")
                .field("endDateTime", "Your End Date and Time")
                .field("startPoint", "Your Start Point")
                .field("endingPoint", "Your Ending Point")
                .field("userId", 123) // Replace with the actual user ID
                .attach("destinationImage", filePath); // Attach the image with the field name

            expect(response.statusCode).toBe(201);
        });
    });
});
