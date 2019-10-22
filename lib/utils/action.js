"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = __importDefault(require("../index"));
var pidusage = require('pidusage');
var runScript = require('runscript');
function getProcessList(stdio) {
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
    return processList.map(function (item) {
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
}
exports.getProcessList = getProcessList;
function start() {
    var easyNodeCluster = new index_1.default();
    easyNodeCluster.start();
}
exports.start = start;
function stop() {
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
            process.kill(processId);
        });
    })
        .catch(function (err) {
        console.error(err);
    });
}
exports.stop = stop;
