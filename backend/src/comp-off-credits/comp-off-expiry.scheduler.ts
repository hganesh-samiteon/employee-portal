import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { CompOffCreditsService } from './comp-off-credits.service.js';

@Injectable()
export class CompOffExpiryScheduler {
  private readonly logger = new Logger(CompOffExpiryScheduler.name);

  constructor(private readonly compOffCreditsService: CompOffCreditsService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
    timeZone: 'Asia/Kolkata',
  })
  async handleCompOffExpiry() {
    this.logger.log('Starting daily Comp-Off expiry processing');

    try {
      const result = await this.compOffCreditsService.processExpiredCredits();

      this.logger.log(
        `Comp-Off expiry completed. Expired credits: ${result.expiredCredits}`,
      );
    } catch (error) {
      this.logger.error(
        'Comp-Off expiry processing failed',
        error instanceof Error ? error.stack : String(error),
      );
    }
  }
}
