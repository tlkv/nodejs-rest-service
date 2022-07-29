import { IsInt, IsString, IsUUID } from 'class-validator';
import { AlbumEntity } from 'src/modules/albums/entities/album.entity';
import { ArtistEntity } from 'src/modules/artists/entities/artist.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column({ type: 'int' })
  duration: number;

  @ManyToOne(() => AlbumEntity, (album) => album.track, {
    onDelete: 'SET NULL',
  })
  album: AlbumEntity[];

  @ManyToOne(() => ArtistEntity, (artist) => artist.track, {
    onDelete: 'SET NULL',
  })
  artist: ArtistEntity[];
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
