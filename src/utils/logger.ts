import Logger from 'easy-node-logger/lib';
import { join } from 'path';
import { readFileSync, existsSync } from 'fs';
import { ClusterOptions } from '../master';
const configPath = join(process.cwd(), './easy-node-cluster.json');
let config: ClusterOptions = null;
if (existsSync(configPath)) {
  config = JSON.parse(readFileSync(configPath).toString());
}

const logger = new Logger({
  projectName: 'easy-node-cluster',
  momentFormat: 'YYYY-MM-DD HH:mm:ss',
  logFilePath: (config.logs && config.logs.normal) || 'runtime.log',
  environment: 'node',
  level: (config.logs && config.logs.level) || 'info'
});
export { logger };
