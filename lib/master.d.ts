declare const EventEmitter: any;
declare class EasyNodeMaster extends EventEmitter {
    readonly masterPid: number;
    agentPid: number;
    constructor();
    start(): void;
    startAgent(): void;
    forkWorkers(): void;
}
export default EasyNodeMaster;
