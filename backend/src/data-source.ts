import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Holiday } from './holidays/holiday.entity.js';
import { Department } from './departments/department.entity.js';
import { Designation } from './designations/designations.entity.js';
import { LeaveType } from './leave-types/leave-type.entity.js';
import { Employee } from './employees/employee.entity.js';
import { CompOffEligibility } from './comp-off-eligibility/comp-off-eligibility.entity.js';
import { LeavePolicyConfiguration } from './leave-policy-configurations/leave-policy-configuration.entity.js';

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,

  entities: [
    Department,
    Designation,
    Employee,
    Holiday,
    LeaveType,
    LeavePolicyConfiguration,
    CompOffEligibility,
  ],

  migrations: ['src/migrations/*.ts'],

  synchronize: false,
});
