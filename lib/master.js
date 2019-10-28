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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
var path_1 = require("path");
var fs_1 = require("fs");
var logger_1 = require("./utils/logger");
var events_1 = __importDefault(require("events"));
var ClusterOptionDefault = /** @class */ (function () {
    function ClusterOptionDefault() {
        this.name = 'easy-node-cluster';
        this.instances = 2;
        this.logs = {
            normal: './runtime.log',
            error: './error.log',
            level: 'error'
        };
    }
    return ClusterOptionDefault;
}());
var EasyNodeMaster = /** @class */ (function (_super) {
    __extends(EasyNodeMaster, _super);
    function EasyNodeMaster(config) {
        var _this = _super.call(this) || this;
        _this.clusterOptions = Object.assign(new ClusterOptionDefault(), config);
        _this.normal = fs_1.openSync(path_1.join(process.cwd(), _this.clusterOptions.logs.normal), 'a');
        _this.error = fs_1.openSync(path_1.join(process.cwd(), _this.clusterOptions.logs.error), 'a');
        return _this;
    }
    EasyNodeMaster.prototype.start = function () {
        this.startAgent();
    };
    EasyNodeMaster.prototype.startAgent = function () {
        var _this = this;
        var agent = child_process_1.spawn('node', [
            path_1.join(__dirname, './agent.js'),
            '--title=easy-node-cluster',
            'agent',
            JSON.stringify(this.clusterOptions)
        ], {
            stdio: ['ignore', 'ignore', this.error, 'ipc']
        });
        agent.on('message', function (msg) {
            logger_1.logger.info("received agent msg:" + msg);
            _this.forkWorkers();
            agent.unref();
            agent.disconnect();
            agent.on('exit', function (msg) {
                logger_1.logger.info("agent:exit", msg);
            });
        });
    };
    EasyNodeMaster.prototype.forkWorkers = function () {
        var appProcess = child_process_1.spawn('node', [
            path_1.join(__dirname, './worker.js'),
            '--title=easy-node-cluster',
            'master',
            JSON.stringify(this.clusterOptions)
        ], {
            detached: true,
            stdio: ['ignore', 'ignore', this.error, 'ipc']
        });
        logger_1.logger.info("start daemon process, daemon pid:" + appProcess.pid);
        appProcess.on('message', function (msg) {
            logger_1.logger.info("master received msg from deamon process:" + msg);
            appProcess.unref();
            appProcess.disconnect();
        });
        appProcess.on('exit', function (msg) {
            logger_1.logger.info("daemon process:exit");
        });
    };
    return EasyNodeMaster;
}(events_1.default));
exports.default = EasyNodeMaster;
