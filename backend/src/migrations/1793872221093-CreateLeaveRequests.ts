import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateLeaveRequests1793872221093 implements MigrationInterface {
    name = 'CreateLeaveRequests1793872221093'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."leave_requests_half_day_session_enum" AS ENUM('FIRST_HALF', 'SECOND_HALF')`);
        await queryRunner.query(`CREATE TYPE "public"."leave_requests_status_enum" AS ENUM('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED')`);
        await queryRunner.query(`CREATE TABLE "leave_requests" ("id" SERIAL NOT NULL, "start_date" date NOT NULL, "end_date" date NOT NULL, "total_days" numeric(8,2) NOT NULL, "is_half_day" boolean NOT NULL DEFAULT false, "half_day_session" "public"."leave_requests_half_day_session_enum", "reason" character varying(500) NOT NULL, "status" "public"."leave_requests_status_enum" NOT NULL DEFAULT 'PENDING', "reviewed_at" TIMESTAMP, "rejection_reason" character varying(500), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "employee_id" integer NOT NULL, "leave_type_id" integer NOT NULL, "reviewed_by" integer, CONSTRAINT "PK_d3abcf9a16cef1450129e06fa9f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_64b609c7cb68931be7cbcc12b5" ON "leave_requests"  ("employee_id", "start_date", "end_date") `);
        await queryRunner.query(`ALTER TABLE "leave_requests" ADD CONSTRAINT "FK_52b4b7c7d295e204add6dbe0a09" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "leave_requests" ADD CONSTRAINT "FK_54a57db316598806786c2b95323" FOREIGN KEY ("leave_type_id") REFERENCES "leave_types"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "leave_requests" ADD CONSTRAINT "FK_2f7a4220ff516ce48bdd91ce23d" FOREIGN KEY ("reviewed_by") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "leave_requests" DROP CONSTRAINT "FK_2f7a4220ff516ce48bdd91ce23d"`);
        await queryRunner.query(`ALTER TABLE "leave_requests" DROP CONSTRAINT "FK_54a57db316598806786c2b95323"`);
        await queryRunner.query(`ALTER TABLE "leave_requests" DROP CONSTRAINT "FK_52b4b7c7d295e204add6dbe0a09"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_64b609c7cb68931be7cbcc12b5"`);
        await queryRunner.query(`DROP TABLE "leave_requests"`);
        await queryRunner.query(`DROP TYPE "public"."leave_requests_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."leave_requests_half_day_session_enum"`);
    }

}
