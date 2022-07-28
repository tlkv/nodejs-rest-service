import { IsInt, IsString, IsUUID } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('track')
export class TrackEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'uuid', nullable: true })
  artistId: string | null;

  @Column({ type: 'uuid', nullable: true })
  albumId: string | null;

  @Column()
  duration: number;
}

export class Track {
  id: string;

  @IsString()
  name: string;

  @IsUUID(4)
  artistId: string | null;

  @IsUUID(4)
  albumId: string | null;

  @IsInt()
  duration: number;
}
