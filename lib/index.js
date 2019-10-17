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
var persistProcess_1 = require("./utils/persistProcess");
var cluster = require('cluster');
var EventEmitter = require('events');
var WORKER_PATH = "./worker.js";
var EasyNodeCluster = /** @class */ (function (_super) {
    __extends(EasyNodeCluster, _super);
    function EasyNodeCluster() {
        var _this = _super.call(this) || this;
        console.log("start master process:" + process.pid);
        persistProcess_1.initProcessInfoFile((_this.masterPid = process.pid));
        return _this;
    }
    EasyNodeCluster.prototype.start = function () {
        this.forkWorkers();
    };
    EasyNodeCluster.prototype.forkWorkers = function () {
        console.log('------start app process to fork worker------');
        var appProcess = child_process_1.fork(path_1.join(__dirname, WORKER_PATH), ['../test/app.js']);
        persistProcess_1.writeProcessInfo({ agentPid: this.agentPid = appProcess.pid });
        appProcess.on('message', function (msg) {
            console.log("master:worker received msg:" + msg);
        });
        appProcess.on('exit', function (msg) {
            console.log("exit");
        });
    };
    return EasyNodeCluster;
}(EventEmitter));
exports.default = EasyNodeCluster;
