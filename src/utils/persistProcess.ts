import { writeFileSync, readFileSync, unlinkSync, existsSync } from 'fs';

const PROCESS_PATH = `./process.json`;

export const writeProcessInfo = (newInfo: object) => {
  if (existsSync(PROCESS_PATH)) {
    console.log(newInfo);

    const processInfo = JSON.parse(readFileSync(PROCESS_PATH).toString());
    writeFileSync(
      PROCESS_PATH,
      JSON.stringify({ ...processInfo, ...newInfo }),
      {
        encoding: 'utf8'
      }
    );
  }
};

export const initProcessInfoFile = (masterPid: number) => {
  if (existsSync(PROCESS_PATH)) {
    unlinkSync(PROCESS_PATH);
  }

  writeFileSync(PROCESS_PATH, JSON.stringify({ masterPid }), {
    encoding: 'utf8'
  });
};
