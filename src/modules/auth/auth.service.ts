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
    return jwt.sign(
      {
        id: user.id,
        login: user.login,
      },
      process.env.JWT_SECRET_KEY as string,
      {
        expiresIn: params.refresh ? '10d' : '10m',
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
    delete authUser.password;
    return authUser;
  }

  async refresh(tokenDto: TokenDto) {
    if (!tokenDto.refreshToken) {
      throw new UnauthorizedException('Dto is invalid');
    }
    let currentUser: UserEntity;
    try {
      const decoded = (await jwt.verify(
        tokenDto.refreshToken,
        process.env.JWT_SECRET_KEY,
      )) as UserTokenData;
      currentUser = await this.userRepository.findOneBy({
        id: decoded.id,
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
      refreshToken: currentUser.refreshToken,
      accessToken: currentUser.accessToken,
    };
  }
}
