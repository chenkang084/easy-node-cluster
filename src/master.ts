import { fork, execFileSync, spawn } from 'child_process';
import { join } from 'path';
import { openSync } from 'fs';
import { initProcessInfoFile, writeProcessInfo } from './utils/persistProcess';
import { logger } from './utils/logger';
import EventEmitter from 'events';

const out = openSync('./out1.log', 'a');
const err = openSync('./out2.log', 'a');

const WORKER_PATH = `./worker.js`;

export interface ClusterOptions {
  name?: string;
  script: string;
  instances: number;
  node_args?: string;
}

class EasyNodeMaster extends EventEmitter {
  private clusterOptions: ClusterOptions;

  constructor(config?: ClusterOptions) {
    super();

    this.clusterOptions = config;
    console.log(`==========procesId:${process.pid}`, config);
  }

  start() {
    this.startAgent();
  }

  startAgent() {
    const agent = spawn(
      'node',
      [join(__dirname, './agent.js'), '--title=easy-node-cluster', 'agent'],
      {
        stdio: ['ignore', process.stdout, process.stderr, 'ipc']
      }
    );

    agent.on('message', msg => {
      logger.info(`received agent msg:${msg}`);

      this.forkWorkers();

      agent.unref();
      agent.disconnect();

      agent.on('exit', (msg: string) => {
        console.log(`agent:exit`);
      });
    });
  }

  forkWorkers() {
    logger.info('------start app process to fork worker------');

    const appProcess = spawn(
      'node',
      [join(__dirname, './worker.js'), '--title=easy-node-cluster', 'master'],
      {
        detached: true,
        stdio: ['ignore', out, err, 'ipc']
      }
    );

    logger.info(`start daemon process, daemon pid:${appProcess.pid}`);

    // writeProcessInfo(`agentPid: ${(this.agentPid = appProcess.pid)},`);

    appProcess.on('message', (msg: string) => {
      logger.info(`master:worker received msg:${msg}`);

      appProcess.unref();
      appProcess.disconnect();
    });

    appProcess.on('exit', (msg: string) => {
      logger.info(`appProcess:exit`);
    });
  }
}

export default EasyNodeMaster;
