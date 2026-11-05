import { Test, TestingModule } from '@nestjs/testing';
import { LeaveRequestsService } from './leave-requests.service.js';
import { beforeEach, describe, expect, it } from 'vitest';

describe('LeaveRequestsService', () => {
  let service: LeaveRequestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LeaveRequestsService],
    }).compile();

    service = module.get<LeaveRequestsService>(LeaveRequestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
