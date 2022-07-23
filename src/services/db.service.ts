import { Album } from 'src/modules/albums/entities/album.entity';
import { Artist } from 'src/modules/artists/entities/artist.entity';
import { Track } from 'src/modules/tracks/entities/track.entity';
import { UserData } from 'src/modules/users/entities/user.entity';

type Favs = {
  artists: Artist[]; // string[]
  albums: Album[];
  tracks: Track[];
};
export class MemoryDb {
  static users: UserData[] = [];
  static artists: Artist[] = [];
  static albums: Album[] = [];
  static tracks: Track[] = [];
  static favorites: Favs = {
    tracks: [],
    artists: [],
    albums: [],
  };
}
