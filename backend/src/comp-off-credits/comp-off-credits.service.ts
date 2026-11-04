import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';

import { Employee } from '../employees/employee.entity.js';
import {
  CompOffCredit,
  CompOffCreditStatus,
} from './comp-off-credit.entity.js';
import {
  CompOffTransaction,
  CompOffTransactionType,
} from './comp-off-transaction.entity.js';
import { CreateCompOffCreditDto } from './dto/create-comp-off-credit.dto.js';

@Injectable()
export class CompOffCreditsService {
  constructor(private readonly dataSource: DataSource) {}

  async createCredit(dto: CreateCompOffCreditDto) {
    // 1. Validate approved working hours
    if (dto.approvedHours > 24) {
      throw new BadRequestException(
        'Approved hours cannot exceed 24 hours per day',
      );
    }

    // 2. Calculate Comp-Off days
    const creditedDays = dto.approvedHours / 8;

    // 3. Calculate expiry date
    const expiresAt = this.calculateExpiryDate(dto.sourceDate);

    // 4. Perform all database operations atomically
    return this.dataSource.transaction(async (manager) => {
      const employeeRepository = manager.getRepository(Employee);
      const creditRepository = manager.getRepository(CompOffCredit);
      const transactionRepository = manager.getRepository(CompOffTransaction);

      // Validate employee
      const employee = await employeeRepository.findOne({
        where: {
          id: dto.employeeId,
          isActive: true,
        },
      });

      if (!employee) {
        throw new NotFoundException(
          `Active employee with ID ${dto.employeeId} not found`,
        );
      }

      // Create credit record
      const credit = creditRepository.create({
        employee,
        sourceDate: dto.sourceDate,
        sourceType: dto.sourceType,
        approvedHours: dto.approvedHours.toFixed(2),
        creditedDays: creditedDays.toFixed(4),
        expiresAt,
        status: CompOffCreditStatus.ACTIVE,
      });

      const savedCredit = await creditRepository.save(credit);

      // Create corresponding CREDIT ledger entry
      const ledgerEntry = transactionRepository.create({
        employee,
        credit: savedCredit,
        transactionType: CompOffTransactionType.CREDIT,
        days: creditedDays.toFixed(4),
        referenceId: null,
        remarks: dto.remarks,
      });

      await transactionRepository.save(ledgerEntry);

      return {
        message: 'Comp-Off credit created successfully',
        credit: savedCredit,
      };
    });
  }

  private calculateExpiryDate(sourceDate: string): string {
    const [year, month, day] = sourceDate.split('-').map(Number);

    // Add two calendar months.
    const targetMonthIndex = month - 1 + 2;
    const targetYear = year + Math.floor(targetMonthIndex / 12);
    const targetMonth = targetMonthIndex % 12;

    // Clamp the day to the last day of the target month.
    const lastDayOfTargetMonth = new Date(
      Date.UTC(targetYear, targetMonth + 1, 0),
    ).getUTCDate();

    const expiryDay = Math.min(day, lastDayOfTargetMonth);

    return [
      targetYear,
      String(targetMonth + 1).padStart(2, '0'),
      String(expiryDay).padStart(2, '0'),
    ].join('-');
  }

  async getEmployeeBalance(employeeId: number) {
    return this.dataSource.transaction(async (manager) => {
      const employeeRepository = manager.getRepository(Employee);
      const transactionRepository = manager.getRepository(CompOffTransaction);

      // 1. Verify employee exists
      const employee = await employeeRepository.findOne({
        where: {
          id: employeeId,
          isActive: true,
        },
      });

      if (!employee) {
        throw new NotFoundException(
          `Active employee with ID ${employeeId} not found`,
        );
      }

      // 2. Calculate balance from ledger entries
      const result = await transactionRepository
        .createQueryBuilder('transaction')
        .select(
          `
        COALESCE(
          SUM(
            CASE
              WHEN transaction.transactionType = :credit
                THEN transaction.days
              WHEN transaction.transactionType IN (:...deductions)
                THEN -transaction.days
              ELSE 0
            END
          ),
          0
        )
        `,
          'balance',
        )
        .where('transaction.employee_id = :employeeId', {
          employeeId,
        })
        .setParameters({
          credit: CompOffTransactionType.CREDIT,
          deductions: [
            CompOffTransactionType.USAGE,
            CompOffTransactionType.EXPIRY,
          ],
        })
        .getRawOne<{ balance: string }>();

      return {
        employeeId: employee.id,
        employeeCode: employee.employeeCode,
        employeeName: `${employee.firstName} ${employee.lastName}`,
        availableBalance: Number(result?.balance ?? 0).toFixed(4),
      };
    });
  }
}
