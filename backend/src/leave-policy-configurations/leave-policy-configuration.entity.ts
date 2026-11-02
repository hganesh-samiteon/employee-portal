import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { LeaveType } from '../leave-types/leave-type.entity.js';
import { Department } from '../departments/department.entity.js';
import { Designation } from '../designations/designations.entity.js';

import { EntitlementUnit } from './enums/entitlement-unit.enum.js';
import { AllocationMode } from './enums/allocation-mode.enum.js';
import { AccrualUnit } from './enums/accrual-unit.enum.js';
import { AccrualBasisUnit } from './enums/accrual-basis-unit.enum.js';
import { ProRataMethod } from './enums/pro-rata-method.enum.js';

@Entity('leave_policy_configurations')
export class LeavePolicyConfiguration {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => LeaveType, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'leave_type_id' })
  leaveType: LeaveType;

  @ManyToOne(() => Department, {
    nullable: true,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'department_id' })
  department: Department | null;

  @ManyToOne(() => Designation, {
    nullable: true,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'designation_id' })
  designation: Designation | null;

  @Column({ type: 'int' })
  policyYear: number;

  @Column({ type: 'int', default: 1 })
  version: number;

  @Column({ type: 'date' })
  effectiveFrom: string;

  @Column({ type: 'date', nullable: true })
  effectiveTo: string | null;

  @Column({
    type: 'decimal',
    precision: 8,
    scale: 2,
    nullable: true,
    name: 'entitlement_value',
  })
  entitlementValue: string | null;

  @Column({
    type: 'enum',
    enum: EntitlementUnit,
    nullable: true,
    name: 'entitlement_unit',
  })
  entitlementUnit: EntitlementUnit | null;

  @Column({
    type: 'enum',
    enum: AllocationMode,
    name: 'allocation_mode',
  })
  allocationMode: AllocationMode;

  @Column({
    type: 'enum',
    enum: ProRataMethod,
    nullable: true,
    name: 'pro_rata_method',
  })
  proRataMethod: ProRataMethod | null;

  @Column({
    type: 'decimal',
    precision: 8,
    scale: 2,
    nullable: true,
    name: 'accrual_value',
  })
  accrualValue: string | null;

  @Column({
    type: 'enum',
    enum: AccrualUnit,
    nullable: true,
    name: 'accrual_unit',
  })
  accrualUnit: AccrualUnit | null;

  @Column({
    type: 'decimal',
    precision: 8,
    scale: 2,
    nullable: true,
    name: 'accrual_basis_value',
  })
  accrualBasisValue: string | null;

  @Column({
    type: 'enum',
    enum: AccrualBasisUnit,
    nullable: true,
    name: 'accrual_basis_unit',
  })
  accrualBasisUnit: AccrualBasisUnit | null;

  @Column({
    type: 'boolean',
    default: false,
    name: 'allow_half_day',
  })
  allowHalfDay: boolean;

  @Column({
    type: 'boolean',
    default: false,
    name: 'carry_forward_allowed',
  })
  carryForwardAllowed: boolean;

  @Column({
    type: 'decimal',
    precision: 8,
    scale: 2,
    nullable: true,
    name: 'max_carry_forward',
  })
  maxCarryForward: string | null;

  @Column({
    type: 'boolean',
    default: true,
    name: 'is_active',
  })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
