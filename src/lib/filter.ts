import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ConflictException,
  ForbiddenException,
  HttpServer,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class AllExceptionWithMessageFilter extends BaseExceptionFilter {
  constructor(applicationRef?: HttpServer) {
    Logger.warn(
      'API 응답 시, 에러 메시지(message)와 에러 이름(name)이 포함됩니다. 보안에 주의하고, 정책에 따라 메시지와 에러 이름을 누락시켜야하는 경우 AllExceptionFilter를 사용해주세요',
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
