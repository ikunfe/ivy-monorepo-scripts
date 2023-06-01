import shell from 'shelljs';
import { join } from 'path';

export const getStagedInfo = () => {
  const cwd = process.cwd();
  const appsDir = join(cwd, 'apps');
  const allAppNames: string[] = shell.ls(appsDir);
  const changedAppFiles = [...new Set<string>(shell.exec('git add . && git status -s').stdout.split('\n').filter((filePath: string) => filePath.includes('apps')).map((path: string) => path.split('/')[1]))];
  return {
    allAppNames,
    changedAppFiles,
  };
};
