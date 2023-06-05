import inquirer from 'inquirer';
import shell from 'shelljs';
import { Inquirer } from './types';
import { getStagedInfo } from './staged.js';

const COMMIT_TYPE_REGEXP = /upd|feat|fix|refactor|docs|chore|style|revert/g;

function addProjectInfo(msg: string, changedAppFiles: string[]) {
  if (changedAppFiles.length) {
    return msg.replace(COMMIT_TYPE_REGEXP, (type) =>
      `${type}(${changedAppFiles.join(',').toLowerCase()})`);
  }
  return msg;
}

export default async function lint(options: { force: boolean }) {
  const { changedAppFiles, allAppNames } = getStagedInfo();

  const inquireArr: Inquirer[] = [{
    type: 'input',
    name: 'msg',
    message: '请输入commit message',
  }];
  
  const needCheckPackage = changedAppFiles.length > 1 && !options.force;
  needCheckPackage && inquireArr.push({
    type: 'checkbox',
    name: 'apps',
    message: '选择提交的 app',
    choices: allAppNames,
    pageSize: allAppNames.length,
  });

  const answer = await inquirer.prompt(inquireArr);
  const { apps, msg } = answer;
  let canLinted = true;
  if (needCheckPackage) {
    canLinted = changedAppFiles.every((file) => apps.includes(file));
  }
  if (canLinted) {
    shell.exec(`git commit -m '${addProjectInfo(msg, changedAppFiles)}'`);
  } else {
    shell.echo(`只能修改你所修改 ${changedAppFiles.join(',')} 模块中的代码`);
    shell.exit(1);
  }
}
