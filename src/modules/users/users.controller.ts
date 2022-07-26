import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAll() {
    return this.usersService.findAllDB();
    //return this.usersService.getAll();
  }

  @Get(':id')
  getOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.usersService.findOneDB(id);
    //return this.usersService.getById(id, false);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createDB(createUserDto);
    //return this.usersService.create(createUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.usersService.deleteDB(id);
    // return this.usersService.remove(id);
  }

  @Put(':id')
  update(
    @Body() updateUserDto: CreateUserDto,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    /*  if (updateUserDto.oldPassword === updateUserDto.newPassword) {
      throw new ForbiddenException('Password matches the old one');
    } else if (
      this.usersService.getPass(id).password !== updateUserDto.oldPassword
    ) {
      throw new ForbiddenException('Old password do not match');
    } 
    return this.usersService.update(updateUserDto, id);*/
    return this.usersService.updateDB(id, updateUserDto);
  }
}
