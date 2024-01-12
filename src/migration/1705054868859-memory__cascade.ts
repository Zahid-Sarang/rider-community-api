import { MigrationInterface, QueryRunner } from "typeorm";

export class Memory_cascade1705054868859 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "memories" DROP CONSTRAINT "FK_09f2d38267f7e0cf58060592a16"`,
        );

        await queryRunner.query(
            `ALTER TABLE "memories" ADD CONSTRAINT "FK_09f2d38267f7e0cf58060592a16" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "memories" DROP CONSTRAINT "FK_09f2d38267f7e0cf58060592a16"`,
        );

        await queryRunner.query(
            `ALTER TABLE "memories" ADD CONSTRAINT "FK_09f2d38267f7e0cf58060592a16" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }
}
