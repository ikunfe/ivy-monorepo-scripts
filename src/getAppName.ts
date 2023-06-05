import inquirer from 'inquirer';
import { getStagedInfo } from './staged.js';

export async function getAppName(message: string) {
  const { changedAppFiles, allAppNames } = getStagedInfo();

  const onlyChangeOneApp = changedAppFiles.length === 1;

  if (onlyChangeOneApp) {
     return changedAppFiles[0];
  } else {
    const chooseArr = changedAppFiles.length ? changedAppFiles : allAppNames;
    const answer = await inquirer.prompt<Record<string, string>>([{
      type: 'list',
      name: 'app',
      message,
      choices: chooseArr,
      pageSize: chooseArr.length,
    }]);
    return answer.app;
  }
}