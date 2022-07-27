import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { ArtistEntity } from './entities/artist.entity';

@Injectable()
export class ArtistsService {
  constructor(
    @InjectRepository(ArtistEntity)
    private artistRepository: Repository<ArtistEntity>,
  ) {}

  async create(createArtistDto: CreateArtistDto) {
    const newArtist = {
      id: v4(),
      name: createArtistDto.name,
      grammy: createArtistDto.grammy,
    };
    await this.artistRepository.save(newArtist);
    //MemoryDb.artists.push(newArtist);
    return newArtist;
  }

  async findAll() {
    // return MemoryDb.artists;
    const artists = await this.artistRepository.find();
    return artists;
  }

  async findOne(id: string) {
    const artist = await this.artistRepository.findOne({ where: { id } });
    console.log('artist found ', artist);
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }
    return artist;
    /* const currArtist = MemoryDb.artists.find((i) => i.id === id);
    if (!currArtist) {
      throw new NotFoundException('Artist not found');
    }
    return currArtist; */
  }

  async update(id: string, updateArtistDto: UpdateArtistDto) {
    // const currArtist = this.findOne(id);
    const currArtist = await this.artistRepository.findOne({ where: { id } });
    console.log('currArtist found ', currArtist);
    if (!currArtist) {
      throw new NotFoundException('Artist not found');
    }
    if (!currArtist) return;
    //
    const updatedArtist = { ...currArtist, ...updateArtistDto };
    await this.artistRepository.save(updatedArtist);
    return updatedArtist;

    /* const elemIndex = MemoryDb.artists.findIndex((i) => i.id === id);

    MemoryDb.artists[elemIndex] = {
      ...MemoryDb.artists[elemIndex],
      ...updateArtistDto,
    };

    return MemoryDb.artists[elemIndex]; */
  }

  async remove(id: string) {
    const result = await this.artistRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Not found');
    }

    /* MemoryDb.artists = MemoryDb.artists.filter((i) => i.id !== id);
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
    }); */
  }
}
