import { cpus } from 'os';
const cluster = require('cluster');
import { logger } from './utils/logger';
// const app = require('../test/app.js');
/**
 * run app in one process
 */

// const cpuNums = cpus().length;
const cpuNums = 2;

if (cluster.isMaster) {
  process.send(`**********${process.pid} **********`);

  console.log(`worker--master process say:${process.pid}`);

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
  const app = require('express')();
  app.get('/', function(req: any, res: any) {
    console.log(process.pid);

    process.exit();

    res.send('process ' + process.pid + ' says hello!').end();
  });

  const server = app.listen(8000, function() {
    console.log(
      'Process ' + process.pid + ' is listening to all incoming requests'
    );
  });
}

function exit(type: string) {
  return function() {
    console.log(`******* ${type}:exit,${process.pid} ********`);

    // process.send('restart');
  };
}
