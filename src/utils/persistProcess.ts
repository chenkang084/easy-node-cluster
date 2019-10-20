import { writeFileSync, readFileSync, unlinkSync, existsSync } from 'fs';

const PROCESS_PATH = `./process`;

export const writeProcessInfo = (newInfo: string) => {
  if (existsSync(PROCESS_PATH)) {
    // console.log(newInfo);

    writeFileSync(PROCESS_PATH, newInfo, {
      encoding: 'utf8',
      flag: 'a'
    });
  }
};

export const initProcessInfoFile = (masterPid: number) => {
  if (existsSync(PROCESS_PATH)) {
    unlinkSync(PROCESS_PATH);
  }

  writeFileSync(PROCESS_PATH, `masterPid:${masterPid},`, {
    encoding: 'utf8'
  });
};

export const readProcessInfo = () => {
  if (existsSync(PROCESS_PATH)) {
    return readFileSync(PROCESS_PATH, {
      encoding: 'utf8'
    })
      .split(',')
      .filter(item => !!item);
  }
};
