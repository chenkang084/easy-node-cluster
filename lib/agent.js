"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logger_1 = require("./utils/logger");
// do some shedule jobs
// do some tasks that only run in one process
logger_1.logger.info("start agent, processId:" + process.pid);
// console.log(this);
process.send('start agent done.');
// keep agent process active
setInterval(function () { }, 1000 * 60 * 60 * 24);
