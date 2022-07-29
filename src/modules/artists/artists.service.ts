import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
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
    return newArtist;
  }

  async findAll() {
    const artists = await this.artistRepository.find();
    return artists;
  }

  async findOne(id: string) {
    const artist = await this.artistRepository.findOne({ where: { id } });
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }
    return artist;
  }

  async findEntity(id: string) {
    const artist = await this.artistRepository.findOneBy({ id });
    if (!artist) {
      throw new UnprocessableEntityException(
        `Artist with id ${id} does not exist`,
      );
    }
    return artist;
  }

  async update(id: string, updateArtistDto: UpdateArtistDto) {
    const currArtist = await this.artistRepository.findOne({ where: { id } });
    if (!currArtist) {
      throw new NotFoundException('Artist not found');
    }
    if (!currArtist) return;
    const updatedArtist = { ...currArtist, ...updateArtistDto };
    await this.artistRepository.save(updatedArtist);
    return updatedArtist;
  }

  async remove(id: string) {
    const result = await this.artistRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Not found');
    }
  }
}
