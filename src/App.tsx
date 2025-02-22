import { ErrorBoundary } from '@sentry/react';
import { KeyboardHelpProvider } from 'Scenes/KeyboardHelp/Context';
import RemoteMic from 'Scenes/RemoteMic/RemoteMic';
import Settings from 'Scenes/Settings/Settings';
import { Redirect, Route, Router, useLocation } from 'wouter';
import Convert from './Scenes/Convert/Convert';
import Edit from './Scenes/Edit/Edit';
import Jukebox from './Scenes/Jukebox/Jukebox';
import SelectInput from './Scenes/SelectInput/SelectInput';

import { Global, css } from '@emotion/react';
import { Theme, ThemeProvider, createTheme } from '@mui/material';
import { ErrorFallback } from 'Elements/ErrorFallback';
import { GameScreens } from 'Elements/GameScreens';
import LayoutWithBackgroundProvider from 'Elements/LayoutWithBackground';
import Loader from 'Elements/Loader';
import GetSongsBPMs from 'Scenes/Edit/GetSongsBPMs';
import ExcludeLanguages from 'Scenes/ExcludeLanguages/ExcludeLanguages';
import LandingPage from 'Scenes/LandingPage/LandingPage';
import ManageSongs from 'Scenes/ManageSongs/ManageSongs';
import QuickSetup from 'Scenes/QuickSetup/QuickSetup';
import RemoteMicSettings from 'Scenes/Settings/RemoteMicSettings';
import {
  GraphicSetting,
  MicSetupPreferenceSetting,
  MobilePhoneModeSetting,
  useSettingValue,
} from 'Scenes/Settings/SettingsState';
import SocialMediaElements from 'Scenes/SocialMediaElements/SocialMediaElements';
import Welcome from 'Scenes/Welcome/Welcome';
import Toolbar from 'Toolbar/Toolbar';
import { Suspense, lazy, useEffect, useMemo } from 'react';

const LazySongList = lazy(() => import('./Scenes/Edit/SongList'));

// This is a hack to preload the game scene so that it's ready when the user clicks on the game button
// without increasing initial load time. Vite doesn't support prefetch yet
// https://github.com/vitejs/vite/issues/10600
const prefetchGame = import('./Scenes/Game/Game');
const LazyGame = lazy(() => prefetchGame);

function App() {
  const [mobilePhoneMode] = useSettingValue(MobilePhoneModeSetting);
  const [graphicSetting] = useSettingValue(GraphicSetting);
  const [setupPreference] = useSettingValue(MicSetupPreferenceSetting);
  const [location, navigate] = useLocation();

  const theme = useMemo<Theme>(
    () =>
      createTheme({
        graphicSetting,
      }),
    [graphicSetting],
  );

  useEffect(() => {
    if (setupPreference === null && location === '/') {
      navigate('landing');
    } else if (setupPreference !== null && location === '/quick-setup') {
      navigate('');
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Global
        styles={css`
          :root {
            --zoom-multipler: ${mobilePhoneMode ? 1.4 : 1};
          }
        `}
      />
      <ErrorBoundary fallback={ErrorFallback}>
        <LayoutWithBackgroundProvider>
          <KeyboardHelpProvider>
            <Router base={import.meta.env.BASE_URL}>
              <GameScreens>
                <Toolbar />
                <Route path="game/:songId?">
                  {({ songId }) => (
                    <Suspense fallback={<Loader />}>
                      <LazyGame songId={songId ? decodeURIComponent(songId) : undefined} />
                    </Suspense>
                  )}
                </Route>
                <Route path="jukebox" component={Jukebox} />
                <Route path="remote-mic/:roomId?">{({ roomId }) => <RemoteMic roomId={roomId} />}</Route>
                <Route path="phone/:roomId">{({ roomId }) => <Redirect to={`remote-mic/${roomId}`} />}</Route>
                <Route path="quick-setup" component={QuickSetup} />
                <Route path="select-input" component={SelectInput} />
                <Route path="settings" component={Settings} />
                <Route path="settings/remote-mics" component={RemoteMicSettings} />
                <Route path="manage-songs" component={ManageSongs} />
                <Route path="exclude-languages" component={ExcludeLanguages} />
                <Route path="" component={Welcome} />
                <Route path="landing" component={LandingPage} />
                <Route path="social-media-elements" component={SocialMediaElements} />
              </GameScreens>
              <Route path="convert" component={() => <Convert />} />
              <Route
                path="edit"
                component={() => (
                  <Suspense fallback={<Loader />}>
                    <LazySongList />
                  </Suspense>
                )}
              />
              <Route path="edit/get-songs-bpms" component={GetSongsBPMs} />
              <Route path="edit/:songId">{({ songId }) => <Edit songId={songId!} />}</Route>
            </Router>
          </KeyboardHelpProvider>
        </LayoutWithBackgroundProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
