import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 } from 'uuid';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDto } from './dto/user.dto';
import { UserEntity } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async create(userDto: UserDto) {
    const hashPassword = await bcrypt.hash(
      userDto.password,
      parseInt(process.env.CRYPT_SALT),
    );
    const createdUser = {
      id: v4(),
      login: userDto.login,
      password: hashPassword,
      version: 1,
      createdAt: Math.floor(Date.now() / 1000),
      updatedAt: Math.floor(Date.now() / 1000),
      accessToken: '',
      refreshToken: '',
    };
    await this.userRepository.save(createdUser);
    return this.excludePasswordTokens(createdUser);
  }

  async findAll() {
    const users = await this.userRepository.find();
    return users.map((user) => this.excludePassword(user));
  }

  async findOne(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.excludePassword(user);
  }

  async update(userId: string, userDto: UpdateUserDto) {
    if (userDto.oldPassword === userDto.newPassword) {
      throw new ForbiddenException('Password matches the old one');
    }

    const currentUser = await this.userRepository.findOneBy({
      id: userId,
    });

    if (!currentUser) {
      throw new NotFoundException('User not found');
    }

    const isCorrectPassword = await bcrypt.compare(
      userDto.oldPassword,
      currentUser.password,
    );

    if (!isCorrectPassword) {
      throw new ForbiddenException('Old password do not match');
    }

    const hashPassword = await bcrypt.hash(
      userDto.newPassword,
      parseInt(process.env.CRYPT_SALT),
    );

    const updatedUser = {
      ...currentUser,
      version: currentUser.version + 1,
      password: hashPassword,
      updatedAt: Math.ceil(Date.now() / 1000),
    };
    await this.userRepository.save(updatedUser);
    return this.excludePassword(updatedUser);
  }

  async remove(userId: string) {
    const result = await this.userRepository.delete(userId);
    if (result.affected === 0) {
      throw new NotFoundException('Not found');
    }
  }

  excludePassword(user: UserEntity) {
    const currentData = { ...user };
    delete currentData.password;
    return currentData;
  }

  excludePasswordTokens(user: UserEntity) {
    const currentData = { ...user };
    delete currentData.password;
    delete currentData.refreshToken;
    delete currentData.accessToken;
    return currentData;
  }
}
