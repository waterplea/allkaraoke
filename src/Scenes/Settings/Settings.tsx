import CameraManager from 'Camera/CameraManager';
import Loader from 'Elements/Loader';
import { MenuButton } from 'Elements/Menu';
import MenuWithLogo from 'Elements/MenuWithLogo';
import { nextValue, Switcher } from 'Elements/Switcher';
import useBackgroundMusic from 'hooks/useBackgroundMusic';
import useKeyboardNav from 'hooks/useKeyboardNav';
import useSmoothNavigate from 'hooks/useSmoothNavigate';
import { ReactNode, useEffect, useRef, useState } from 'react';
import InputLag from 'Scenes/Settings/InputLag';
import {
  BackgroundMusic,
  BackgroundMusicSetting,
  FpsCount,
  FPSCountSetting,
  GraphicSetting,
  GraphicsLevel,
  MobilePhoneModeSetting,
  useSettingValue,
} from 'Scenes/Settings/SettingsState';

interface Props {}

function Settings(props: Props) {
  useBackgroundMusic(false);
  const navigate = useSmoothNavigate();
  const goBack = () => navigate('');

  const { register } = useKeyboardNav({ onBackspace: goBack });

  const [graphicLevel, setGraphicLevel] = useSettingValue(GraphicSetting);
  const [fpsCount, setFpsCount] = useSettingValue(FPSCountSetting);
  const [mobilePhoneMode, setMobilePhoneMode] = useSettingValue(MobilePhoneModeSetting);
  const [backgroundMusic, setBackgroundMusic] = useSettingValue(BackgroundMusicSetting);
  const inputLagRef = useRef<HTMLInputElement | null>(null);

  const [camera, setCamera] = useState<null | boolean>(CameraManager.getPermissionStatus());
  useEffect(() => {
    return CameraManager.addListener((status) => {
      setCamera(status);
    });
  }, []);

  const [isRequestInProgress, setIsRequestInProgress] = useState(false);
  const enableCamera = () => {
    setIsRequestInProgress(true);
    CameraManager.requestPermissions().then(() => setIsRequestInProgress(false));
  };

  let cameraValue: ReactNode = 'Disabled';
  if (isRequestInProgress) cameraValue = <Loader size="0.9em" />;
  else if (camera === null) cameraValue = 'Click to enable';
  else if (camera) cameraValue = 'Enabled';

  return (
    <MenuWithLogo>
      <h1>Settings</h1>
      <Switcher
        {...register('graphics-level', () => setGraphicLevel(nextValue(GraphicsLevel, graphicLevel)))}
        label="Graphics"
        value={graphicLevel.toUpperCase()}
      />
      <Switcher
        {...register('fps-count-level', () => setFpsCount(nextValue(FpsCount, fpsCount)))}
        label="FPS Count"
        value={fpsCount}
      />
      <Switcher
        {...register('background-music-selection', () =>
          setBackgroundMusic(nextValue(BackgroundMusic, backgroundMusic)),
        )}
        label="Background Music"
        value={backgroundMusic}
      />
      <InputLag ref={inputLagRef} {...register('input-lag', () => inputLagRef.current?.focus())} />
      <hr />
      <Switcher
        {...register('camera-access', () => (camera ? CameraManager.disable() : enableCamera()))}
        label="Enable camera mode"
        value={cameraValue}
        info="Record a timelapse video from singing. The recording is not sent nor stored anywhere."
      />
      <hr />
      <Switcher
        {...register('mobile-phone-mode', () => setMobilePhoneMode(!mobilePhoneMode))}
        label="Mobile Phone Mode"
        value={mobilePhoneMode ? 'Yes' : 'No'}
        info="Adjust the game to a smaller screen. Disables option to sing in duets."
      />
      <hr />
      <MenuButton {...register('remote-mics-settings', () => navigate('settings/remote-mics'))} size="small">
        Remote Microphones Settings
      </MenuButton>
      <MenuButton {...register('setup-mics-button', () => navigate('select-input'))} size="small">
        Setup Microphones
      </MenuButton>
      <MenuButton {...register('manage-songs-button', () => navigate('manage-songs'))} size="small">
        Manage Songs
      </MenuButton>
      <MenuButton {...register('back-button', goBack)}>Return To Main Menu</MenuButton>
    </MenuWithLogo>
  );
}

export default Settings;
