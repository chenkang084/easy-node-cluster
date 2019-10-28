/// <reference types="node" />
import { logMethodLevel } from 'easy-node-logger';
import EventEmitter from 'events';
declare class ClusterOptionDefault {
    name: string;
    instances: number;
    logs: {
        normal: string;
        error: string;
        level: logMethodLevel;
    };
}
export interface ClusterOptions extends ClusterOptionDefault {
    script: string;
    node_args?: string;
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
