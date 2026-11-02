import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateLeavePolicyConfigurations1793613233899 implements MigrationInterface {
    name = 'CreateLeavePolicyConfigurations1793613233899'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."leave_policy_configurations_entitlement_unit_enum" AS ENUM('DAYS', 'WEEKS', 'MONTHS')`);
        await queryRunner.query(`CREATE TYPE "public"."leave_policy_configurations_allocation_mode_enum" AS ENUM('ANNUAL', 'PRO_RATA', 'WORKING_DAYS', 'FIXED')`);
        await queryRunner.query(`CREATE TYPE "public"."leave_policy_configurations_pro_rata_method_enum" AS ENUM('COMPLETED_MONTHS_AFTER_JOINING')`);
        await queryRunner.query(`CREATE TYPE "public"."leave_policy_configurations_accrual_unit_enum" AS ENUM('DAYS')`);
        await queryRunner.query(`CREATE TYPE "public"."leave_policy_configurations_accrual_basis_unit_enum" AS ENUM('WORKING_DAYS')`);
        await queryRunner.query(`CREATE TABLE "leave_policy_configurations" ("id" SERIAL NOT NULL, "policyYear" integer NOT NULL, "version" integer NOT NULL DEFAULT '1', "effectiveFrom" date NOT NULL, "effectiveTo" date, "entitlement_value" numeric(8,2), "entitlement_unit" "public"."leave_policy_configurations_entitlement_unit_enum", "allocation_mode" "public"."leave_policy_configurations_allocation_mode_enum" NOT NULL, "pro_rata_method" "public"."leave_policy_configurations_pro_rata_method_enum", "accrual_value" numeric(8,2), "accrual_unit" "public"."leave_policy_configurations_accrual_unit_enum", "accrual_basis_value" numeric(8,2), "accrual_basis_unit" "public"."leave_policy_configurations_accrual_basis_unit_enum", "allow_half_day" boolean NOT NULL DEFAULT false, "carry_forward_allowed" boolean NOT NULL DEFAULT false, "max_carry_forward" numeric(8,2), "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "leave_type_id" integer NOT NULL, "department_id" integer, "designation_id" integer, CONSTRAINT "PK_e0948ba3b3896077796347c9af1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "leave_policy_configurations" ADD CONSTRAINT "FK_fa5f8e1b9fedf270860f0a641ac" FOREIGN KEY ("leave_type_id") REFERENCES "leave_types"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "leave_policy_configurations" ADD CONSTRAINT "FK_b4a720d44ce3cb0e67bb0449cba" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "leave_policy_configurations" ADD CONSTRAINT "FK_ea3ac04cab02aa7fec6b9956989" FOREIGN KEY ("designation_id") REFERENCES "designations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "leave_policy_configurations" DROP CONSTRAINT "FK_ea3ac04cab02aa7fec6b9956989"`);
        await queryRunner.query(`ALTER TABLE "leave_policy_configurations" DROP CONSTRAINT "FK_b4a720d44ce3cb0e67bb0449cba"`);
        await queryRunner.query(`ALTER TABLE "leave_policy_configurations" DROP CONSTRAINT "FK_fa5f8e1b9fedf270860f0a641ac"`);
        await queryRunner.query(`DROP TABLE "leave_policy_configurations"`);
        await queryRunner.query(`DROP TYPE "public"."leave_policy_configurations_accrual_basis_unit_enum"`);
        await queryRunner.query(`DROP TYPE "public"."leave_policy_configurations_accrual_unit_enum"`);
        await queryRunner.query(`DROP TYPE "public"."leave_policy_configurations_pro_rata_method_enum"`);
        await queryRunner.query(`DROP TYPE "public"."leave_policy_configurations_allocation_mode_enum"`);
        await queryRunner.query(`DROP TYPE "public"."leave_policy_configurations_entitlement_unit_enum"`);
    }

}
