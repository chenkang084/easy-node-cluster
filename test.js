const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const configPath = path.join(process.cwd(), './easy-node-cluster.json');
let config = null;

if (fs.existsSync(configPath)) {
  config = JSON.parse(fs.readFileSync(configPath));
}

const { start } = require('./lib/utils/action');

start(config);
