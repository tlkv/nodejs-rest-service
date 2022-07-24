import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  id?: string; //

  @IsNotEmpty()
  @IsString()
  login!: string; // !

  @IsNotEmpty()
  @IsString()
  password!: string;
}
