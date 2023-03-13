import { SingSetup, Song, SongPreview } from 'interfaces';
import posthog from 'posthog-js';
import { SelectedPlayerInput } from 'Scenes/Game/Singing/Input/InputManager';
import { SongStats } from 'Songs/stats/common';
import { keyStrokes } from 'RemoteMic/Network/events';
import { HelpEntry } from 'Scenes/KeyboardHelp/Context';

export class GameStateEvent<T extends (...args: any[]) => void> {
    protected subscribers: Array<T> = [];

    public subscribe = (callback: T) => {
        this.unsubscribe(callback);
        this.subscribers.push(callback);
    };

    public unsubscribe = (callback: T) => {
        this.subscribers = this.subscribers.filter((cb) => cb !== callback);
    };

    public dispatch = (...args: Parameters<T>) => {
        console.log('dispatch', this.name, ...args);
        this.subscribers.forEach((callback) => callback(...args));

        if (this.track) {
            posthog.capture(this.name, this.track instanceof Function ? this.track(...args) : args);
        }
    };

    public constructor(private name: string, private track: boolean | ((...args: Parameters<T>) => any) = false) {}
}

export const events = {
    sectionChange: new GameStateEvent<(player: number, previousSectionIndex: number) => void>('sectionChange'),
    // newPlayerNote: new GameStateEvent<(player: number, playerNote: PlayerNote) => void>('//', true),
    // playerNoteUpdate: new GameStateEvent<(player: number, playerNote: PlayerNote) => void>('//', true),

    songStarted: new GameStateEvent<(song: Song | SongPreview, singSetup: SingSetup) => void>('songStarted', false),
    songEnded: new GameStateEvent<
        (song: Song | SongPreview, singSetup: SingSetup, scores: Array<{ name: string; score: number }>) => void
    >('songEnded', false),

    phoneConnected: new GameStateEvent<(phone: { id: string; name: string; silent: boolean }) => void>(
        'phoneConnected',
    ),
    phoneDisconnected: new GameStateEvent<(phone: { id: string; name: string }, silent: boolean) => void>(
        'phoneDisconnected',
    ),
    playerInputChanged: new GameStateEvent<
        (playerNumber: number, oldInput: SelectedPlayerInput | undefined, newInput: SelectedPlayerInput) => void
    >('playerInputChanged', (player, oldI, newI) => ({ player, old: oldI?.inputSource, new: newI.inputSource })),
    inputListChanged: new GameStateEvent<() => void>('inputListChanged'),

    karaokeConnectionStatusChange: new GameStateEvent<
        (status: 'connecting' | 'connected' | 'disconnected' | 'reconnecting' | 'error') => void
    >('karaokeConnectionStatusChange'),
    remoteMicPlayerNumberSet: new GameStateEvent<(playerNumber: number | null) => void>('remoteMicPlayerNumberSet'),
    remoteMicMonitoringStarted: new GameStateEvent('remoteMicMonitoringStarted'),
    remoteMicMonitoringStopped: new GameStateEvent('remoteMicMonitoringStopped'),

    micMonitoringStarted: new GameStateEvent('micMonitoringStarted'),
    micMonitoringStopped: new GameStateEvent('micMonitoringStopped'),
    playerChangeRequested: new GameStateEvent<(phoneId: string, newPlayerNumber: number | null) => void>(
        'playerChangeRequested',
        true,
    ),

    songStatStored: new GameStateEvent<(key: string, stats: SongStats) => void>('songStatStored'),
    songScoreUpdated: new GameStateEvent<(key: string, stats: SongStats, newName: string) => void>(
        'songScoreUpdated',
        () => undefined,
    ),

    remoteKeyboardPressed: new GameStateEvent<(key: keyStrokes) => void>('remoteKeyboardPressed', true),
    remoteKeyboardLayout: new GameStateEvent<(help: HelpEntry | undefined) => void>('remoteKeyboardLayout'),
    remoteReadinessRequested: new GameStateEvent('remoteReadinessRequested'),
    readinessConfirmed: new GameStateEvent<(deviceId: string) => void>('remoteReadinessConfirmed'),
};

export default events;
