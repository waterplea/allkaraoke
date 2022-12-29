type Callback<ARG extends Array<any>> = (...args: ARG) => void;
export default class Listener<ARG extends Array<any> = []> {
    private listeners: Callback<ARG>[] = [];
    protected onUpdate = (...args: ARG) => {
        this.listeners.forEach((callback) => callback(...args));
    };

    public addListener = (listener: Callback<ARG>) => {
        this.listeners.push(listener);

        return () => {
            this.removeListener(listener);
        };
    };

    public removeListener = (listener: Callback<ARG>) => this.listeners.filter((callback) => callback !== listener);
}
