import { ClusterOptions } from '../master';
export declare function getProcessList(): Promise<any>;
export declare function start(config?: ClusterOptions): void;
export declare function restart(config?: ClusterOptions): void;
export declare function stop(currentPid?: number): any;
export declare function reload(config?: ClusterOptions): void;
