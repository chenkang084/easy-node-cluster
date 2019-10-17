"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var PROCESS_PATH = "./process.json";
exports.writeProcessInfo = function (newInfo) {
    if (fs_1.existsSync(PROCESS_PATH)) {
        console.log(newInfo);
        var processInfo = JSON.parse(fs_1.readFileSync(PROCESS_PATH).toString());
        fs_1.writeFileSync(PROCESS_PATH, JSON.stringify(__assign(__assign({}, processInfo), newInfo)), {
            encoding: 'utf8'
        });
    }
};
exports.initProcessInfoFile = function (masterPid) {
    if (fs_1.existsSync(PROCESS_PATH)) {
        fs_1.unlinkSync(PROCESS_PATH);
    }
    fs_1.writeFileSync(PROCESS_PATH, JSON.stringify({ masterPid: masterPid }), {
        encoding: 'utf8'
    });
};
