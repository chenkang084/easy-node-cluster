import Logger from 'easy-node-logger/lib';
const logger = new Logger({
  projectName: 'easy-node-logger',
  momentFormat: 'YYYY-MM-DD HH:mm:ss',
  logFilePath: 'mercury-oncall.log',
  environment: 'node',
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info'
});
export { logger };
