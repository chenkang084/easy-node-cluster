"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var PROCESS_PATH = "./process";
exports.writeProcessInfo = function (newInfo) {
    if (fs_1.existsSync(PROCESS_PATH)) {
        // console.log(newInfo);
        fs_1.writeFileSync(PROCESS_PATH, newInfo, {
            encoding: 'utf8',
            flag: 'a'
        });
    }
};
exports.initProcessInfoFile = function (masterPid) {
    if (fs_1.existsSync(PROCESS_PATH)) {
        fs_1.unlinkSync(PROCESS_PATH);
    }
    fs_1.writeFileSync(PROCESS_PATH, "masterPid:" + masterPid + ",", {
        encoding: 'utf8'
    });
};
exports.readProcessInfo = function () {
    if (fs_1.existsSync(PROCESS_PATH)) {
        return fs_1.readFileSync(PROCESS_PATH, {
            encoding: 'utf8'
        })
            .split(',')
            .filter(function (item) { return !!item; });
    }
};
