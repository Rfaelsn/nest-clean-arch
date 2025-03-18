import { ConflictError } from '@/shared/domain/errors/conflict-error';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';

@Catch(ConflictError)
export class ConflictErrorFilter implements ExceptionFilter {
  catch(exception: ConflictError, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();

    response.status(409).send({
      statusCode: 409,
      error: 'Conflict',
      message: exception.message,
    });
  }
}
