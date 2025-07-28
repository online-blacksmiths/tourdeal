import { Test, TestingModule } from '@nestjs/testing';

import { AppService } from './app.service';

import { AppController } from './app.controller';

import {
  createMockLoggerProvider,
  getMockLogger,
  MockLogger,
} from '../test/utils/mock-logger';

describe('AppController', () => {
  let appController: AppController;
  let _mockLogger: MockLogger;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService, createMockLoggerProvider()],
    }).compile();

    appController = app.get<AppController>(AppController);
    _mockLogger = getMockLogger(app);
  });

  describe('root', () => {
    it('"Hello World!" 를 반환해야 한다', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
