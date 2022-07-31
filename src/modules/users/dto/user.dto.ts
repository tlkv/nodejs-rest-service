import { IsNotEmpty, IsString } from 'class-validator';

export class UserDto {
  id?: string;

  @IsNotEmpty()
  @IsString()
  login!: string;

  @IsNotEmpty()
  @IsString()
  password!: string;
}
