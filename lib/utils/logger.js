"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var lib_1 = __importDefault(require("easy-node-logger/lib"));
var logger = new lib_1.default({
    projectName: 'easy-node-logger',
    momentFormat: 'YYYY-MM-DD HH:mm:ss',
    logFilePath: 'mercury-oncall.log',
    environment: 'node',
    level: process.env.NODE_ENV === 'development' ? 'debug' : 'info'
});
exports.logger = logger;
