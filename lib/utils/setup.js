"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var path_1 = require("path");
var chalk = require('chalk');
var templateJson = {
    name: 'easy-node-cluster',
    script: '',
    instances: 2,
    node_args: '--max_old_space_size=2048'
};
var jsonPath = path_1.join(__dirname, '../../easy-node-cluster.json');
exports.init = function () {
    if (fs_1.existsSync(jsonPath)) {
        fs_1.unlinkSync(jsonPath);
    }
    fs_1.writeFileSync(jsonPath, JSON.stringify(templateJson, null, 4));
    console.log(chalk.green('generate easy-node-cluster.json'));
};
