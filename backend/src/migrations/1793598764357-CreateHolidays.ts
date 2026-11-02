import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateHolidays1793598764357 implements MigrationInterface {
    name = 'CreateHolidays1793598764357'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "holidays" ("id" SERIAL NOT NULL, "name" character varying(150) NOT NULL, "date" date NOT NULL, "description" text, "category" character varying(20) NOT NULL, "region" character varying(50), "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3646bdd4c3817d954d830881dfe" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "holidays"`);
    }

}
