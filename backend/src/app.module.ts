import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';

import { AppController } from './app.controller.js';
import { DepartmentsModule } from './departments/departments.module.js';
import { DesignationsModule } from './designations/designations.module.js';
import { EmployeesModule } from './employees/employees.module.js';
import { HolidaysModule } from './holidays/holidays.module.js';
import { LeaveTypesModule } from './leave-types/leave-types.module.js';
import { LeavePolicyConfigurationsModule } from './leave-policy-configurations/leave-policy-configurations.module.js';
import { CompOffEligibilityModule } from './comp-off-eligibility/comp-off-eligibility.module.js';
import { CompOffCreditsModule } from './comp-off-credits/comp-off-credits.module.js';
import { LeaveRequestsModule } from './leave-requests/leave-requests.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),

        autoLoadEntities: true,
        synchronize: false,
      }),
    }),
    ScheduleModule.forRoot(),

    DepartmentsModule,
    DesignationsModule,
    EmployeesModule,
    HolidaysModule,
    LeaveTypesModule,
    LeavePolicyConfigurationsModule,
    CompOffEligibilityModule,
    CompOffCreditsModule,
    LeaveRequestsModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
