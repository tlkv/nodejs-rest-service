import { Injectable, NotFoundException } from '@nestjs/common';
import { MemoryDb } from 'src/services/db.service';
import { v4 } from 'uuid';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';

@Injectable()
export class AlbumsService {
  create(createAlbumDto: CreateAlbumDto) {
    const newAlbum = {
      id: v4(),
      name: createAlbumDto.name,
      year: createAlbumDto.year,
      artistId: createAlbumDto.artistId,
    };
    MemoryDb.albums.push(newAlbum);
    return newAlbum;
  }

  findAll() {
    return MemoryDb.albums;
  }

  findOne(id: string) {
    const currAlbum = MemoryDb.albums.find((i) => i.id === id);
    if (!currAlbum) {
      throw new NotFoundException('Album not found');
    }
    return currAlbum;
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto) {
    const currAlbum = this.findOne(id);
    if (!currAlbum) return;
    const elemIndex = MemoryDb.albums.findIndex((i) => i.id === id);

    MemoryDb.albums[elemIndex] = {
      ...MemoryDb.albums[elemIndex],
      ...updateAlbumDto,
    };

    return MemoryDb.albums[elemIndex];
  }

  remove(id: string) {
    const currAlbum = this.findOne(id);
    if (!currAlbum) return;
    MemoryDb.albums = MemoryDb.albums.filter((i) => i.id !== id);
    MemoryDb.favorites.albums = MemoryDb.favorites.albums.filter(
      (i) => i !== id,
    );
    MemoryDb.tracks.forEach((i) => {
      if (i.albumId === id) {
        i.albumId = null;
      }
    });
  }
}
