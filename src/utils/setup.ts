import { writeFileSync, existsSync, unlinkSync } from 'fs';
import { join } from 'path';
const chalk = require('chalk');

const templateJson = {
  name: 'easy-node-cluster',
  script: '',
  instances: 2,
  node_args: '--max_old_space_size=2048'
};

const jsonPath = join(process.cwd(), './easy-node-cluster.json');

export const init = () => {
  if (existsSync(jsonPath)) {
    unlinkSync(jsonPath);
  }
  writeFileSync(jsonPath, JSON.stringify(templateJson, null, 4));
  console.log(chalk.green('generate easy-node-cluster.json'));
};
