import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Department } from '../departments/department.entity.js';
import { Designation } from '../designations/designations.entity.js';

@Entity('comp_off_eligibility')
@Index(['effectiveFrom', 'effectiveTo'])
export class CompOffEligibility {
  @PrimaryGeneratedColumn()
  id: number;

  // Null means the rule applies to all departments.
  @ManyToOne(() => Department, {
    nullable: true,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'department_id' })
  department: Department | null;

  // Null means the rule applies to all designations.
  @ManyToOne(() => Designation, {
    nullable: true,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'designation_id' })
  designation: Designation | null;

  @Column({
    name: 'is_eligible',
    type: 'boolean',
    default: true,
  })
  isEligible: boolean;

  @Column({
    name: 'effective_from',
    type: 'date',
  })
  effectiveFrom: string;

  @Column({
    name: 'effective_to',
    type: 'date',
    nullable: true,
  })
  effectiveTo: string | null;

  @Column({
    name: 'is_active',
    type: 'boolean',
    default: true,
  })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
