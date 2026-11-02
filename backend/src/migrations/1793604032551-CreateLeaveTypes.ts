import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateLeaveTypes1793604032551 implements MigrationInterface {
    name = 'CreateLeaveTypes1793604032551'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "leave_types" ("id" SERIAL NOT NULL, "code" character varying(30) NOT NULL, "name" character varying(100) NOT NULL, "description" text, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_600530eb1d9f853dd746e5819c4" UNIQUE ("code"), CONSTRAINT "UQ_e41bb9537ef5e65ee2de2cfa81a" UNIQUE ("name"), CONSTRAINT "PK_359223e0755d19711813cd07394" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "leave_types"`);
    }

}
