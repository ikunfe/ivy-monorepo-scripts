import inquirer from 'inquirer';
import shell from 'shelljs';
import { getAppName } from './getAppName.js';

export default async function createBranch() {
  const app = await getAppName('请选择需要创建分支的 app');
  if (app) {
    const { info } = await inquirer.prompt([
      {
        type: 'input',
        name: 'info',
        message: '请输入需求信息',
      }
    ])
    shell.exec(`git checkout -b daily/${app}/${info}`);
  } else {
    shell.echo('请选择 app 项目!');
  }
}