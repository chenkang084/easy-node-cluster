/// <reference types="node" />
import EventEmitter from 'events';
export interface ClusterOptions {
    name?: string;
    script: string;
    instances: number;
    node_args?: string;
    logs: {
        normal: string;
        error: string;
    };
}
declare class EasyNodeMaster extends EventEmitter {
    private clusterOptions;
    private readonly normal;
    private readonly error;
    constructor(config?: ClusterOptions);
    start(): void;
    startAgent(): void;
    forkWorkers(): void;
}
export default EasyNodeMaster;
