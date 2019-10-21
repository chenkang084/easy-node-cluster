"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
var path_1 = require("path");
var fs_1 = require("fs");
var EventEmitter = require('events');
var out = fs_1.openSync('./out1.log', 'a');
var err = fs_1.openSync('./out2.log', 'a');
var WORKER_PATH = "./worker.js";
var EasyNodeMaster = /** @class */ (function (_super) {
    __extends(EasyNodeMaster, _super);
    function EasyNodeMaster() {
        var _this = _super.call(this) || this;
        console.log("start master process:" + process.pid);
        return _this;
        // initProcessInfoFile((this.masterPid = process.pid));
    }
    EasyNodeMaster.prototype.start = function () {
        this.startAgent();
    };
    EasyNodeMaster.prototype.startAgent = function () {
        var _this = this;
        var agent = child_process_1.spawn('node', [path_1.join(__dirname, './agent.js')], {
            stdio: ['ignore', out, err, 'ipc']
        });
        agent.on('message', function (msg) {
            console.log("received agent msg:" + msg);
            _this.forkWorkers();
            agent.unref();
            agent.disconnect();
            agent.on('exit', function (msg) {
                console.log("agent:exit");
            });
        });
    };
    EasyNodeMaster.prototype.forkWorkers = function () {
        console.log('------start app process to fork worker------');
        var appProcess = child_process_1.spawn('node', [
            path_1.join(__dirname, './worker.js'),
            path_1.join(__dirname, '../test/app.js'),
            '--title=easy-node-cluster'
        ], {
            detached: true,
            stdio: ['ignore', out, err, 'ipc']
        });
        console.log('守护进程开启 父进程 pid: %s, 守护进程 pid: %s', process.pid, appProcess.pid);
        // writeProcessInfo(`agentPid: ${(this.agentPid = appProcess.pid)},`);
        appProcess.on('message', function (msg) {
            console.log("master:worker received msg:" + msg);
            appProcess.unref();
            appProcess.disconnect();
        });
        appProcess.on('exit', function (msg) {
            console.log("appProcess:exit");
        });
    };
    return EasyNodeMaster;
}(EventEmitter));
exports.default = EasyNodeMaster;
