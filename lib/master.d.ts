declare const EventEmitter: any;
declare class EasyNodeMaster extends EventEmitter {
    constructor();
    start(): void;
    startAgent(): void;
    forkWorkers(): void;
}
export default EasyNodeMaster;
