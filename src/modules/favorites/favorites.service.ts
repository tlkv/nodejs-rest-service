import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlbumsService } from '../albums/albums.service';
import { ArtistsService } from '../artists/artists.service';
import { TracksService } from '../tracks/tracks.service';
import { FavoritesEntity } from './entities/favorite.entity';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(FavoritesEntity)
    private favoritesRepository: Repository<FavoritesEntity>,
    private artistsService: ArtistsService,
    private albumsService: AlbumsService,
    private tracksService: TracksService,
  ) {
    this.getAll();
  }

  async getAll() {
    const [favorites] = await this.favoritesRepository.find({
      relations: {
        albums: true,
        artists: true,
        tracks: true,
      },
    });
    if (!favorites) {
      this.favoritesRepository.save({});
    }
    return favorites;
  }

  async createTrack(id: string) {
    const track = await this.tracksService.findEntity(id);
    const favorites = await this.getAll();
    favorites.tracks.push(track);
    await this.favoritesRepository.save(favorites);
    return track;
  }

  async removeTrack(id: string) {
    const track = await this.tracksService.findOne(id);
    const favorites = await this.getAll();
    favorites.tracks = favorites.tracks.filter((item) => item.id !== id);
    await this.favoritesRepository.save(favorites);
    return track;
  }

  async createArtist(id: string) {
    const artist = await this.artistsService.findEntity(id);
    const favorites = await this.getAll();
    favorites.artists.push(artist);
    await this.favoritesRepository.save(favorites);
    return artist;
  }

  async removeArtist(id: string) {
    const artist = await this.artistsService.findOne(id);
    const favorites = await this.getAll();
    favorites.artists = favorites.artists.filter((item) => item.id !== id);
    await this.favoritesRepository.save(favorites);
    return artist;
  }

  async createAlbum(id: string) {
    const album = await this.albumsService.findEntity(id);
    const favorites = await this.getAll();
    favorites.albums.push(album);
    await this.favoritesRepository.save(favorites);
    return album;
  }

  async removeAlbum(id: string) {
    const album = await this.albumsService.findOne(id);
    const favorites = await this.getAll();
    favorites.albums = favorites.albums.filter((item) => item.id !== id);
    await this.favoritesRepository.save(favorites);
    return album;
  }
}
