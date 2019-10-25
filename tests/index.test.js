const { describe, it } = require('mocha');
const { expect } = require('chai');
const { commonUtil } = require('easy-node-utils');
const path = require('path');
const fs = require('fs');
const configPath = path.join(process.cwd(), './easy-node-cluster.json');
let config = null;
const { start, restart, stop, getProcessList } = require('../lib/utils/action');
if (fs.existsSync(configPath)) {
  config = JSON.parse(fs.readFileSync(configPath));
}

describe('test easy-node-cluster', () => {
  // before(() => {

  // });

  it('test start cluster', async () => {
    stop();
    await commonUtil.sleep(2000);
    start(config);
    await commonUtil.sleep(2000);
    const data = await getProcessList();
    expect(data.length).is.greaterThan(0);
  });

  it('test stop cluster', async () => {
    stop();
    await commonUtil.sleep(2000);
    const data = await getProcessList();
    expect(data.length).is.equal(0);
  });
});
