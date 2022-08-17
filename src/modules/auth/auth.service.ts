import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserEntity, UserTokenData } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';
import { TokenDto } from './dto/token.dto';

dotenv.config();

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private userService: UsersService,
  ) {}

  async signup(createAuthDto: CreateUserDto) {
    const newUser = await this.userService.create(createAuthDto);
    return newUser;
  }

  async getToken(user: UserEntity, params?: { refresh: boolean }) {
    const expirationTime = params.refresh ? '10d' : '4h';
    const key = params.refresh
      ? (process.env.JWT_SECRET_REFRESH_KEY as string)
      : (process.env.JWT_SECRET_KEY as string);
    return jwt.sign(
      {
        userId: user.id,
        login: user.login,
      },
      key,
      {
        expiresIn: expirationTime,
      },
    );
  }

  async login(loginDto: CreateAuthDto) {
    const currentUser = await this.userRepository.findOneBy({
      login: loginDto.login,
    });
    if (!currentUser) {
      throw new ForbiddenException('No such user');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const hashPassword = await bcrypt.hash(
      loginDto.password,
      parseInt(process.env.CRYPT_SALT),
    );

    const isCorrectPassword = await bcrypt.compare(
      loginDto.password,
      currentUser.password,
    );

    if (!isCorrectPassword) {
      throw new ForbiddenException('Wrong password');
    }
    currentUser.accessToken = await this.getToken(currentUser, {
      refresh: false,
    });
    currentUser.refreshToken = await this.getToken(currentUser, {
      refresh: true,
    });
    const authUser = await this.userRepository.save(currentUser);

    return {
      accessToken: authUser.accessToken,
      refreshToken: authUser.refreshToken,
    };
  }
  async refresh(tokenDto: TokenDto) {
    if (!tokenDto.refreshToken) {
      throw new UnauthorizedException(
        'Dto is invalid - no refresh token in body',
      );
    }
    let currentUser: UserEntity;
    try {
      const decoded = (await jwt.verify(
        tokenDto.refreshToken,
        process.env.JWT_SECRET_REFRESH_KEY,
      )) as UserTokenData;
      currentUser = await this.userRepository.findOneBy({
        id: decoded.userId,
      });
    } catch (err) {
      throw new ForbiddenException('Refresh token is invalid or expired');
    }

    currentUser.accessToken = await this.getToken(currentUser, {
      refresh: false,
    });

    currentUser.refreshToken = await this.getToken(currentUser, {
      refresh: true,
    });

    await this.userRepository.save(currentUser);

    return {
      accessToken: currentUser.accessToken,
      refreshToken: currentUser.refreshToken,
    };
  }
}
