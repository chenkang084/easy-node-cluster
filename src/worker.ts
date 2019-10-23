import { cpus } from 'os';
import cluster from 'cluster';
import { logger } from './utils/logger';
import { join } from 'path';
import { stop } from './utils/action';

const { script, node_args } = JSON.parse(process.argv[4]);

const appPath = join(process.cwd(), script);

// const appPath = ;
// logger.info('XXX', process.argv[4]);

// master the process as worker
process.argv[3] = 'worker';

/**
 * run app in one process
 */

// const cpuNums = cpus().length;
const cpuNums = 2;
const restartLimitation = 10;
let restartCnt = 0;

if (cluster.isMaster) {
  logger.info('==========start master process======');
  process.send(`**********${process.pid} **********`);

  for (let i = 0; i < cpuNums; i++) {
    const worker = cluster.fork({
      NODE_OPTIONS: node_args
    });

    // worker.process.argv[3] = 'worker';
    logger.info(`==========fork process,processId:${worker.process.pid}======`);
    worker.on('message', (msg: string) => {
      logger.info(`recevied worker msg in master proces=${process.pid}:${msg}`);
    });
  }

  cluster.on('exit', function(worker: any, code: any, signal: any) {
    logger.info(
      'Worker ' +
        worker.process.pid +
        ' died with code: ' +
        code +
        ', and signal: ' +
        signal
    );
    logger.info('Starting a new worker');

    // set restart limitation
    if (restartCnt <= restartLimitation) {
      restartCnt++;
      cluster.fork({
        NODE_OPTIONS: node_args
      });
    } else {
      logger.error('Exceeding system limitation');
      console.log(`kill :${process.pid}`);
      stop(process.pid);
    }
  });
} else {
  // process.argv[3] = 'worker';
  logger.info(`process:${process.pid} start app`);
  // run app
  require(appPath);

  process.send(`${process.pid}:done`);
}
