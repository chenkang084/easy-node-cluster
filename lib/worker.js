"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cluster_1 = __importDefault(require("cluster"));
var logger_1 = require("./utils/logger");
var path_1 = require("path");
var action_1 = require("./utils/action");
var _a = JSON.parse(process.argv[4]), script = _a.script, node_args = _a.node_args, instances = _a.instances;
var appPath = path_1.join(process.cwd(), script);
// set the fork process as worker
process.argv[3] = 'worker';
var cpuNums = instances || 2;
var restartLimitation = 10;
var restartCnt = 0;
var workerMap = new Map();
if (cluster_1.default.isMaster) {
    logger_1.logger.info("==========start deamon process" + process.pid + "======");
    process.send("**********" + process.pid + " **********");
    for (var i = 0; i < cpuNums; i++) {
        var env = {
            NODE_OPTIONS: node_args,
            NODE_APP_INSTANCE: i
        };
        var worker = cluster_1.default.fork(env);
        workerMap.set(worker.process.pid, env);
        logger_1.logger.info("==========fork process,processId:" + worker.process.pid + "======");
        worker.on('message', function (msg) {
            logger_1.logger.info("deamon process recevied the msg from worker(proces=" + process.pid + ")msg:" + msg);
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
            var env = workerMap.get(worker.process.pid);
            var newWorker = cluster_1.default.fork(env);
            workerMap.set(newWorker.process.pid, env);
            workerMap.delete(worker.process.pid);
        }
        else {
            logger_1.logger.error('Exceeding system limitation');
            console.log("kill :" + process.pid);
            action_1.stop(process.pid);
        }
    });
}
else {
    logger_1.logger.info("process:" + process.pid + " start app");
    // run app
    require(appPath);
    process.send(process.pid + ":done");
}
