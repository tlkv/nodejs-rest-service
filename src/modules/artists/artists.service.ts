import { Injectable, NotFoundException } from '@nestjs/common';
import { MemoryDb } from 'src/services/db.service';
import { v4 } from 'uuid';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';

@Injectable()
export class ArtistsService {
  // inj repository
  create(createArtistDto: CreateArtistDto) {
    const newArtist = {
      id: v4(),
      name: createArtistDto.name,
      grammy: createArtistDto.grammy,
    };
    MemoryDb.artists.push(newArtist);
    return newArtist;
  }

  findAll() {
    return MemoryDb.artists;
  }

  findOne(id: string) {
    const currArtist = MemoryDb.artists.find((i) => i.id === id);
    if (!currArtist) {
      throw new NotFoundException('Artist not found');
    }
    return currArtist;
  }

  update(id: string, updateArtistDto: UpdateArtistDto) {
    const currArtist = this.findOne(id);
    if (!currArtist) return;
    const elemIndex = MemoryDb.artists.findIndex((i) => i.id === id);

    MemoryDb.artists[elemIndex] = {
      ...MemoryDb.artists[elemIndex],
      ...updateArtistDto,
    };

    return MemoryDb.artists[elemIndex];
  }

  remove(id: string) {
    const currArtist = this.findOne(id);
    if (!currArtist) return;
    MemoryDb.artists = MemoryDb.artists.filter((i) => i.id !== id);
    MemoryDb.favorites.artists = MemoryDb.favorites.artists.filter(
      (i) => i !== id,
    );
    MemoryDb.tracks.forEach((i) => {
      if (i.artistId === id) {
        i.artistId = null;
      }
    });
    MemoryDb.albums.forEach((i) => {
      if (i.artistId === id) {
        i.artistId = null;
      }
    });
  }
}
