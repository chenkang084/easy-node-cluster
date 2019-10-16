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
var EventEmitter = require('events');
var logger_1 = require("./utils/logger");
var EasyNodeCluster = /** @class */ (function (_super) {
    __extends(EasyNodeCluster, _super);
    function EasyNodeCluster() {
        var _this = _super.call(this) || this;
        logger_1.logger.info("initilaize master process:" + process.pid);
        return _this;
    }
    EasyNodeCluster.prototype.start = function () {
        var agent = child_process_1.fork(path_1.join(__dirname, './agent.js'));
        agent.on('message', function (msg) {
            console.log("master process say:" + msg);
            var workers = child_process_1.fork(path_1.join(__dirname, './worker.js'));
            workers.on('message', function (msg) {
                console.log("master process say:" + msg);
            });
        });
    };
    return EasyNodeCluster;
}(EventEmitter));
exports.default = EasyNodeCluster;
