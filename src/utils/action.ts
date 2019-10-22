import EasyNodeCluster from '../index';
var pidusage = require('pidusage');
const runScript = require('runscript');

interface ProcessInfo {
  type: string;
  processId: string | number;
}

export function getProcessList(stdio: any) {
  const processList = stdio.stdout
    .toString()
    .split('\n')
    .filter((item: string) => item.includes('node') && item.includes('--title'))
    .map((line: string) => {
      const row = line.split(' ').filter(item => !!item);
      const processId = (row && row[1]) || '';
      let type = 'worker';
      if (line.includes('master')) {
        type = 'master';
      } else if (line.includes('agent')) {
        type = 'agent';
      }

      return {
        type,
        processId
      };
    });

  return processList.map((item: ProcessInfo) => {
    return new Promise(resolve => {
      pidusage(item.processId, function(err: Error, stats: any) {
        resolve({
          type: item.type,
          processId: item.processId,
          cpuUsage: stats.cpu.toFixed('2') + '%',
          meoUsage: (stats.memory / 1024 / 1024).toFixed(2) + 'M'
        });
      });
    });
  });
}

export function start() {
  const easyNodeCluster = new EasyNodeCluster();

  easyNodeCluster.start();
}

export function stop() {
  return runScript('ps -ef | grep easy-node-cluster', { stdio: 'pipe' })
    .then((stdio: any) => {
      stdio.stdout
        .toString()
        .split('\n')
        .filter(
          (item: string) => item.includes('node') && item.includes('--title')
        )
        .map((line: string) => {
          return line.split(' ').filter(item => !!item)[1];
        })
        .forEach((processId: number) => {
          console.log(`kill process:${processId}`);

          process.kill(processId);
        });
    })
    .catch((err: Error) => {
      console.error(err);
    });
}
