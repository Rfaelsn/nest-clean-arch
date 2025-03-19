import { InvalidPasswordError } from '@/shared/application/errors/invalid-password-error';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';

@Catch(InvalidPasswordError)
export class InvalidPasswordErrorFilter implements ExceptionFilter {
  catch(exception: InvalidPasswordError, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();

    response.status(422).send({
      statusCode: 422,
      error: 'Unprocessable Entity',
      message: exception.message,
    });
  }
}
