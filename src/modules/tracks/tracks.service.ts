import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { TrackEntity } from './entities/track.entity';

@Injectable()
export class TracksService {
  constructor(
    @InjectRepository(TrackEntity)
    private trackRepository: Repository<TrackEntity>,
  ) {}

  async create(createTrackDto: CreateTrackDto) {
    const newTrack = {
      id: v4(),
      name: createTrackDto.name,
      albumId: createTrackDto.albumId,
      artistId: createTrackDto.artistId,
      duration: createTrackDto.duration,
    };
    await this.trackRepository.save(newTrack);
    //MemoryDb.tracks.push(newTrack);
    return newTrack;
  }

  async findAll() {
    //return MemoryDb.tracks;
    const tracks = await this.trackRepository.find();
    return tracks;
  }

  async findOne(id: string) {
    const track = await this.trackRepository.findOne({ where: { id } });
    if (!track) {
      throw new NotFoundException('Track not found');
    }
    return track;
    /* const currTrack = MemoryDb.tracks.find((i) => i.id === id);
    if (!currTrack) {
      throw new NotFoundException('Track not found');
    }
    return currTrack; */
  }

  async update(id: string, updateTrackDto: UpdateTrackDto) {
    // const currTrack = this.findOne(id);
    const currTrack = await this.trackRepository.findOne({ where: { id } });
    if (!currTrack) {
      throw new NotFoundException('Track not found');
    }
    if (!currTrack) return;
    //
    const updatedTrack = { ...currTrack, ...updateTrackDto };
    await this.trackRepository.save(updatedTrack);
    return updatedTrack;
    /*  if (!currTrack) return;
    const elemIndex = MemoryDb.tracks.findIndex((i) => i.id === id);
    MemoryDb.tracks[elemIndex] = {
      ...MemoryDb.tracks[elemIndex],
      ...updateTrackDto,
    };
    return MemoryDb.tracks[elemIndex]; */
  }

  async remove(id: string) {
    const result = await this.trackRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Not found');
    }
    /* const currTrack = this.findOne(id);
    if (!currTrack) return;
    MemoryDb.tracks = MemoryDb.tracks.filter((i) => i.id !== id);
    MemoryDb.favorites.tracks = MemoryDb.favorites.tracks.filter(
      (i) => i !== id,
    ); */
  }
}
