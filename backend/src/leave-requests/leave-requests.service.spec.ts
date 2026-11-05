import { Test, TestingModule } from '@nestjs/testing';
import { LeaveDurationService } from './leave-duration.service.js';
import { beforeEach, describe, expect, it } from 'vitest';

describe('LeaveRequestsService', () => {
  let service: LeaveDurationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LeaveDurationService],
    }).compile();

    service = module.get<LeaveDurationService>(LeaveDurationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
