import { MigrationInterface, QueryRunner } from "typeorm";

export class ItinerariesCascade1705818738741 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "itinerary" DROP CONSTRAINT "FK_fe8aa2e64e4676c7dd623eb6349"`,
        );

        await queryRunner.query(
            `ALTER TABLE "itinerary" ADD CONSTRAINT "FK_fe8aa2e64e4676c7dd623eb6349" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "itinerary" DROP CONSTRAINT "FK_fe8aa2e64e4676c7dd623eb6349"`,
        );

        await queryRunner.query(
            `ALTER TABLE "itinerary" ADD CONSTRAINT "FK_fe8aa2e64e4676c7dd623eb6349" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }
}
