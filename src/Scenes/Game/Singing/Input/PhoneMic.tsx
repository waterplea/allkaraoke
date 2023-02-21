import events from 'Scenes/Game/Singing/GameState/GameStateEvents';
import AubioStrategy from 'Scenes/Game/Singing/Input/MicStrategies/Aubio';
import InputInterface from './Interface';
import userMediaService from 'UserMedia/userMediaService';
import Listener from 'utils/Listener';

class PhoneMic extends Listener<[number, number]> implements InputInterface {
    private stream: MediaStream | null = null;
    private context: AudioContext | null = null;

    private interval: ReturnType<typeof setInterval> | null = null;

    private frequencies: [number, number] = [0, 0];
    private volumes: [number, number] = [0, 0];

    private startedMonitoring = false;

    public startMonitoring = async (deviceId?: string, echoCancellation = false) => {
        if (this.startedMonitoring) return;
        this.startedMonitoring = true;

        this.stream = await userMediaService.getUserMedia({
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: false,
            },
            video: false,
        });

        this.context = new AudioContext();

        const source = this.context.createMediaStreamSource(this.stream);

        const analyserCh0 = this.context.createAnalyser();
        analyserCh0.fftSize = 2048;
        analyserCh0.minDecibels = -100;
        source.connect(analyserCh0);

        const strategy = new AubioStrategy();
        await strategy.init(this.context, analyserCh0.fftSize);

        this.interval = setInterval(async () => {
            const dataCh0 = new Float32Array(analyserCh0.fftSize);

            analyserCh0.getFloatTimeDomainData(dataCh0);
            const freq = await strategy.getFrequency(dataCh0);
            const volume = this.calculateVolume(dataCh0);

            this.frequencies = [freq, freq];

            this.volumes = [volume, volume];

            this.onUpdate(freq, volume);
        }, this.context.sampleRate / analyserCh0.fftSize);

        events.micMonitoringStarted.dispatch();
    };

    public getFrequencies = () => {
        return this.frequencies;
    };
    public getVolumes = () => this.volumes;

    public stopMonitoring = async () => {
        if (!this.startedMonitoring) return;
        this.startedMonitoring = false;
        this.interval && clearInterval(this.interval);
        this.stream?.getTracks().forEach(function (track) {
            track.stop();
        });
        try {
            await this.context?.close();
        } catch (e) {
            console.log('MicInput.stoMonitoring error', e);
        }

        events.micMonitoringStopped.dispatch();
    };

    public getInputLag = () => 180;
    public getChannelsCount = () => 2;

    private calculateVolume(input: Float32Array) {
        let i;
        let sum = 0.0;
        for (i = 0; i < input.length; ++i) {
            sum += input[i] * input[i];
        }
        return Math.sqrt(sum / input.length);
    }
    public requestReadiness = () => Promise.resolve(true);
}

export default new PhoneMic();
