"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cluster = require('cluster');
var persistProcess_1 = require("./utils/persistProcess");
var appPath = process.argv[2];
// console.log(appPath, '======');
/**
 * run app in one process
 */
// const cpuNums = cpus().length;
var cpuNums = 2;
if (cluster.isMaster) {
    process.send("**********" + process.pid + " **********");
    for (var i = 0; i < cpuNums; i++) {
        var worker = cluster.fork();
        worker.on('message', function (msg) {
            console.log("recevied worker msg in master proces=" + process.pid + ":" + msg);
        });
    }
    cluster.on('exit', function (worker, code, signal) {
        console.log('Worker ' +
            worker.process.pid +
            ' died with code: ' +
            code +
            ', and signal: ' +
            signal);
        console.log('Starting a new worker');
        cluster.fork();
    });
}
else {
    console.log("process:" + process.pid + " start app");
    // run app
    require(appPath);
    process.send(process.pid + ":done");
    setTimeout(function () {
        var _a;
        persistProcess_1.writeProcessInfo((_a = {}, _a["worker_" + process.pid] = process.pid, _a));
    }, 100);
}
