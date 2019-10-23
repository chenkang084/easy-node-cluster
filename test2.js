const cluster = require('cluster');
const path = require('path');
const cp = require('child_process');

cp.spawn(
  'node',
  [path.join(__dirname, './tests/app.js'), JSON.stringify({ name: 'test' })],
  {
    stdio: ['ignore', process.stdout, process.stderr, 'ipc']
  }
);
