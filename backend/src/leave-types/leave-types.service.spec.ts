import { Test, TestingModule } from '@nestjs/testing';
import { LeaveTypesService } from './leave-types.service.js';
import { describe, it, expect, beforeEach } from 'vitest';

describe('LeaveTypesService', () => {
  let service: LeaveTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LeaveTypesService],
    }).compile();

    service = module.get<LeaveTypesService>(LeaveTypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
