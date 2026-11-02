import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LeavePolicyConfigurationsService } from './leave-policy-configurations.service.js';
import { beforeEach, describe, expect, it } from 'vitest';
import { LeavePolicyConfiguration } from './leave-policy-configuration.entity.js';
import { LeaveType } from '../leave-types/leave-type.entity.js';
import { Department } from '../departments/department.entity.js';
import { Designation } from '../designations/designations.entity.js';

describe('LeavePolicyConfigurationsService', () => {
  let service: LeavePolicyConfigurationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LeavePolicyConfigurationsService,
        {
          provide: getRepositoryToken(LeavePolicyConfiguration),
          useValue: {},
        },
        {
          provide: getRepositoryToken(LeaveType),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Department),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Designation),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<LeavePolicyConfigurationsService>(
      LeavePolicyConfigurationsService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
