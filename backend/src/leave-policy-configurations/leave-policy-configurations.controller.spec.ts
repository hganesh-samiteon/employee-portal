import { Test, TestingModule } from '@nestjs/testing';
import { LeavePolicyConfigurationsController } from './leave-policy-configurations.controller.js';
import { beforeEach, describe, expect, it } from 'vitest';

describe('LeavePolicyConfigurationsController', () => {
  let controller: LeavePolicyConfigurationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeavePolicyConfigurationsController],
    }).compile();

    controller = module.get<LeavePolicyConfigurationsController>(
      LeavePolicyConfigurationsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
