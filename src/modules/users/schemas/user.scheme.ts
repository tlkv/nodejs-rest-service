import { ApiProperty } from '@nestjs/swagger';

export class UserScheme {
  @ApiProperty({ example: 'id' })
  id!: string;

  @ApiProperty({ example: 'login' })
  login!: string;
}
