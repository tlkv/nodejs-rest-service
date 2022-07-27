import { IsBoolean, IsString } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('artist')
export class ArtistEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  grammy: boolean;
}
export class Artist {
  id: string;
  @IsString()
  name: string;

  @IsBoolean()
  grammy: boolean;
}
