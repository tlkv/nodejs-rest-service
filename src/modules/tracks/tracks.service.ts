import { Injectable, NotFoundException } from '@nestjs/common';
import { MemoryDb } from 'src/services/db.service';
import { v4 } from 'uuid';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';

@Injectable()
export class TracksService {
  create(createTrackDto: CreateTrackDto) {
    const newTrack = {
      id: v4(),
      name: createTrackDto.name,
      albumId: createTrackDto.albumId,
      artistId: createTrackDto.artistId,
      duration: createTrackDto.duration,
    };
    MemoryDb.tracks.push(newTrack);
    return newTrack;
  }

  findAll() {
    return MemoryDb.tracks;
  }

  findOne(id: string) {
    const currTrack = MemoryDb.tracks.find((i) => i.id === id);
    if (!currTrack) {
      throw new NotFoundException('Track not found');
    }
    return currTrack;
  }

  update(id: string, updateTrackDto: UpdateTrackDto) {
    const currTrack = this.findOne(id);
    if (!currTrack) return;
    const elemIndex = MemoryDb.tracks.findIndex((i) => i.id === id);
    MemoryDb.tracks[elemIndex] = {
      ...MemoryDb.tracks[elemIndex],
      ...updateTrackDto,
    };
    return MemoryDb.tracks[elemIndex];
  }

  remove(id: string) {
    const currTrack = this.findOne(id);
    if (!currTrack) return;
    MemoryDb.tracks = MemoryDb.tracks.filter((i) => i.id !== id);
    MemoryDb.favorites.tracks = MemoryDb.favorites.tracks.filter(
      (i) => i !== id,
    );
  }
}
