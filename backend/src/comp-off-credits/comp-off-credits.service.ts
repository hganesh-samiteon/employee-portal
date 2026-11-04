import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ConflictException,
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
import { UseCompOffCreditDto } from './dto/use-comp-off-credit.dto.js';
import { CreateCompOffCreditDto } from './dto/create-comp-off-credit.dto.js';

@Injectable()
export class CompOffCreditsService {
  constructor(private readonly dataSource: DataSource) {}

  async createCredit(dto: CreateCompOffCreditDto) {
    // 1. Validate approved working hours
    if (
      !Number.isFinite(dto.approvedHours) ||
      dto.approvedHours <= 0 ||
      dto.approvedHours > 24
    ) {
      throw new BadRequestException(
        'Approved hours must be greater than 0 and cannot exceed 24',
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
      const employee = await employeeRepository
        .createQueryBuilder('employee')
        .setLock('pessimistic_write')
        .where('employee.id = :employeeId', { employeeId: dto.employeeId })
        .andWhere('employee.is_active = true')
        .getOne();

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
        .innerJoin('transaction.credit', 'credit')
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
        .andWhere('credit.expires_at >= CURRENT_DATE')
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
        availableBalance: this.unitsToDecimal(
          this.decimalToUnits(result?.balance ?? '0'),
        ),
      };
    });
  }

  async getEmployeeTransactions(employeeId: number) {
    const employeeRepository = this.dataSource.getRepository(Employee);
    const transactionRepository =
      this.dataSource.getRepository(CompOffTransaction);

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

    const transactions = await transactionRepository.find({
      where: {
        employee: { id: employeeId },
      },
      relations: {
        credit: true,
      },
      order: {
        transactionDate: 'DESC',
        id: 'DESC',
      },
    });

    return {
      employeeId: employee.id,
      employeeCode: employee.employeeCode,
      totalTransactions: transactions.length,
      transactions,
    };
  }
  async useCompOffCredit(employeeId: number, dto: UseCompOffCreditDto) {
    if (
      !Number.isFinite(dto.days) ||
      dto.days <= 0 ||
      !Number.isInteger(dto.days * 10000)
    ) {
      throw new BadRequestException(
        'Requested Comp-Off days must be positive and have at most 4 decimal places',
      );
    }
    const requestedUnits = Math.round(dto.days * 10000);

    return this.dataSource.transaction(async (manager) => {
      const employeeRepository = manager.getRepository(Employee);
      const creditRepository = manager.getRepository(CompOffCredit);
      const transactionRepository = manager.getRepository(CompOffTransaction);

      // 1. Validate employee
      const employee = await employeeRepository
        .createQueryBuilder('employee')
        .setLock('pessimistic_write')
        .where('employee.id = :employeeId', { employeeId })
        .andWhere('employee.is_active = true')
        .getOne();

      if (!employee) {
        throw new NotFoundException(
          `Active employee with ID ${employeeId} not found`,
        );
      }

      // 2. Lock active, unexpired credit records in FEFO order
      const credits = await creditRepository
        .createQueryBuilder('credit')
        .setLock('pessimistic_write')
        .where('credit.employee_id = :employeeId', { employeeId })
        .andWhere('credit.expires_at >= CURRENT_DATE')
        .andWhere('credit.status = :status', {
          status: CompOffCreditStatus.ACTIVE,
        })
        .orderBy('credit.expires_at', 'ASC')
        .addOrderBy('credit.id', 'ASC')
        .getMany();

      // 3. Calculate remaining balance for each credit
      let remainingUnits = requestedUnits;

      const usageEntries: CompOffTransaction[] = [];

      for (const credit of credits) {
        const ledgerResult = await transactionRepository
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
          .where('transaction.credit_id = :creditId', {
            creditId: credit.id,
          })
          .setParameters({
            credit: CompOffTransactionType.CREDIT,
            deductions: [
              CompOffTransactionType.USAGE,
              CompOffTransactionType.EXPIRY,
            ],
          })
          .getRawOne<{ balance: string }>();

        const availableUnits = this.decimalToUnits(
          ledgerResult?.balance ?? '0',
        );

        if (availableUnits <= 0) {
          continue;
        }

        const unitsToUse = Math.min(availableUnits, remainingUnits);

        const usageEntry = transactionRepository.create({
          employee,
          credit,
          transactionType: CompOffTransactionType.USAGE,
          days: this.unitsToDecimal(unitsToUse),
          referenceId: null,
          remarks: dto.remarks ?? 'Comp-Off utilized',
        });

        usageEntries.push(usageEntry);

        remainingUnits -= unitsToUse;

        if (availableUnits === unitsToUse) {
          credit.status = CompOffCreditStatus.EXHAUSTED;
          await creditRepository.save(credit);
        }

        if (remainingUnits <= 0) {
          break;
        }
      }

      // 4. Reject if sufficient balance is unavailable
      if (remainingUnits > 0) {
        throw new ConflictException('Insufficient Comp-Off balance');
      }

      // 5. Save all usage entries together
      await transactionRepository.save(usageEntries);

      // 6. Return usage summary
      return {
        message: 'Comp-Off utilized successfully',
        employeeId,
        requestedDays: dto.days.toFixed(4),
        consumedDays: dto.days.toFixed(4),
        transactions: usageEntries.map((entry) => ({
          creditId: entry.credit.id,
          days: entry.days,
          transactionType: entry.transactionType,
        })),
      };
    });
  }

  private decimalToUnits(value: string): number {
    const normalized = value.trim();
    const [whole = '0', fraction = ''] = normalized.split('.');
    return Number(whole) * 10000 + Number(fraction.padEnd(4, '0').slice(0, 4));
  }

  private unitsToDecimal(units: number): string {
    const whole = Math.floor(units / 10000);
    const fraction = String(units % 10000).padStart(4, '0');
    return `${whole}.${fraction}`;
  }

  async processExpiredCredits() {
    return this.dataSource.transaction(async (manager) => {
      const employeeRepository = manager.getRepository(Employee);
      const creditRepository = manager.getRepository(CompOffCredit);
      const transactionRepository = manager.getRepository(CompOffTransaction);

      // 1. Find employees who have expired active credits.
      const employees = await employeeRepository
        .createQueryBuilder('employee')
        .where('employee.is_active = true')
        .andWhere(
          `EXISTS (
          SELECT 1
          FROM comp_off_credits credit
          WHERE credit.employee_id = employee.id
          AND credit.expires_at < CURRENT_DATE
          AND credit.status = :status
        )`,
          { status: CompOffCreditStatus.ACTIVE },
        )
        .orderBy('employee.id', 'ASC')
        .getMany();

      const expiryEntries: CompOffTransaction[] = [];

      for (const employee of employees) {
        // 2. Acquire the shared employee-level lock.
        await employeeRepository
          .createQueryBuilder('employee')
          .setLock('pessimistic_write')
          .where('employee.id = :employeeId', {
            employeeId: employee.id,
          })
          .getOne();

        // 3. Lock expired credits in this employee's account.
        const expiredCredits = await creditRepository
          .createQueryBuilder('credit')
          .setLock('pessimistic_write')
          .where('credit.employee_id = :employeeId', {
            employeeId: employee.id,
          })
          .andWhere('credit.expires_at < CURRENT_DATE')
          .andWhere('credit.status = :status', {
            status: CompOffCreditStatus.ACTIVE,
          })
          .orderBy('credit.expires_at', 'ASC')
          .addOrderBy('credit.id', 'ASC')
          .getMany();

        for (const credit of expiredCredits) {
          // 4. Calculate remaining balance from the ledger.
          const ledgerResult = await transactionRepository
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
            .where('transaction.credit_id = :creditId', {
              creditId: credit.id,
            })
            .setParameters({
              credit: CompOffTransactionType.CREDIT,
              deductions: [
                CompOffTransactionType.USAGE,
                CompOffTransactionType.EXPIRY,
              ],
            })
            .getRawOne<{ balance: string }>();

          const remainingUnits = this.decimalToUnits(
            ledgerResult?.balance ?? '0',
          );

          // 5. Record unused balance as an EXPIRY transaction.
          if (remainingUnits > 0) {
            const expiryEntry = transactionRepository.create({
              employee,
              credit,
              transactionType: CompOffTransactionType.EXPIRY,
              days: this.unitsToDecimal(remainingUnits),
              referenceId: null,
              remarks: 'Comp-Off credit expired',
            });

            expiryEntries.push(expiryEntry);
          }

          // 6. Mark the credit as expired.
          credit.status = CompOffCreditStatus.EXPIRED;
          await creditRepository.save(credit);
        }
      }

      // 7. Save all expiry transactions.
      if (expiryEntries.length > 0) {
        await transactionRepository.save(expiryEntries);
      }

      return {
        message: 'Comp-Off expiry processing completed',
        expiredCredits: expiryEntries.length,
        transactions: expiryEntries.map((entry) => ({
          creditId: entry.credit.id,
          days: entry.days,
          transactionType: entry.transactionType,
        })),
      };
    });
  }
}
