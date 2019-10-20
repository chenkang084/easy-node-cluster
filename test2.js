const { fork, execFileSync, spawn } = require('child_process');
const { join } = require('path');

var fs = require('fs'),
  out = fs.openSync('./out1.log', 'a'),
  err = fs.openSync('./out2.log', 'a');

// console.log(join(__dirname, './test/app.js'));

// spawn('node', [join(__dirname, './test.js')], {
//   detached: true,
//   stdio: ['ignore', out, err]
// });

spawn(
  'node',
  [
    '/Users/kangchen/workspaces/node/easy-node-cluster/node_modules/forever/bin/monitor',
    './test/app.js'
  ],
  {
    detached: true,
    stdio: ['ignore', out, err]
  }
);

// stdio: ['ipc', 44, 45],
//     detached: true
