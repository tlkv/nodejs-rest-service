import { IsOptional, IsString } from 'class-validator';

export class TokenDto {
  @IsString()
  @IsOptional()
  readonly refreshToken: string;
}
