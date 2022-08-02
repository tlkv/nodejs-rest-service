import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

//configEnv

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private userService: UsersService,
  ) {}
  async signup(createAuthDto: CreateAuthDto) {
    const newUser = await this.userService.create(createAuthDto);
    return newUser;
  }

  async login(createAuthDto: CreateAuthDto) {
    return 'login';
  }

  async refresh(createAuthDto: CreateAuthDto) {
    return 'refresh';
  }
}
