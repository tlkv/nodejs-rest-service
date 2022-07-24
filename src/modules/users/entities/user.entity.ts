import { Exclude } from 'class-transformer';
import { IsInt, IsString, IsUUID } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export class UserData {
  @IsUUID(4)
  id: string;

  @IsString()
  login: string;

  @IsString()
  @Exclude()
  password: string;

  @IsInt()
  version: number;

  @IsInt()
  createdAt: number;

  @IsInt()
  updatedAt: number;
}

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  login: string;

  @Column()
  password: string;

  toResponse() {
    const { id, login } = this;
    return { id, login };
  }
}
