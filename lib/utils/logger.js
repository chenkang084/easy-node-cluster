"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var lib_1 = __importDefault(require("easy-node-logger/lib"));
var path_1 = require("path");
var fs_1 = require("fs");
var configPath = path_1.join(process.cwd(), './easy-node-cluster.json');
var config = null;
if (fs_1.existsSync(configPath)) {
    config = JSON.parse(fs_1.readFileSync(configPath).toString());
}
var logger = new lib_1.default({
    projectName: 'easy-node-cluster',
    momentFormat: 'YYYY-MM-DD HH:mm:ss',
    logFilePath: (config.logs && config.logs.normal) || 'runtime.log',
    environment: 'node',
    level: (config.logs && config.logs.level) || 'info'
});
exports.logger = logger;
