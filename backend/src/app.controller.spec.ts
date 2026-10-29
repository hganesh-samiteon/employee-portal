import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller.js';
import { beforeEach, describe, expect, it } from 'vitest';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    appController = module.get<AppController>(AppController);
  });

  describe('checkHealth', () => {
    it('returns the API health status', () => {
      const result = appController.checkHealth();

      expect(result.status).toBe('ok');
      expect(result.message).toBe('Employee Portal API is running');
      expect(result.timestamp).toBeDefined();
    });
  });
});
