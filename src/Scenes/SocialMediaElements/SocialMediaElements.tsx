import styled from '@emotion/styled';
import { useBackground } from 'Elements/LayoutWithBackground';
import Logo from 'Elements/Logo';
import { colorSets } from 'Scenes/Game/Singing/GameOverlay/Drawing/styles';
import logo from '../../../public/logo.svg?raw';

export default function SocialMediaElements() {
  useBackground(false);

  return (
    <>
      <IconLogo dangerouslySetInnerHTML={{ __html: logo }} />
      <BackgroundPhoto>
        <Logo />
        <ChristmasTree>🎁</ChristmasTree>
      </BackgroundPhoto>
    </>
  );
}

const IconLogo = styled.svg`
  width: 400px;
  aspect-ratio: 1/1;
  object-fit: contain;
  background: #222222;
  padding: 30px;

  path:nth-of-type(1) {
    fill: ${colorSets.christmasRed.stroke} !important;
  }
  path:nth-of-type(2) {
    fill: ${colorSets.christmasGreen.text} !important;
  }
`;

const BackgroundPhoto = styled.div`
  position: relative;
  height: 693px;
  width: 2048px;

  background-color: black;
  background-image: linear-gradient(
    120deg,
    ${colorSets.christmasRed.stroke},
    ${colorSets.christmasRed.hit.fill} 49.9%,
    ${colorSets.christmasGreen.hit.fill} 50.1%,
    ${colorSets.christmasGreen.stroke}
  );
  display: flex;
  align-items: center;
  justify-content: center;
  div {
    margin-bottom: 160px;

    img:nth-of-type(1) {
      width: 800px;
      height: 300px;
      object-fit: contain;
    }

    img:nth-of-type(2) {
      transform: translate(-0px, 80px);
      width: 180px;
      height: 80px;
      object-fit: contain;
    }
  }
`;

const ChristmasTree = styled.span`
  //position: absolute;
  //margin: 0 0 100px 100px;
  font-size: 180px;
  transform: rotate(15deg);
`;
