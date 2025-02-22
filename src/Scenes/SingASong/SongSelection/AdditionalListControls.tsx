import styled from '@emotion/styled';
import { Casino, Search } from '@mui/icons-material';
import { Button } from 'Elements/Button';
import { Tooltip } from 'Elements/Tooltip';
import styles from 'Scenes/Game/Singing/GameOverlay/Drawing/styles';
import { AppliedFilters } from 'Scenes/SingASong/SongSelection/Hooks/useSongList';
import QuickSearch from 'Scenes/SingASong/SongSelection/QuickSearch';
import { Dispatch, SetStateAction, useState } from 'react';

interface Props {
  onRandom: () => void;
  setFilters: Dispatch<SetStateAction<AppliedFilters>>;
  filters: AppliedFilters;
  keyboardControl: boolean;
}

export default function AdditionalListControls({ onRandom, setFilters, filters, keyboardControl }: Props) {
  const [searchActive, setSearchActive] = useState(false);

  const clearSearch = () => {
    setFilters((current) => ({ ...current, search: '' }));
  };

  return (
    <>
      <Container>
        <Tooltip title="Search" placement="left">
          <RoundButton
            onClick={() => (searchActive ? clearSearch() : setSearchActive(true))}
            data-test="search-song-button">
            <Search />
          </RoundButton>
        </Tooltip>
        <Tooltip title="Pick random" placement="left">
          <RoundButton onClick={onRandom} data-test="random-song-button">
            <Casino />
          </RoundButton>
        </Tooltip>
      </Container>

      <QuickSearch
        setFilters={setFilters}
        filters={filters}
        visible={searchActive}
        setVisible={setSearchActive}
        keyboardControl={keyboardControl}
      />
    </>
  );
}

const RoundButton = styled(Button)`
  box-shadow: inset 0 0 2px 2px ${styles.colors.text.active};
  background: black;
  width: 7.5rem;
  height: 7.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 4.5rem;
    height: 4.5rem;
  }
`;

const Container = styled.div`
  pointer-events: none;
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  //bottom: 50%;
  bottom: 2.5rem;
  right: 2.5rem;
  z-index: 100;
  gap: 2rem;
`;
