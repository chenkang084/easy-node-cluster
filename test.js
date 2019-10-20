var { spawn } = require('child_process');

// function start() {
//   const worker = spawn('node', ['./test/app.js'], {
//     detached: true,
//     stdio: 'ignore'
//     //   stdio: 'ignore'
//   });

//   worker.unref();
// }

// start();

const worker = spawn('node', ['./test/app.js'], {
  detached: true,
  stdio: 'ignore'
  //   stdio: 'ignore'
});

worker.unref();
