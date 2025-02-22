import styled from '@emotion/styled';
import { Button } from 'Elements/Button';
import { focusedStatic, typography } from 'Elements/cssMixins';
import useKeyboard from 'hooks/useKeyboard';
import useKeyboardNav from 'hooks/useKeyboardNav';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { PlaylistEntry } from 'Scenes/SingASong/SongSelection/Hooks/usePlaylists';

interface Props {
  selectedPlaylist: string | null;
  setSelectedPlaylist: Dispatch<SetStateAction<string | null>>;
  playlists: PlaylistEntry[];
  closePlaylist: (leavingKey: 'left' | 'right') => void;
  active: boolean;
}

export default function Playlists({ active, closePlaylist, playlists, selectedPlaylist, setSelectedPlaylist }: Props) {
  const { register, focused, focusElement } = useKeyboardNav({
    enabled: active,
    additionalHelp: {
      // It's possible to leave the playlists with left/right
      vertical: undefined,
      'horizontal-vertical': null,
    },
  });

  useKeyboard(
    {
      left: () => closePlaylist('left'),
      right: () => closePlaylist('right'),
    },
    active,
  );

  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get('playlist');
    if (param) {
      focusElement(`playlist-${param}`);
    }
  }, []);

  useEffect(() => {
    if (focused) {
      const playlist = playlists.find((list) => `playlist-${list.name}` === focused);
      if (playlist) {
        /// push query param to url containing playlist name
        const url = new URL(window.location.href);
        url.searchParams.set('playlist', playlist.name);
        window.history.pushState(null, '', url.toString());
        setSelectedPlaylist(playlist.name);
      }
    }
  }, [focused, playlists]);

  return (
    <Container data-test="song-list-playlists" active={active}>
      {playlists.map((playlist) => (
        <Playlist
          key={playlist.name}
          data-selected={`playlist-${playlist.name}` === focused}
          active={active}
          {...register(
            `playlist-${playlist.name}`,
            () => focusElement(`playlist-${playlist.name}`),
            undefined,
            playlist.name === selectedPlaylist,
          )}
          {...(!active ? { selected: `playlist-${playlist.name}` === focused } : {})}>
          {playlist.display ?? playlist.name}
        </Playlist>
      ))}
    </Container>
  );
}

const Container = styled.div<{ active: boolean }>`
  background: rgba(0, 0, 0, ${(props) => (props.active ? 0.75 : 0.5)});
  width: 100vh;
  transform-origin: top right;
  transform: rotate(-90deg);
  position: absolute;
  left: -100vh;
  top: 0;
  font-size: 3.6rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: row-reverse;
  gap: 0;

  h2 {
    ${typography};
    margin: 0;
  }
`;

const Playlist = styled(Button)<{ selected?: boolean; active: boolean }>`
  font-size: 3rem;
  justify-self: stretch;
  flex-grow: 1;
  ${(props) => !props.focused && props.active && `background-color: transparent;`};
  padding: 1.5rem;
  ${(props) => (props.selected ? focusedStatic : !props.active && `opacity: .75;`)}
`;
