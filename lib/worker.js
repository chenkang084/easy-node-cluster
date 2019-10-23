"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cluster_1 = __importDefault(require("cluster"));
var logger_1 = require("./utils/logger");
var path_1 = require("path");
var action_1 = require("./utils/action");
var appPath = path_1.join(__dirname, '../tests/app.js');
// const appPath = ;
logger_1.logger.info('XXX', process.argv[2], process.argv);
// master the process as worker
process.argv[4] = 'worker';
/**
 * run app in one process
 */
// const cpuNums = cpus().length;
var cpuNums = 1;
var restartLimitation = 10;
var restartCnt = 0;
if (cluster_1.default.isMaster) {
    logger_1.logger.info('==========start master process======');
    process.send("**********" + process.pid + " **********");
    for (var i = 0; i < cpuNums; i++) {
        var worker = cluster_1.default.fork({
            NODE_OPTIONS: '--max-old-space-size=2000'
        });
        // worker.process.argv[3] = 'worker';
        logger_1.logger.info("==========fork process,processId:" + worker.process.pid + "======");
        worker.on('message', function (msg) {
            logger_1.logger.info("recevied worker msg in master proces=" + process.pid + ":" + msg);
        });
    }
    cluster_1.default.on('exit', function (worker, code, signal) {
        logger_1.logger.info('Worker ' +
            worker.process.pid +
            ' died with code: ' +
            code +
            ', and signal: ' +
            signal);
        logger_1.logger.info('Starting a new worker');
        // set restart limitation
        if (restartCnt <= restartLimitation) {
            restartCnt++;
            cluster_1.default.fork({
                NODE_OPTIONS: '--max-old-space-size=2000'
            });
        }
        else {
            logger_1.logger.error('Exceeding system limitation');
            console.log("kill :" + process.pid);
            action_1.stop(process.pid);
        }
    });
}
else {
    // process.argv[3] = 'worker';
    logger_1.logger.info("process:" + process.pid + " start app");
    // run app
    require(appPath);
    process.send(process.pid + ":done");
}
