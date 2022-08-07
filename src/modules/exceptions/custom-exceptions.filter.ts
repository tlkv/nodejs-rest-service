import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { UserEntity } from '../users/entities/user.entity';

export interface UserRequestInterface extends Request {
  user?: UserEntity;
}

export interface CustomExeptionResponse {
  statusCode: number;
  message: string;
  path: string;
  method: string;
  timeStamp: Date;
}

@Catch()
export class CustomExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const request = host.switchToHttp().getRequest<Request>();
    let respStatus: HttpStatus;
    let message: string;

    if (exception instanceof HttpException) {
      respStatus = exception.getStatus();
      message = exception.getResponse()['message'] as string;
    } else {
      respStatus = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Enternal server error!';
    }
    const errorResponse = {
      statusCode: respStatus,
      message: message,
      path: request.url,
      method: request.method,
      timeStamp: new Date(),
    };
    const errorLog = this.generateErrorLog(errorResponse, request);
    Logger.error(errorLog, 'ErrorLogger');
    response.status(respStatus).json(errorResponse);
  }

  generateErrorLog = (
    errorResponse: CustomExeptionResponse,
    request: UserRequestInterface,
  ): string => {
    const message = `
    \nResponse Code: ${errorResponse.statusCode}, URL: ${
      request.url
    }, Method: ${request.method}, user: ${JSON.stringify(
      request.user ?? 'Not authorized',
    )}
    \nError response - ${JSON.stringify(errorResponse)}
    \nError message - ${errorResponse.message}
    \nBody - ${JSON.stringify(request.body)}\n`;
    return message;
  };
}
