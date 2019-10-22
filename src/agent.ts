import { logger } from './utils/logger';

// do some shedule jobs

// do some tasks that only run in one process

logger.info(`start agent, processId:${process.pid}`);

// console.log(this);

process.send('start agent done.');

// keep agent process active
setInterval(() => {}, 1000 * 60 * 60 * 24);
