const spawn = require('child_process').spawn;
var fs = require('fs'),
  out = fs.openSync('./out1.log', 'a'),
  err = fs.openSync('./out2.log', 'a');

function startDaemon() {
  //   const daemon = spawn('node', ['daemon.js'], {
  //     // cwd: '/usr',
  //     detached: true,
  //     stdio: 'ignore'
  //   });

  const daemon = spawn('node', ['./test/app.js', '--title=easy-node-cluster'], {
    // cwd: '/usr',
    detached: true,
    stdio: ['ignore', out, err, 'ipc']
  });

  console.log(
    '守护进程开启 父进程 pid: %s, 守护进程 pid: %s',
    process.pid,
    daemon.pid
  );

  daemon.on('message', msg => {
    console.log(msg, '==========');
    daemon.unref();
    daemon.disconnect();

    // process.exit();
  });
}

startDaemon();
