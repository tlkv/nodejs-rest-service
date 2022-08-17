import { Module } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoritesEntity } from './entities/favorite.entity';
import { AlbumsModule } from '../albums/albums.module';
import { TracksModule } from '../tracks/tracks.module';
import { ArtistsModule } from '../artists/artists.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FavoritesEntity]),
    AlbumsModule,
    ArtistsModule,
    TracksModule,
  ],
  controllers: [FavoritesController],
  providers: [FavoritesService],
  exports: [FavoritesService],
})
export class FavoritesModule {}
