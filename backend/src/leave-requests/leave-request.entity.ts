import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

import { Employee } from '../employees/employee.entity.js';
import { LeaveType } from '../leave-types/leave-type.entity.js';

import { LeaveRequestStatus } from './enums/leave-request-status.enum.js';
import { HalfDaySession } from './enums/half-day-session.enum.js';

@Entity('leave_requests')
@Index(['employee', 'startDate', 'endDate'])
export class LeaveRequest {
  @PrimaryGeneratedColumn()
  id: number;

  // Employee who applied for leave
  @ManyToOne(() => Employee, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  // Type of leave applied for
  @ManyToOne(() => LeaveType, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'leave_type_id' })
  leaveType: LeaveType;

  @Column({ type: 'date', name: 'start_date' })
  startDate: string;

  @Column({ type: 'date', name: 'end_date' })
  endDate: string;

  // Calculated by backend, never supplied by frontend
  @Column({
    type: 'decimal',
    precision: 8,
    scale: 2,
    name: 'total_days',
  })
  totalDays: string;

  @Column({ type: 'boolean', default: false, name: 'is_half_day' })
  isHalfDay: boolean;

  @Column({
    type: 'enum',
    enum: HalfDaySession,
    nullable: true,
    name: 'half_day_session',
  })
  halfDaySession: HalfDaySession | null;

  @Column({ type: 'varchar', length: 500 })
  reason: string;

  @Column({
    type: 'enum',
    enum: LeaveRequestStatus,
    default: LeaveRequestStatus.PENDING,
  })
  status: LeaveRequestStatus;

  // Employee who reviewed the request (manager/HR)
  @ManyToOne(() => Employee, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'reviewed_by' })
  reviewedBy: Employee | null;

  @Column({
    type: 'timestamp',
    nullable: true,
    name: 'reviewed_at',
  })
  reviewedAt: Date | null;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
    name: 'rejection_reason',
  })
  rejectionReason: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
