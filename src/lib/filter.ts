import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ConflictException,
  ForbiddenException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class AllExceptionWithMessageFilter extends BaseExceptionFilter {
  constructor() {
    Logger.warn(
      '개발 환경용 filter입니다. 실 서비스 환경에서는 AllExceptionFilter를 사용해주세요',
      'DevOnlyAllExceptionFilter',
    );
    super();
  }
  catch(exception, host: ArgumentsHost) {
    switch (exception.constructor.name) {
      case 'NotFoundError':
      case 'EntityNotFoundError':
        super.catch(
          new NotFoundException({
            statusCode: 404,
            message: exception.message,
            error: 'Not found',
            name: exception.constructor.name,
          }),
          host,
        );
        break;
      case 'SubtaskAlreadySubmittedError':
      case 'AlreadySubmittedSubtaskError':
      case 'EntityAlreadyExistError':
      case 'MaximumNumberOfGrabbedTasksExceededError':
      case 'JsonWebTokenError':
      case 'LanguageRuleError':
        super.catch(
          new BadRequestException({
            statusCode: 400,
            message: exception.message,
            error: 'Bad request',
            name: exception.constructor.name,
          }),
          host,
        );
        break;
      case 'PermissionDeniedError':
        super.catch(
          new ForbiddenException({
            statusCode: 403,
            message: exception.message,
            error: 'Forbidden',
            name: exception.constructor.name,
          }),
          host,
        );
        break;
      case 'QueryFailedError':
        if (
          exception?.message.includes(
            'duplicate key value violates unique constraint',
          )
        )
          super.catch(
            new ConflictException({
              statusCode: 409,
              message: exception.message,
              error: 'Conflict',
              name: exception.constructor.name,
            }),
            host,
          );
        else
          super.catch(
            new InternalServerErrorException({
              statusCode: 500,
              message: exception.message,
              error: 'Internal Server Error',
              name: exception.constructor.name,
            }),
            host,
          );
        break;
      default:
        if (exception.constructor.name.includes('Exception'))
          super.catch(exception, host);
        else
          super.catch(
            new InternalServerErrorException({
              statusCode: 500,
              message: exception.message,
              error: 'Internal Server Error',
              name: exception.constructor.name,
            }),
            host,
          );
    }
  }
}

@Catch()
export class AllExceptionFilter extends BaseExceptionFilter {
  catch(exception, host: ArgumentsHost) {
    switch (exception.constructor.name) {
      case 'NotFoundError':
      case 'EntityNotFoundError':
        super.catch(
          new NotFoundException({
            statusCode: 404,
            error: 'Not found',
          }),
          host,
        );
        break;
      case 'PermissionDeniedError':
        super.catch(
          new ForbiddenException({
            statusCode: 403,
            error: 'Forbidden',
          }),
          host,
        );
      case 'SubtaskAlreadySubmittedError':
      case 'AlreadySubmittedSubtaskError':
      case 'EntityAlreadyExistError':
      case 'MaximumNumberOfGrabbedTasksExceededError':
      case 'JsonWebTokenError':
      case 'LanguageRuleError':
        super.catch(
          new BadRequestException({
            statusCode: 400,
            error: 'Bad request',
          }),
          host,
        );
        break;
      case 'QueryFailedError':
        if (
          exception?.message.includes(
            'duplicate key value violates unique constraint',
          )
        )
          super.catch(
            new ConflictException({
              statusCode: 409,
              error: 'Conflict',
            }),
            host,
          );
        else
          super.catch(
            new InternalServerErrorException({
              statusCode: 500,
              error: 'Internal Server Error',
            }),
            host,
          );
        break;
      default:
        if (exception.constructor.name.includes('Exception'))
          super.catch(exception, host);
        else
          super.catch(
            new InternalServerErrorException({
              statusCode: 500,
              error: 'Internal Server Error',
            }),
            host,
          );
    }
  }
}
