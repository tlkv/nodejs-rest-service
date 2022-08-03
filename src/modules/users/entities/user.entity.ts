import { Exclude } from 'class-transformer';
import { IsInt, IsString, IsUUID } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  login: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  version: number;

  @Column()
  createdAt: number;

  @Column()
  updatedAt: number;

  @Column({ default: '', nullable: true }) //non null?
  accessToken: string;

  @Column({ default: '', nullable: true }) //non null?
  @Exclude()
  refreshToken: string;
}

export interface UserTokenData {
  id: string;
  login: string;
}

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
