import { IsBoolean, IsString } from 'class-validator';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AlbumEntity } from 'src/modules/albums/entities/album.entity';
import { TrackEntity } from 'src/modules/tracks/entities/track.entity';
import { FavoritesEntity } from 'src/modules/favorites/entities/favorite.entity';

@Entity('artist')
export class ArtistEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  grammy: boolean;

  @OneToMany(() => AlbumEntity, (album) => album.artist)
  album: AlbumEntity[];

  @OneToMany(() => TrackEntity, (track) => track.artist)
  track: TrackEntity[];

  @ManyToOne(() => FavoritesEntity, (favorite) => favorite.artists, {
    onDelete: 'CASCADE',
  })
  favorites: FavoritesEntity;
}
export class Artist {
  id: string;
  @IsString()
  name: string;

  @IsBoolean()
  grammy: boolean;
}
