import { cpus } from 'os';
const cluster = require('cluster');
import { logger } from './utils/logger';
import { writeProcessInfo } from './utils/persistProcess';

const appPath = process.argv[2];
console.log(appPath, '======');

/**
 * run app in one process
 */

// const cpuNums = cpus().length;
const cpuNums = 2;

if (cluster.isMaster) {
  process.send(`**********${process.pid} **********`);

  for (let i = 0; i < cpuNums; i++) {
    const worker = cluster.fork();

    worker.on('message', (msg: string) => {
      console.log(`recevied worker msg in master proces=${process.pid}:${msg}`);
    });
  }

  cluster.on('exit', function(worker: any, code: any, signal: any) {
    console.log(
      'Worker ' +
        worker.process.pid +
        ' died with code: ' +
        code +
        ', and signal: ' +
        signal
    );
    console.log('Starting a new worker');
    cluster.fork();
  });
} else {
  console.log(`process:${process.pid} start app`);
  // run app
  require(appPath);

  process.send(`${process.pid}:done`);
}
