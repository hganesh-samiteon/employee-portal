import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Employee } from '../employees/employee.entity.js';
import { CompOffCredit } from './comp-off-credit.entity.js';

export enum CompOffTransactionType {
  CREDIT = 'CREDIT',
  USAGE = 'USAGE',
  EXPIRY = 'EXPIRY',
}

@Entity('comp_off_transactions')
@Index(['employee', 'transactionDate'])
@Index(['credit', 'transactionType'])
export class CompOffTransaction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Employee, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @ManyToOne(() => CompOffCredit, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'credit_id' })
  credit: CompOffCredit;

  @Column({
    name: 'transaction_type',
    type: 'enum',
    enum: CompOffTransactionType,
  })
  transactionType: CompOffTransactionType;

  @Column({
    type: 'decimal',
    precision: 8,
    scale: 4,
  })
  days: string;

  @Column({
    name: 'reference_id',
    type: 'integer',
    nullable: true,
  })
  referenceId: number | null;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  remarks: string | null;

  @Column({
    name: 'transaction_date',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  transactionDate: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
