import { ApiProperty } from '@nestjs/swagger';

export class UserScheme {
  @ApiProperty({ example: '123' })
  id!: string;

  @ApiProperty({ example: '456' })
  login!: string;
}
