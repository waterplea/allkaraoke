import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { colorSets } from 'Scenes/Game/Singing/GameOverlay/Drawing/styles';
import React, { createContext, useContext, useEffect, useState } from 'react';

export const BackgroundContext = createContext({
  visible: true,
  setVisibility: (visible: boolean): void => undefined,
  setChristmas: (visible: boolean): void => undefined,
});

export const useBackground = (shouldBeVisible: boolean, christmas = false) => {
  const { setVisibility, setChristmas } = useContext(BackgroundContext);

  useEffect(() => {
    setVisibility(shouldBeVisible);
  }, [shouldBeVisible, setVisibility]);

  useEffect(() => {
    setChristmas(christmas);
  }, [christmas, setChristmas]);
};

export default function LayoutWithBackgroundProvider({ children }: React.PropsWithChildren) {
  const [visible, setVisible] = useState(true);
  const [christmas, setChristmas] = useState(true);

  return (
    <BackgroundContext.Provider value={{ visible, setVisibility: setVisible, setChristmas }}>
      {visible && <Background christmas={christmas} />}
      {children}
    </BackgroundContext.Provider>
  );
}

export const BackgroundStatic = styled.div<{ christmas?: boolean }>`
  background-color: white;
  ${(props) =>
    props.christmas
      ? css`
          background-image: linear-gradient(
            -45deg,
            ${colorSets.christmasGreen.text},
            ${colorSets.christmasGreen.stroke},
            ${colorSets.christmasRed.stroke},
            ${colorSets.christmasRed.stroke}
          );
          background-size: 400% 400%;
        `
      : css`
          background-image: linear-gradient(
            -45deg,
            ${colorSets.red.stroke},
            ${colorSets.blue.text},
            ${colorSets.blue.stroke},
            ${colorSets.red.stroke}
          );
          background-size: 400% 400%;
        `}

  width: 100%;
  height: 100%;
`;

const Background = styled(BackgroundStatic)`
  z-index: -1;
  top: 0;
  position: fixed;

  ${(props) => (props.theme.graphicSetting === 'high' ? 'animation: gradient 15s ease infinite' : '')};
  ${(props) => (props.theme.graphicSetting === 'low' ? 'background-position: 100% 50%' : '')};

  @keyframes gradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
`;
