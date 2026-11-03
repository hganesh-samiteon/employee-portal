import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCompOffEligibility1793685837348 implements MigrationInterface {
    name = 'CreateCompOffEligibility1793685837348'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "comp_off_eligibility" ("id" SERIAL NOT NULL, "is_eligible" boolean NOT NULL DEFAULT true, "effective_from" date NOT NULL, "effective_to" date, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "department_id" integer, "designation_id" integer, CONSTRAINT "PK_215646a2854b027d8b6fa1bf601" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ac4dca6ec8359057d4614ef76c" ON "comp_off_eligibility"  ("effective_from", "effective_to") `);
        await queryRunner.query(`ALTER TABLE "comp_off_eligibility" ADD CONSTRAINT "FK_4649745ca44de73d973af1e130f" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comp_off_eligibility" ADD CONSTRAINT "FK_bd3007852a7a22007a74f1e1dfb" FOREIGN KEY ("designation_id") REFERENCES "designations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comp_off_eligibility" DROP CONSTRAINT "FK_bd3007852a7a22007a74f1e1dfb"`);
        await queryRunner.query(`ALTER TABLE "comp_off_eligibility" DROP CONSTRAINT "FK_4649745ca44de73d973af1e130f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ac4dca6ec8359057d4614ef76c"`);
        await queryRunner.query(`DROP TABLE "comp_off_eligibility"`);
    }

}
