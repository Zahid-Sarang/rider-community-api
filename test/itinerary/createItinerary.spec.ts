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

    describe("Given all fields", () => {
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
            // Token generate
            const accessToken = jwks.token({
                sub: "1",
            });

            // images path
            const imagePath = path.join(__dirname, "/image/destination.jpg");
            console.log(imagePath);

            // Itinerary Data
            const itineraryData = {
                tripTitle: "Mountain Adventure",
                tripDescription: "Exploring the scenic mountains",
                tripDuration: "5 days",
                startDateTime: "2024-01-15T08:00:00Z",
                endDateTime: "2024-01-20T18:00:00Z",
                startPoint: "Base Camp",
                endingPoint: "Summit",
                userId: 1,
            };

            // send request
            const response = await request(app)
                .post("/itinerary")
                .set("Cookie", [`accessToken=${accessToken}`])
                .field("tripTitle", itineraryData.tripTitle)
                .field("tripDescription", itineraryData.tripDescription)
                .field("tripDuration", itineraryData.tripDuration)
                .field("startDateTime", itineraryData.startDateTime)
                .field("endDateTime", itineraryData.endDateTime)
                .field("startPoint", itineraryData.startPoint)
                .field("endingPoint", itineraryData.endingPoint)
                .field("userId", itineraryData.userId.toString())
                .attach("destinationImage", imagePath);
            const itineraryRepository = connection.getRepository(Itinerary);
            const itinerary = await itineraryRepository.find();
            expect(itinerary).toHaveLength(1);
        });
    });
});
