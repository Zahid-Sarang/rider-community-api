import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserItineraryRefreshToken1704788788571 implements MigrationInterface {
    name = 'CreateUserItineraryRefreshToken1704788788571'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "userName" character varying NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "profilePhoto" character varying, "coverPhoto" character varying, "bio" character varying, "location" character varying, "bikeDetails" character varying, "joinDate" TIMESTAMP NOT NULL DEFAULT now(), "lastActive" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_226bb9aa7aa8a69991209d58f59" UNIQUE ("userName"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "itinerary" ("id" SERIAL NOT NULL, "tripTitle" character varying NOT NULL, "tripDescription" character varying NOT NULL, "tripDuration" character varying NOT NULL, "startDateTime" TIMESTAMP NOT NULL, "endDateTime" TIMESTAMP NOT NULL, "startPoint" character varying NOT NULL, "endingPoint" character varying NOT NULL, "destinationImage" character varying NOT NULL, "userId" integer, CONSTRAINT "PK_515a9607ae33d4536f40d60f85e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "refreshTokens" ("id" SERIAL NOT NULL, "expiresAt" TIMESTAMP NOT NULL, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_c4a0078b846c2c4508473680625" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "itinerary" ADD CONSTRAINT "FK_fe8aa2e64e4676c7dd623eb6349" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "refreshTokens" ADD CONSTRAINT "FK_265bec4e500714d5269580a0219" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "refreshTokens" DROP CONSTRAINT "FK_265bec4e500714d5269580a0219"`);
        await queryRunner.query(`ALTER TABLE "itinerary" DROP CONSTRAINT "FK_fe8aa2e64e4676c7dd623eb6349"`);
        await queryRunner.query(`DROP TABLE "refreshTokens"`);
        await queryRunner.query(`DROP TABLE "itinerary"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
