"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logger_1 = require("./utils/logger");
// do some shedule jobs
// do some tasks that only run in one process
logger_1.logger.info("start agent, processId:" + process.pid);
process.send('start agent done.');
