import { Request } from 'express';
import { Response, NextFunction } from 'express';
import { HttpStatus, Injectable, Logger, NestMiddleware } from '@nestjs/common';
@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(request: Request, response: Response, next: NextFunction): void {
    response.on('finish', () => {
      if (response.statusCode < HttpStatus.BAD_REQUEST) {
        const message = `
        \nRequest URL: ${request.originalUrl}
        \nMethod: ${request.method}
        \nQuery parameters: ${JSON.stringify(request.query)}
        \nBody - ${JSON.stringify(request.body)}
        \nParameters: ${JSON.stringify(request.params)}
        \nResponse code: ${response.statusCode}
        `;
        Logger.log(message, 'RequestLogger');
      }
    });
    next();
  }
}
