import { fork } from 'child_process';
import { join } from 'path';
const EventEmitter = require('events');

import { logger } from './utils/logger';

interface clusterOptions {}

class EasyNodeCluster extends EventEmitter {
  constructor() {
    super();
    logger.info(`initilaize master process:${process.pid}`);
  }

  start() {
    const agent = fork(join(__dirname, './agent.js'));
    agent.on('message', (msg: string) => {
      console.log(`master process say:${msg}`);

      const workers = fork(join(__dirname, './worker.js'));

      workers.on('message', (msg: string) => {
        console.log(`master process say:${msg}`);
      });
    });
  }
}

export default EasyNodeCluster;
