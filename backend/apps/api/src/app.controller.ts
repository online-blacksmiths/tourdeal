import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation } from '@nestjs/swagger';

import { CoreResponse } from '@tourdeal-backend/shared';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

import { AppService } from './app.service';

import { ExampleDto, ExampleResponse } from './app.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/print-log')
  async printLog(): Promise<string> {
    return await this.appService.printLog();
  }

  @Get('/exception')
  getException() {
    return this.appService.getExcpetion();
  }

  @Get('/core-response')
  @ApiOperation({ summary: 'CoreResponse 테스트' })
  @ApiOkResponse({
    type: ExampleResponse,
    description: 'CoreResponse 테스트 성공',
  })
  async getCoreResponse(): Promise<CoreResponse<ExampleDto>> {
    try {
      const data = await this.appService.getCoreResponse();
      return CoreResponse.success(data);
    } catch (error) {
      return CoreResponse.error('CoreResponse 테스트 실패', error);
    }
  }

  @Get('/core-response-validated')
  @ApiOperation({ summary: 'CoreResponse 수동 검증 테스트' })
  @ApiOkResponse({
    type: ExampleResponse,
    description: 'CoreResponse 검증 테스트 성공',
  })
  async getCoreResponseValidated(): Promise<CoreResponse<ExampleDto>> {
    try {
      const rawData = await this.appService.getCoreResponse();

      // 1. raw object를 DTO 클래스 인스턴스로 변환
      const dtoInstance = plainToClass(ExampleDto, rawData);

      // 2. 수동으로 검증 실행
      const errors = await validate(dtoInstance);

      // 3. 검증 에러가 있으면 예외 발생
      if (errors.length > 0) {
        const errorMessages = errors
          .map((error) => Object.values(error.constraints || {}).join(', '))
          .join('; ');

        return CoreResponse.error(
          `응답 데이터 검증 실패: ${errorMessages}`,
          rawData,
        );
      }

      return CoreResponse.success(dtoInstance);
    } catch (error) {
      return CoreResponse.error('검증 처리 실패', error);
    }
  }

  @Post('/validate-input')
  @ApiOperation({
    summary: '입력 데이터 검증 테스트 (ValidationPipe 자동 동작)',
  })
  @ApiBody({ type: ExampleDto })
  @ApiOkResponse({ type: ExampleResponse })
  async validateInput(
    @Body() data: ExampleDto,
  ): Promise<CoreResponse<ExampleDto>> {
    // ValidationPipe가 자동으로 검증
    // age가 120을 초과하면 자동으로 400 Bad Request 발생
    return CoreResponse.success(data);
  }
}
