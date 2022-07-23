import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { MemoryDb } from 'src/services/db.service';

@Injectable()
export class FavoritesService {
  findAll() {
    return {
      artists: MemoryDb.artists.filter((i) =>
        MemoryDb.favorites.artists.includes(i.id),
      ),
      tracks: MemoryDb.tracks.filter((i) =>
        MemoryDb.favorites.tracks.includes(i.id),
      ),
      albums: MemoryDb.albums.filter((i) =>
        MemoryDb.favorites.albums.includes(i.id),
      ),
    };
  }

  createTrack(id: string) {
    const currTrack = MemoryDb.tracks.find((i) => i.id === id);
    const currTrackFavs = MemoryDb.favorites.tracks.find((i) => i === id);
    if (!currTrack || currTrackFavs) {
      throw new UnprocessableEntityException();
    }
    MemoryDb.favorites.tracks.push(id);
  }

  removeTrack(id: string) {
    const currTrack = MemoryDb.favorites.tracks.find((i) => i === id);
    if (!currTrack) {
      throw new NotFoundException();
    }
    MemoryDb.favorites.tracks = MemoryDb.favorites.tracks.filter(
      (i) => i !== id,
    );
  }

  createArtist(id: string) {
    const currArtist = MemoryDb.artists.find((i) => i.id === id);
    if (!currArtist) {
      throw new UnprocessableEntityException();
    }
    MemoryDb.favorites.artists.push(id);
  }

  removeArtist(id: string) {
    const currArtist = MemoryDb.favorites.artists.find((i) => i === id);
    if (!currArtist) {
      throw new NotFoundException();
    }
    MemoryDb.favorites.artists = MemoryDb.favorites.artists.filter(
      (i) => i !== id,
    );
  }

  createAlbum(id: string) {
    const currAlbum = MemoryDb.albums.find((i) => i.id === id);
    if (!currAlbum) {
      throw new UnprocessableEntityException();
    }
    MemoryDb.favorites.albums.push(id);
  }

  removeAlbum(id: string) {
    const currAlbum = MemoryDb.favorites.albums.find((i) => i === id);
    if (!currAlbum) {
      throw new NotFoundException();
    }
    MemoryDb.favorites.albums = MemoryDb.favorites.albums.filter(
      (i) => i !== id,
    );
  }
}
