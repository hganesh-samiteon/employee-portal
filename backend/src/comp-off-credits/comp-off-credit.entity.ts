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

import { Employee } from '../employees/employee.entity.js';

export enum CompOffCreditSource {
  WEEKLY_OFF = 'WEEKLY_OFF',
  HOLIDAY = 'HOLIDAY',
}

export enum CompOffCreditStatus {
  ACTIVE = 'ACTIVE',
  EXHAUSTED = 'EXHAUSTED',
  EXPIRED = 'EXPIRED',
}

@Entity('comp_off_credits')
@Index(['employee', 'expiresAt'])
@Index(['employee', 'sourceDate'])
export class CompOffCredit {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Employee, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column({
    name: 'source_date',
    type: 'date',
  })
  sourceDate: string;

  @Column({
    name: 'source_type',
    type: 'enum',
    enum: CompOffCreditSource,
  })
  sourceType: CompOffCreditSource;

  @Column({
    name: 'approved_hours',
    type: 'decimal',
    precision: 8,
    scale: 2,
  })
  approvedHours: string;

  @Column({
    name: 'credited_days',
    type: 'decimal',
    precision: 8,
    scale: 4,
  })
  creditedDays: string;

  @Column({
    name: 'credited_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  creditedAt: Date;

  @Column({
    name: 'expires_at',
    type: 'date',
  })
  expiresAt: string;

  @Column({
    type: 'enum',
    enum: CompOffCreditStatus,
    default: CompOffCreditStatus.ACTIVE,
  })
  status: CompOffCreditStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
