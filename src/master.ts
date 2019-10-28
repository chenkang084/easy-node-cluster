import { spawn } from 'child_process';
import { join } from 'path';
import { openSync } from 'fs';
import { logMethodLevel } from 'easy-node-logger';
import { logger } from './utils/logger';
import EventEmitter from 'events';

class ClusterOptionDefault {
  name = 'easy-node-cluster';
  instances = 2;
  logs = {
    normal: './runtime.log',
    error: './error.log',
    level: 'error' as logMethodLevel
  };
}

export interface ClusterOptions extends ClusterOptionDefault {
  script: string;
  node_args?: string;
}

class EasyNodeMaster extends EventEmitter {
  private clusterOptions: ClusterOptions;
  private readonly normal: number;
  private readonly error: number;

  constructor(config?: ClusterOptions) {
    super();

    this.clusterOptions = Object.assign(new ClusterOptionDefault(), config);

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
        stdio: ['ignore', 'ignore', this.error, 'ipc']
      }
    );

    agent.on('message', msg => {
      logger.info(`received agent msg:${msg}`);

      this.forkWorkers();

      agent.unref();
      agent.disconnect();

      agent.on('exit', (msg: string) => {
        logger.info(`agent:exit`, msg);
      });
    });
  }

  forkWorkers() {
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
        stdio: ['ignore', 'ignore', this.error, 'ipc']
      }
    );

    logger.info(`start daemon process, daemon pid:${appProcess.pid}`);

    appProcess.on('message', (msg: string) => {
      logger.info(`master received msg from deamon process:${msg}`);

      appProcess.unref();
      appProcess.disconnect();
    });

    appProcess.on('exit', (msg: string) => {
      logger.info(`daemon process:exit`);
    });
  }
}

export default EasyNodeMaster;
