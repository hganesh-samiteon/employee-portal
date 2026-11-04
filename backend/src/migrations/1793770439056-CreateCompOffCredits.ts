import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCompOffCredits1793770439056 implements MigrationInterface {
    name = 'CreateCompOffCredits1793770439056'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."comp_off_credits_source_type_enum" AS ENUM('WEEKLY_OFF', 'HOLIDAY')`);
        await queryRunner.query(`CREATE TYPE "public"."comp_off_credits_status_enum" AS ENUM('ACTIVE', 'EXHAUSTED', 'EXPIRED')`);
        await queryRunner.query(`CREATE TABLE "comp_off_credits" ("id" SERIAL NOT NULL, "source_date" date NOT NULL, "source_type" "public"."comp_off_credits_source_type_enum" NOT NULL, "approved_hours" numeric(8,2) NOT NULL, "credited_days" numeric(8,4) NOT NULL, "credited_at" TIMESTAMP NOT NULL DEFAULT now(), "expires_at" date NOT NULL, "status" "public"."comp_off_credits_status_enum" NOT NULL DEFAULT 'ACTIVE', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "employee_id" integer NOT NULL, CONSTRAINT "PK_bdd8c05784c046c4dbc97188a1a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_36dcc88537693cc4e81fee426e" ON "comp_off_credits"  ("employee_id", "source_date") `);
        await queryRunner.query(`CREATE INDEX "IDX_011f20d034667d1048838dbdf5" ON "comp_off_credits"  ("employee_id", "expires_at") `);
        await queryRunner.query(`CREATE TYPE "public"."comp_off_transactions_transaction_type_enum" AS ENUM('CREDIT', 'USAGE', 'EXPIRY')`);
        await queryRunner.query(`CREATE TABLE "comp_off_transactions" ("id" SERIAL NOT NULL, "transaction_type" "public"."comp_off_transactions_transaction_type_enum" NOT NULL, "days" numeric(8,4) NOT NULL, "reference_id" integer, "remarks" character varying(255), "transaction_date" TIMESTAMP NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "employee_id" integer NOT NULL, "credit_id" integer NOT NULL, CONSTRAINT "PK_467830f8ea45efab68355559d22" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e77ee3d297b83282cd921b9d87" ON "comp_off_transactions"  ("credit_id", "transaction_type") `);
        await queryRunner.query(`CREATE INDEX "IDX_90dc12941b391772e3f43525fe" ON "comp_off_transactions"  ("employee_id", "transaction_date") `);
        await queryRunner.query(`ALTER TABLE "comp_off_credits" ADD CONSTRAINT "FK_627461911d20502c5c8b891b100" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comp_off_transactions" ADD CONSTRAINT "FK_1d62a4959f2b6f7adfc11beffd7" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comp_off_transactions" ADD CONSTRAINT "FK_3b68d9ad8a09e8bfeaa31bfa3aa" FOREIGN KEY ("credit_id") REFERENCES "comp_off_credits"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comp_off_transactions" DROP CONSTRAINT "FK_3b68d9ad8a09e8bfeaa31bfa3aa"`);
        await queryRunner.query(`ALTER TABLE "comp_off_transactions" DROP CONSTRAINT "FK_1d62a4959f2b6f7adfc11beffd7"`);
        await queryRunner.query(`ALTER TABLE "comp_off_credits" DROP CONSTRAINT "FK_627461911d20502c5c8b891b100"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_90dc12941b391772e3f43525fe"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e77ee3d297b83282cd921b9d87"`);
        await queryRunner.query(`DROP TABLE "comp_off_transactions"`);
        await queryRunner.query(`DROP TYPE "public"."comp_off_transactions_transaction_type_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_011f20d034667d1048838dbdf5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_36dcc88537693cc4e81fee426e"`);
        await queryRunner.query(`DROP TABLE "comp_off_credits"`);
        await queryRunner.query(`DROP TYPE "public"."comp_off_credits_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."comp_off_credits_source_type_enum"`);
    }

}
