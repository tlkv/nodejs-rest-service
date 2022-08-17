import { IsInt, IsString, IsUUID } from 'class-validator';
import { ArtistEntity } from 'src/modules/artists/entities/artist.entity';
import { FavoritesEntity } from 'src/modules/favorites/entities/favorite.entity';
import { TrackEntity } from 'src/modules/tracks/entities/track.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
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

  @OneToMany(() => TrackEntity, (track) => track.album, {
    onDelete: 'SET NULL',
  })
  track: TrackEntity[];

  @ManyToOne(() => ArtistEntity, (artist) => artist.album, {
    onDelete: 'SET NULL',
  })
  artist: ArtistEntity;

  @ManyToOne(() => FavoritesEntity, (favorite) => favorite.albums, {
    onDelete: 'CASCADE',
  })
  favorites: FavoritesEntity;
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
