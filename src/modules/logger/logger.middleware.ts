import { Request } from 'express';
import { Response, NextFunction } from 'express';
import { HttpStatus, Injectable, Logger, NestMiddleware } from '@nestjs/common';
@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(request: Request, response: Response, next: NextFunction): void {
    response.on('finish', () => {
      if (response.statusCode < HttpStatus.BAD_REQUEST) {
        const message = `
        \nRequest URL: ${request.originalUrl}, Request method: ${
          request.method
        },
        \nBody - ${JSON.stringify(request.body)}
        \nParameters: ${JSON.stringify(request.params)}
        \nQuery parameters: ${JSON.stringify(request.query)}
        \nResponse code: ${response.statusCode}
        `;
        Logger.log(message, 'RequestLogger');
      }
    });
    next();
  }
}
