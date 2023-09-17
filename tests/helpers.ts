import { BrowserContext, Page } from '@playwright/test';
import { readFileSync, readdirSync } from 'fs';
import { getSongPreview } from '../src/Songs/utils';
import convertSongToTxt from '../src/Songs/utils/convertSongToTxt';

const songs = readdirSync('./tests/fixtures/songs/')
  .filter((file) => file.endsWith('.json'))
  .map((file) => ({
    song: JSON.parse(readFileSync(`./tests/fixtures/songs/${file}`, { encoding: 'utf-8' })),
  }));

export const mockSongs = async ({ page }: { page: Page; context: BrowserContext }) => {
  const index = songs.map(({ song }) => getSongPreview(song));
  await page.route('/songs/index.json', (route) => route.fulfill({ status: 200, body: JSON.stringify(index) }));

  for (const song of songs) {
    await page.route(`/songs/${song.song.id}.txt`, (route) =>
      route.fulfill({ status: 200, body: convertSongToTxt(song.song) }),
    );
  }
};

export const initTestMode = async ({ context }: { page: Page; context: BrowserContext }, randomValue = 0.5) => {
  await context.addInitScript((randomValue) => {
    window.Math.random = () => randomValue;

    window.isE2ETests = true;
  }, randomValue);
};

interface SimDevice {
  id: string;
  label: string;
  channels?: number;
}
export const stubUserMedia = async ({ context, page }: { page: Page; context: BrowserContext }) => {
  await context.addInitScript(() => {
    let mediaDevices: SimDevice[] = [
      {
        id: 'default',
        label: 'Default device',
      },
    ];

    const getMediaDevices = () => {
      const data = mediaDevices.map((device) => ({
        deviceId: device.id,
        groupId: device.id,
        kind: 'audioinput',
        label: device.label,
        getCapabilities: () => ({
          channelCount: {
            max: device.channels ?? 1,
          },
        }),
      }));

      console.log(data);
      return data;
    };

    console.log(AudioBuffer);

    const callbacks: Record<string, Array<() => void>> = {
      devicechange: [],
    };
    Object.defineProperty(window.navigator, 'mediaDevices', {
      value: {
        getUserMedia: () => Promise.resolve({}),
        enumerateDevices: () => Promise.resolve(getMediaDevices()),
        addEventListener: (e: 'devicechange', callback: () => void) => callbacks[e].push(callback),
        removeEventListener: (e: 'devicechange', callback: () => void) =>
          (callbacks[e] = callbacks[e].filter((cb) => cb !== callback)),
      },
    });

    Object.defineProperty(window, 'mediaSimulator', {
      value: {
        connectMediaDevices: (...devices: SimDevice[]) => {
          mediaDevices.push(...devices);
          callbacks.devicechange.forEach((cb) => cb());
        },
        disconnectMediaDevices: (...devices: SimDevice[]) => {
          mediaDevices = mediaDevices.filter((device) => !devices.some((removed) => removed.id === device.id));

          callbacks.devicechange.forEach((cb) => cb());
        },
      },
    });
  });

  return {
    connectDevices: (...deviceList: SimDevice[]) =>
      page.evaluate(
        ([devices]) => {
          // @ts-expect-error
          window.mediaSimulator.connectMediaDevices(...devices);
        },
        [deviceList],
      ),
    disconnectDevices: (...deviceList: SimDevice[]) =>
      page.evaluate(
        ([devices]) => {
          // @ts-expect-error
          window.mediaSimulator.disconnectMediaDevices(...devices);
        },
        [deviceList],
      ),
  };
};
