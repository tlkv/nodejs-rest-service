import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserEntity } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import * as jsonwebtoken from 'jsonwebtoken';

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

  async login(loginDto: CreateAuthDto) {
    const currentUser = await this.userRepository.findOneBy({
      login: loginDto.login,
    });

    if (!currentUser) {
      throw new ForbiddenException();
    }

    const isCorrectPassword = await bcrypt.compare(
      loginDto.password,
      currentUser.password,
    );

    if (!isCorrectPassword) {
      throw new ForbiddenException();
    }
    // jsonwebtoken
    //get tokens
  }

  async refresh(createAuthDto: CreateAuthDto) {
    //tokenDto
    return 'refresh';
  }
}
