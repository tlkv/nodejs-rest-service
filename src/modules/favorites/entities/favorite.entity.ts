import { IsArray } from 'class-validator';
import { Track, TrackEntity } from 'src/modules/tracks/entities/track.entity';
import { Album, AlbumEntity } from 'src/modules/albums/entities/album.entity';
import {
  Artist,
  ArtistEntity,
} from 'src/modules/artists/entities/artist.entity';
import { Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('favorites')
export class FavoritesEntity {
  @Exclude()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => ArtistEntity, (artist) => artist.favorites)
  artists: ArtistEntity[];

  @OneToMany(() => AlbumEntity, (album) => album.favorites)
  albums: AlbumEntity[];

  @OneToMany(() => TrackEntity, (track) => track.favorites)
  tracks: TrackEntity[];
}

export class Favorite {
  @IsArray()
  artists: Artist[];

  @IsArray()
  albums: Album[];

  @IsArray()
  tracks: Track[];
}
