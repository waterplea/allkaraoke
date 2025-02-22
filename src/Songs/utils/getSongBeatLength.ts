import { Song, SongPreview } from 'interfaces';
import { memoize } from 'lodash-es';

export default memoize(function getSongBeatLength(song: Song | SongPreview): number {
  return (60 / song.bpm / song.bar) * 1000;
});
