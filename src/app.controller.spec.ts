import { Test, TestingModule } from '@nestjs/testing';
import AppController from './app.controller';
import { appModuleConfig } from './app.module';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule =
      await Test.createTestingModule(appModuleConfig).compile();

    appController = await app.resolve(AppController);
  });

  describe('root', () => {
    it('should be defined', () => {
      expect(appController).toBeDefined();
    });
  });
});
