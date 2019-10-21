import { fork, execFileSync, spawn } from 'child_process';
import { join } from 'path';
import { openSync, unlinkSync, existsSync } from 'fs';
import { initProcessInfoFile, writeProcessInfo } from './utils/persistProcess';
const EventEmitter = require('events');

const out = openSync('./out1.log', 'a');
const err = openSync('./out2.log', 'a');

const WORKER_PATH = `./worker.js`;

interface clusterOptions {}

class EasyNodeMaster extends EventEmitter {
  constructor() {
    super();
    console.log(`start master process:${process.pid}`);

    // initProcessInfoFile((this.masterPid = process.pid));
  }

  start() {
    this.startAgent();
  }

  startAgent() {
    const agent = spawn(
      'node',
      [join(__dirname, './agent.js'), '--title=easy-node-cluster'],
      {
        stdio: ['ignore', process.stdout, process.stderr, 'ipc']
      }
    );

    agent.on('message', msg => {
      console.log(`received agent msg:${msg}`);

      this.forkWorkers();

      agent.unref();
      agent.disconnect();

      agent.on('exit', (msg: string) => {
        console.log(`agent:exit`);
      });
    });
  }

  forkWorkers() {
    console.log('------start app process to fork worker------');

    const appProcess = spawn(
      'node',
      [
        join(__dirname, './worker.js'),
        join(__dirname, '../test/app.js'),
        '--title=easy-node-cluster'
      ],
      {
        detached: true,
        stdio: ['ignore', out, err, 'ipc']
      }
    );

    console.log(
      '守护进程开启 父进程 pid: %s, 守护进程 pid: %s',
      process.pid,
      appProcess.pid
    );

    // writeProcessInfo(`agentPid: ${(this.agentPid = appProcess.pid)},`);

    appProcess.on('message', (msg: string) => {
      console.log(`master:worker received msg:${msg}`);

      appProcess.unref();
      appProcess.disconnect();
    });

    appProcess.on('exit', (msg: string) => {
      console.log(`appProcess:exit`);
    });
  }
}

export default EasyNodeMaster;
