const { describe, it } = require('mocha');
const { expect } = require('chai');
const { spawn } = require('child_process');
const { join } = require('path');

describe('test easy-node-cluster', () => {
  it('test start cluster', () => {
    stop();

    // const job = spawn('node', [join(__dirname, './utils/start-app')]);
    // job.unref();
    // // job.disconnect();

    // const usageList = getProcessList(stdio);

    // Promise.all(usageList).then(info => {
    //   expect(info.length).is.greaterThan(0);
    //   // process.exit();
    // });
  });
});
