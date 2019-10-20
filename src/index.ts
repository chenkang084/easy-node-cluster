import { fork, execFileSync, spawn } from 'child_process';
import { join } from 'path';
import { writeFileSync, unlinkSync, existsSync } from 'fs';
import { initProcessInfoFile, writeProcessInfo } from './utils/persistProcess';
const cluster = require('cluster');
const EventEmitter = require('events');

const WORKER_PATH = `./worker.js`;

interface clusterOptions {}

class EasyNodeCluster extends EventEmitter {
  readonly masterPid: number;
  agentPid: number;

  constructor() {
    super();
    console.log(`start master process:${process.pid}`);

    initProcessInfoFile((this.masterPid = process.pid));
  }

  start() {
    this.forkWorkers();
  }

  forkWorkers() {
    console.log('------start app process to fork worker------');

    // const appProcess = fork(join(__dirname, WORKER_PATH), ['../test/app.js'], {
    //   detached: true
    // });

    const appProcess = spawn('node', [join(__dirname, '../test/app.js')], {
      detached: true
      // stdio: ['ignore', 'ipc']
    });

    writeProcessInfo(`agentPid: ${(this.agentPid = appProcess.pid)},`);

    appProcess.on('message', (msg: string) => {
      console.log(`master:worker received msg:${msg}`);
    });

    appProcess.on('exit', (msg: string) => {
      console.log(`exit`);
    });
  }
}

export default EasyNodeCluster;
