import normaliseLyricSpaces from 'Scenes/Convert/Steps/SyncLyricsToVideo/Helpers/normaliseLyricSpaces';
import { generateNote, generateSong } from 'utils/testUtils';

describe('normaliseLyricSpaces', () => {
  it('should move prefix spaces to end of previous syllabe', () => {
    const song = generateSong([
      [
        {
          type: 'notes',
          start: 0,
          notes: [
            generateNote(0, 1, { lyrics: ' a' }),
            generateNote(0, 1, { lyrics: ' b' }),
            generateNote(0, 1, { lyrics: ' c' }),
          ],
        },
      ],
    ]);
    const expected = generateSong([
      [
        {
          type: 'notes',
          start: 0,
          notes: [
            generateNote(0, 1, { lyrics: 'a ' }),
            generateNote(0, 1, { lyrics: 'b ' }),
            generateNote(0, 1, { lyrics: 'c' }),
          ],
        },
      ],
    ]);

    expect(normaliseLyricSpaces(song)).toEqual(expected);
  });
});
