import { Test, TestingModule } from '@nestjs/testing';
import { LeavePolicyConfigurationsService } from './leave-policy-configurations.service.js';
import { beforeEach, describe, expect, it } from 'vitest';

describe('LeavePolicyConfigurationsService', () => {
  let service: LeavePolicyConfigurationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LeavePolicyConfigurationsService],
    }).compile();

    service = module.get<LeavePolicyConfigurationsService>(
      LeavePolicyConfigurationsService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
