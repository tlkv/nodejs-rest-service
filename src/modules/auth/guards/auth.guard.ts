import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { UserTokenData } from 'src/modules/users/entities/user.entity';
import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';

dotenv.config();

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (request.headers.authorization) {
      if (!(request.headers.authorization as string).startsWith('Bearer ')) {
        return false;
      }
      const currentToken = (request.headers.authorization as string).slice(7);
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const decoded = (await jwt.verify(
          currentToken,
          process.env.JWT_SECRET_KEY,
        )) as UserTokenData;
      } catch (err) {
        throw new UnauthorizedException('Token is invalid or expired');
      }

      return true;
    }
    throw new UnauthorizedException();
  }
}
