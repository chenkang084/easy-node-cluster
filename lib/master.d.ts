/// <reference types="node" />
import EventEmitter from 'events';
declare class EasyNodeMaster extends EventEmitter {
    constructor();
    start(): void;
    startAgent(): void;
    forkWorkers(): void;
}
export default EasyNodeMaster;
