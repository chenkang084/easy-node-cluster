var cluster = require("cluster");

if (cluster.isMaster) {
  console.log("master", process.pid);

  const worker = cluster.fork();

  setInterval(() => {
    console.log("hello");
  }, 4000);

  cluster.on("exit", function(worker, code, signal) {
    console.log(
      "Worker " +
        worker.process.pid +
        " died with code: " +
        code +
        ", and signal: " +
        signal
    );
    console.log("Starting a new worker");
    cluster.fork();
  });
} else {
  console.log("fork:", process.pid);

  process.once("SIGINT", function() {
    console.log("1");
  });
  // kill(3) Ctrl-\
  process.once("SIGQUIT", function() {
    console.log("1");
  });
  // kill(15) default
  process.once("SIGTERM", function() {
    console.log("1");
  });

  process.once("exit", function() {
    console.log("1");
  });
}
