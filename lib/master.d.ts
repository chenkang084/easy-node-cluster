/// <reference types="node" />
import EventEmitter from 'events';
export interface ClusterOptions {
    name?: string;
    script: string;
    instances: number;
    node_args?: string;
}
declare class EasyNodeMaster extends EventEmitter {
    private clusterOptions;
    constructor(config?: ClusterOptions);
    start(): void;
    startAgent(): void;
    forkWorkers(): void;
}
export default EasyNodeMaster;
