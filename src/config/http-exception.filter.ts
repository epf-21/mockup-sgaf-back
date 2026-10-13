import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { DomainError } from '../shared/domain/errors/domain-error';

@Catch(DomainError)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: DomainError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception.code === 'NOT_FOUND'
        ? HttpStatus.NOT_FOUND
        : HttpStatus.BAD_REQUEST;

    response.status(status).json({
      statusCode: status,
      message: exception.message,
      error: exception.name,
      code: exception.code,
      path: request.url,
    });
  }
}
