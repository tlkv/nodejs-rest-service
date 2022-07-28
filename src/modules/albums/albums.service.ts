import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MemoryDb } from 'src/services/db.service';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { AlbumEntity } from './entities/album.entity';

@Injectable()
export class AlbumsService {
  constructor(
    @InjectRepository(AlbumEntity)
    private albumRepository: Repository<AlbumEntity>,
  ) {}

  async create(createAlbumDto: CreateAlbumDto) {
    const newAlbum = {
      id: v4(),
      name: createAlbumDto.name,
      year: createAlbumDto.year,
      artistId: createAlbumDto.artistId,
    };
    await this.albumRepository.save(newAlbum);
    //MemoryDb.albums.push(newAlbum);
    return newAlbum;
  }

  async findAll() {
    //return MemoryDb.albums;
    const albums = await this.albumRepository.find();
    return albums;
  }

  async findOne(id: string) {
    const album = await this.albumRepository.findOne({ where: { id } });
    if (!album) {
      throw new NotFoundException('Album not found');
    }
    return album;
    /* const currAlbum = MemoryDb.albums.find((i) => i.id === id);
    if (!currAlbum) {
      throw new NotFoundException('Album not found');
    }
    return currAlbum; */
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto) {
    // const currAlbum = this.findOne(id);
    const currAlbum = await this.albumRepository.findOne({ where: { id } });
    if (!currAlbum) {
      throw new NotFoundException('Album not found');
    }
    if (!currAlbum) return;
    //
    const updatedAlbum = { ...currAlbum, ...updateAlbumDto };
    await this.albumRepository.save(updatedAlbum);
    return updatedAlbum;
    /* const elemIndex = MemoryDb.albums.findIndex((i) => i.id === id);

    MemoryDb.albums[elemIndex] = {
      ...MemoryDb.albums[elemIndex],
      ...updateAlbumDto,
    };

    return MemoryDb.albums[elemIndex]; */
  }

  async remove(id: string) {
    const result = await this.albumRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Not found');
    }
    /* const currAlbum = this.findOne(id);
    if (!currAlbum) return;
    MemoryDb.albums = MemoryDb.albums.filter((i) => i.id !== id);
    MemoryDb.favorites.albums = MemoryDb.favorites.albums.filter(
      (i) => i !== id,
    );
    MemoryDb.tracks.forEach((i) => {
      if (i.albumId === id) {
        i.albumId = null;
      }
    }); */
  }
}
