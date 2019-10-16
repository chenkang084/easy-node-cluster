"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cluster = require('cluster');
// const app = require('../test/app.js');
/**
 * run app in one process
 */
// const cpuNums = cpus().length;
var cpuNums = 2;
if (cluster.isMaster) {
    process.send("**********" + process.pid + " **********");
    console.log("worker--master process say:" + process.pid);
    for (var i = 0; i < cpuNums; i++) {
        var worker = cluster.fork();
        worker.on('message', function (msg) {
            console.log("recevied worker msg in master proces=" + process.pid + ":" + msg);
            // if (msg === 'restart') {
            //   fork();
            // }
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
    //   worker.send('test');
}
else {
    var app = require('express')();
    app.get('/', function (req, res) {
        console.log(process.pid);
        process.exit();
        res.send('process ' + process.pid + ' says hello!').end();
    });
    var server = app.listen(8000, function () {
        console.log('Process ' + process.pid + ' is listening to all incoming requests');
    });
}
function exit(type) {
    return function () {
        console.log("******* " + type + ":exit," + process.pid + " ********");
        // process.send('restart');
    };
}
