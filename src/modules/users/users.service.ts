import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { v4 } from 'uuid';
import { MemoryDb } from 'src/services/db.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDto } from './dto/user.dto';
import { UserEntity } from './entities/user.entity';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async createDB(userDto: UserDto) {
    await this.isLoginExistsDB(userDto.login);
    const createdUser = this.userRepository.create(userDto);
    return (await this.userRepository.save(createdUser)).toResponse();
  }

  async findAllDB() {
    const users = await this.userRepository.find();
    return users.map((user) => user.toResponse());
  }

  async findOneDB(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (user) return user.toResponse();
    throw new NotFoundException();
  }

  async updateDB(userId: string, userDto: UserDto) {
    if (userDto.id) delete userDto.id;
    const updatedUser = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (userDto.login !== updatedUser.login) {
      await this.isLoginExistsDB(userDto.login);
    }

    if (updatedUser) {
      Object.assign(updatedUser, userDto);
      return (await this.userRepository.save(updatedUser)).toResponse(); // don't show passw
    }

    throw new NotFoundException();
  }

  async findByLoginDB(login: string) {
    const user = await this.userRepository.findOne({ where: { login } });
    if (user) return user;
  }

  async isLoginExistsDB(login: string) {
    const user = await this.findByLoginDB(login);
    if (user) throw new BadRequestException('Login already exists');
  }

  async deleteDB(userId: string) {
    const result = await this.userRepository.delete(userId);
    if (result.affected === 0) {
      throw new NotFoundException('Not found');
    }
  }

  /* --- */

  getAll() {
    return MemoryDb.users.map((i) => {
      delete i.password;
      return i;
    });
  }

  getById(id: string, withPassword: boolean) {
    const currUser = MemoryDb.users.find((i) => i.id === id);
    if (!currUser) {
      throw new NotFoundException('User not found');
    }
    const res = { ...currUser, id };
    if (!withPassword) {
      delete res.password;
    }
    return res;
  }

  create(userDto: CreateUserDto) {
    const newUser = {
      id: v4(),
      login: userDto.login,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    MemoryDb.users.push({ ...newUser, password: userDto.password });
    return newUser;
  }

  remove(id: string) {
    const currUser = this.getById(id, false);
    if (!currUser) return;
    MemoryDb.users = MemoryDb.users.filter((i) => i.id !== id);
  }

  update(updateUserDto: UpdateUserDto, id: string) {
    const currUser = this.getById(id, true);
    if (!currUser) return;
    const elemIndex = MemoryDb.users.findIndex((i) => i.id === id);

    MemoryDb.users[elemIndex] = {
      ...MemoryDb.users[elemIndex],
      version: MemoryDb.users[elemIndex].version + 1,
      password: updateUserDto.newPassword,
      updatedAt: Date.now(),
    };

    const res = { ...MemoryDb.users[elemIndex] };
    delete res.password;
    return res;
  }

  getPass(id: string) {
    const currUser = this.getById(id, true);
    return {
      password: currUser.password,
    };
  }
}
