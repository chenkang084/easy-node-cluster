var pidusage = require('pidusage');
var usage = require('usage');

setInterval(function() {
  pidusage('45319', function(err, stats) {
    console.log(stats.memory / 1024 / 1024);
    // => {
    //   cpu: 10.0,            // percentage (from 0 to 100*vcore)
    //   memory: 357306368,    // bytes
    //   ppid: 312,            // PPID
    //   pid: 727,             // PID
    //   ctime: 867000,        // ms user + system time
    //   elapsed: 6650000,     // ms since the start of the process
    //   timestamp: 864000000  // ms since epoch
    // }
  });

  var pid = process.pid; // you can use any valid PID instead
  usage.lookup('45317', function(err, result) {
    console.log(result.memoryInfo.rss / 1024 / 1024);
  });
}, 1000);
