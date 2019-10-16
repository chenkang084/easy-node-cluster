import { logger } from './utils/logger';
import { fork, isMaster, isWorker } from 'cluster';

// do some shedule jobs

// do some tasks that only run in one process

logger.info(`start agent, processId:${process.pid}`);

process.send('start agent done.');
