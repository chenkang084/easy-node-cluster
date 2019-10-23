import { fork, execFileSync, spawn } from 'child_process';
import { join } from 'path';
import { openSync } from 'fs';
import { initProcessInfoFile, writeProcessInfo } from './utils/persistProcess';
import { logger } from './utils/logger';
import EventEmitter from 'events';

const WORKER_PATH = `./worker.js`;

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

class EasyNodeMaster extends EventEmitter {
  private clusterOptions: ClusterOptions;
  private readonly normal: number;
  private readonly error: number;

  constructor(config?: ClusterOptions) {
    super();

    this.clusterOptions = Object.assign(
      {
        logs: {
          normal: './runtime.log',
          error: './error.log'
        }
      },
      config
    );

    this.normal = openSync(
      join(process.cwd(), this.clusterOptions.logs.normal),
      'a'
    );
    this.error = openSync(
      join(process.cwd(), this.clusterOptions.logs.error),
      'a'
    );
  }

  start() {
    this.startAgent();
  }

  startAgent() {
    const agent = spawn(
      'node',
      [
        join(__dirname, './agent.js'),
        '--title=easy-node-cluster',
        'agent',
        JSON.stringify(this.clusterOptions)
      ],
      {
        stdio: ['ignore', this.normal, this.error, 'ipc']
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
      [
        join(__dirname, './worker.js'),
        '--title=easy-node-cluster',
        'master',
        JSON.stringify(this.clusterOptions)
      ],
      {
        detached: true,
        stdio: ['ignore', this.normal, this.error, 'ipc']
      }
    );

    logger.info(`start daemon process, daemon pid:${appProcess.pid}`);

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
