"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = __importDefault(require("../index"));
var logger_1 = require("./logger");
var pidusage = require('pidusage');
var runScript = require('runscript');
function getProcessList() {
    return runScript('ps -ef | grep easy-node-cluster', { stdio: 'pipe' })
        .then(function (stdio) {
        var processList = stdio.stdout
            .toString()
            .split('\n')
            .filter(function (item) { return item.includes('node') && item.includes('--title'); })
            .map(function (line) {
            var row = line.split(' ').filter(function (item) { return !!item; });
            var processId = (row && row[1]) || '';
            var type = 'worker';
            if (line.includes('master')) {
                type = 'master';
            }
            else if (line.includes('agent')) {
                type = 'agent';
            }
            return {
                type: type,
                processId: processId
            };
        });
        var usageList = processList.map(function (item) {
            return new Promise(function (resolve) {
                pidusage(item.processId, function (err, stats) {
                    resolve({
                        type: item.type,
                        processId: item.processId,
                        cpuUsage: stats.cpu.toFixed('2') + '%',
                        meoUsage: (stats.memory / 1024 / 1024).toFixed(2) + 'M'
                    });
                });
            });
        });
        return Promise.all(usageList);
    })
        .catch(function (err) {
        console.error(err);
    });
}
exports.getProcessList = getProcessList;
function start(config) {
    var easyNodeCluster = new index_1.default(config);
    easyNodeCluster.start();
}
exports.start = start;
function restart(config) {
    stop().then(function () {
        start(config);
    });
}
exports.restart = restart;
function stop(currentPid) {
    return runScript('ps -ef | grep easy-node-cluster', { stdio: 'pipe' })
        .then(function (stdio) {
        stdio.stdout
            .toString()
            .split('\n')
            .filter(function (item) { return item.includes('node') && item.includes('--title'); })
            .map(function (line) {
            return line.split(' ').filter(function (item) { return !!item; })[1];
        })
            .forEach(function (processId) {
            console.log("kill process:" + processId);
            if (processId * 1 !== currentPid) {
                process.kill(processId);
            }
        });
        if (currentPid) {
            process.kill(currentPid);
        }
    })
        .catch(function (err) {
        console.error(err);
    });
}
exports.stop = stop;
function reload(config) {
    getProcessList().then(function (data) {
        var workers = data.filter(function (item) { return item.type === 'worker'; });
        if (workers.length > 0) {
            workers.forEach(function (item) {
                logger_1.logger.info("kill processId:" + item.processId + " to reload.");
                process.kill(item.processId);
            });
            process.exit();
        }
        else {
            restart(config);
        }
    });
}
exports.reload = reload;
