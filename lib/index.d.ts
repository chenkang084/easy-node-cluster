declare const EventEmitter: any;
declare class EasyNodeCluster extends EventEmitter {
    readonly masterPid: number;
    agentPid: number;
    constructor();
    start(): void;
    forkWorkers(): void;
}
export default EasyNodeCluster;
