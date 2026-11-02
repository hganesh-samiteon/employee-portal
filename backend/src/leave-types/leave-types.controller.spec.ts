import { Test, TestingModule } from '@nestjs/testing';
import { LeaveTypesController } from './leave-types.controller.js';
import { describe, it, expect, beforeEach } from 'vitest';

describe('LeaveTypesController', () => {
  let controller: LeaveTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeaveTypesController],
    }).compile();

    controller = module.get<LeaveTypesController>(LeaveTypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
