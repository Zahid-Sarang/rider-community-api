import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1713158837630 implements MigrationInterface {
    name = 'Migration1713158837630'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "itinerary" ("id" SERIAL NOT NULL, "tripTitle" character varying NOT NULL, "tripDescription" character varying NOT NULL, "tripDuration" character varying NOT NULL, "startDateTime" TIMESTAMP NOT NULL, "endDateTime" TIMESTAMP NOT NULL, "startPoint" character varying NOT NULL, "endingPoint" character varying NOT NULL, "destinationImage" character varying NOT NULL, "userId" integer, CONSTRAINT "PK_515a9607ae33d4536f40d60f85e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "userName" character varying NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "profilePhoto" character varying, "coverPhoto" character varying, "bio" character varying, "location" character varying, "bikeDetails" character varying, "joinDate" TIMESTAMP NOT NULL DEFAULT now(), "lastActive" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_226bb9aa7aa8a69991209d58f59" UNIQUE ("userName"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "comments" ("id" SERIAL NOT NULL, "text" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, "memoryId" integer, CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "memories" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "image" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_aaa0692d9496fe827b0568612f8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "likes" ("id" SERIAL NOT NULL, "userId" integer, "memoryId" integer, CONSTRAINT "PK_a9323de3f8bced7539a794b4a37" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "refreshTokens" ("id" SERIAL NOT NULL, "expiresAt" TIMESTAMP NOT NULL, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_c4a0078b846c2c4508473680625" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users_joined_itineraries_itinerary" ("usersId" integer NOT NULL, "itineraryId" integer NOT NULL, CONSTRAINT "PK_0c70c704c17b3cea36ae5b936d8" PRIMARY KEY ("usersId", "itineraryId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_75c3a7fb873b0f6d5118a4c638" ON "users_joined_itineraries_itinerary" ("usersId") `);
        await queryRunner.query(`CREATE INDEX "IDX_3e1ba2ffb83d6a29775f497bc5" ON "users_joined_itineraries_itinerary" ("itineraryId") `);
        await queryRunner.query(`CREATE TABLE "users_followers_users" ("usersId_1" integer NOT NULL, "usersId_2" integer NOT NULL, CONSTRAINT "PK_ee8a9c5a097f32b484caaeb3de7" PRIMARY KEY ("usersId_1", "usersId_2"))`);
        await queryRunner.query(`CREATE INDEX "IDX_8d63f6043394b4d32343bdea11" ON "users_followers_users" ("usersId_1") `);
        await queryRunner.query(`CREATE INDEX "IDX_1433e3275a501bc09f5c33c7ca" ON "users_followers_users" ("usersId_2") `);
        await queryRunner.query(`ALTER TABLE "itinerary" ADD CONSTRAINT "FK_fe8aa2e64e4676c7dd623eb6349" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_7e8d7c49f218ebb14314fdb3749" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_2495a72541bfa67ec7970afc978" FOREIGN KEY ("memoryId") REFERENCES "memories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "memories" ADD CONSTRAINT "FK_09f2d38267f7e0cf58060592a16" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "likes" ADD CONSTRAINT "FK_cfd8e81fac09d7339a32e57d904" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "likes" ADD CONSTRAINT "FK_9a0d8c5350655b34c5d7aa7bc14" FOREIGN KEY ("memoryId") REFERENCES "memories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "refreshTokens" ADD CONSTRAINT "FK_265bec4e500714d5269580a0219" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_joined_itineraries_itinerary" ADD CONSTRAINT "FK_75c3a7fb873b0f6d5118a4c6384" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "users_joined_itineraries_itinerary" ADD CONSTRAINT "FK_3e1ba2ffb83d6a29775f497bc5c" FOREIGN KEY ("itineraryId") REFERENCES "itinerary"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_followers_users" ADD CONSTRAINT "FK_8d63f6043394b4d32343bdea11d" FOREIGN KEY ("usersId_1") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "users_followers_users" ADD CONSTRAINT "FK_1433e3275a501bc09f5c33c7ca2" FOREIGN KEY ("usersId_2") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_followers_users" DROP CONSTRAINT "FK_1433e3275a501bc09f5c33c7ca2"`);
        await queryRunner.query(`ALTER TABLE "users_followers_users" DROP CONSTRAINT "FK_8d63f6043394b4d32343bdea11d"`);
        await queryRunner.query(`ALTER TABLE "users_joined_itineraries_itinerary" DROP CONSTRAINT "FK_3e1ba2ffb83d6a29775f497bc5c"`);
        await queryRunner.query(`ALTER TABLE "users_joined_itineraries_itinerary" DROP CONSTRAINT "FK_75c3a7fb873b0f6d5118a4c6384"`);
        await queryRunner.query(`ALTER TABLE "refreshTokens" DROP CONSTRAINT "FK_265bec4e500714d5269580a0219"`);
        await queryRunner.query(`ALTER TABLE "likes" DROP CONSTRAINT "FK_9a0d8c5350655b34c5d7aa7bc14"`);
        await queryRunner.query(`ALTER TABLE "likes" DROP CONSTRAINT "FK_cfd8e81fac09d7339a32e57d904"`);
        await queryRunner.query(`ALTER TABLE "memories" DROP CONSTRAINT "FK_09f2d38267f7e0cf58060592a16"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_2495a72541bfa67ec7970afc978"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_7e8d7c49f218ebb14314fdb3749"`);
        await queryRunner.query(`ALTER TABLE "itinerary" DROP CONSTRAINT "FK_fe8aa2e64e4676c7dd623eb6349"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1433e3275a501bc09f5c33c7ca"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8d63f6043394b4d32343bdea11"`);
        await queryRunner.query(`DROP TABLE "users_followers_users"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3e1ba2ffb83d6a29775f497bc5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_75c3a7fb873b0f6d5118a4c638"`);
        await queryRunner.query(`DROP TABLE "users_joined_itineraries_itinerary"`);
        await queryRunner.query(`DROP TABLE "refreshTokens"`);
        await queryRunner.query(`DROP TABLE "likes"`);
        await queryRunner.query(`DROP TABLE "memories"`);
        await queryRunner.query(`DROP TABLE "comments"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "itinerary"`);
    }

}
