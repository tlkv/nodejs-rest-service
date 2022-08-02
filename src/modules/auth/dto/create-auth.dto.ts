import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAuthDto {
  id?: string;

  @IsNotEmpty()
  @IsString()
  login!: string;

  @IsNotEmpty()
  @IsString()
  password!: string;
}
