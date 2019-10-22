const { describe, it } = require('mocha');
const { expect } = require('chai');
const { stop, getProcessList } = require('../lib/utils/action');
const EasyNodeCluster = require('../lib').default;
new EasyNodeCluster().start();

describe('test easy-node-cluster', () => {
  it('test start cluster', () => {
    stop();

    // const usageList = getProcessList(stdio);

    // Promise.all(usageList).then(info => {
    //   expect(info.length).is.greaterThan(0);
    //   // process.exit();
    // });
  });
});
