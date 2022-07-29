import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
    return newAlbum;
  }

  async findAll() {
    const albums = await this.albumRepository.find();
    return albums;
  }

  async findOne(id: string) {
    const album = await this.albumRepository.findOne({ where: { id } });
    if (!album) {
      throw new NotFoundException('Album not found');
    }
    return album;
  }

  async findEntity(id: string): Promise<AlbumEntity> {
    const album = await this.albumRepository.findOneBy({ id });
    if (!album) {
      throw new UnprocessableEntityException(
        `Album with id ${id} does not exist`,
      );
    }
    return album;
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto) {
    const currAlbum = await this.albumRepository.findOne({ where: { id } });
    if (!currAlbum) {
      throw new NotFoundException('Album not found');
    }
    if (!currAlbum) return;
    const updatedAlbum = { ...currAlbum, ...updateAlbumDto };
    await this.albumRepository.save(updatedAlbum);
    return updatedAlbum;
  }

  async remove(id: string) {
    const result = await this.albumRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Not found');
    }
  }
}
