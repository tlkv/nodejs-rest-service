import { IsInt, IsString, IsUUID } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('album')
export class AlbumEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  year: number;

  @Column({ type: 'uuid', nullable: true })
  artistId: string | null;
}

export class Album {
  id: string;
  @IsString()
  name: string;

  @IsInt()
  year: number;

  @IsUUID(4)
  artistId: string | null;
}
