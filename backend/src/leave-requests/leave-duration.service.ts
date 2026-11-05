import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class LeaveDurationService {
  calculateTotalDays(
    startDate: string,
    endDate: string,
    isHalfDay: boolean,
    holidayDates: Set<string>,
  ): number {
    this.validateDateRange(startDate, endDate);

    if (isHalfDay) {
      if (startDate !== endDate) {
        throw new BadRequestException(
          'Half-day leave must have the same start and end date.',
        );
      }

      if (this.isWeekend(startDate) || holidayDates.has(startDate)) {
        throw new BadRequestException(
          'Half-day leave must be applied on a working day.',
        );
      }

      return 0.5;
    }

    let totalDays = 0;

    const currentDate = this.parseDate(startDate);
    const lastDate = this.parseDate(endDate);

    while (currentDate <= lastDate) {
      const dateString = currentDate.toISOString().slice(0, 10);

      const isWorkingDay =
        !this.isWeekend(dateString) && !holidayDates.has(dateString);

      if (isWorkingDay) {
        totalDays++;
      }

      currentDate.setUTCDate(currentDate.getUTCDate() + 1);
    }

    if (totalDays === 0) {
      throw new BadRequestException(
        'The selected date range contains no working days.',
      );
    }

    return totalDays;
  }

  private validateDateRange(startDate: string, endDate: string): void {
    const start = this.parseDate(startDate);
    const end = this.parseDate(endDate);

    if (start > end) {
      throw new BadRequestException('End date cannot be before start date.');
    }

    const today = this.getTodayInIndia();

    if (startDate < today) {
      throw new BadRequestException('Leave cannot be applied for past dates.');
    }
  }

  private isWeekend(date: string): boolean {
    const day = this.parseDate(date).getUTCDay();

    return day === 0 || day === 6;
  }

  private parseDate(date: string): Date {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new BadRequestException(
        'Invalid date format. Expected YYYY-MM-DD.',
      );
    }

    const parsedDate = new Date(`${date}T00:00:00.000Z`);

    if (
      Number.isNaN(parsedDate.getTime()) ||
      parsedDate.toISOString().slice(0, 10) !== date
    ) {
      throw new BadRequestException('Invalid calendar date.');
    }

    return parsedDate;
  }

  private getTodayInIndia(): string {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(new Date());

    const values = Object.fromEntries(
      parts.map((part) => [part.type, part.value]),
    );

    return `${values.year}-${values.month}-${values.day}`;
  }
}
