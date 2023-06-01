import inquirer from 'inquirer';
import shell from 'shelljs';
import { getStagedInfo } from './staged';

const filterAppName = (name: string) => {
  switch (name) {
    case 'lvy-pay':
      return 'lvy_pay';
    case 'JSbridge-demo-page':
      return 'jsbridge-demo';
    default:
      return name;
  }
};

async function start() {
  const { changedAppFiles, allAppNames } = getStagedInfo();

  const onlyChangeOneApp = changedAppFiles.length === 1;
  let app = '';

  if (onlyChangeOneApp) {
    app = changedAppFiles[0];
  } else {
    const chooseArr = changedAppFiles.length ? changedAppFiles : allAppNames;
    const answer = await inquirer.prompt([{
      type: 'list',
      name: 'app',
      message: '请选择需要启动的 app',
      choices: chooseArr,
      pageSize: chooseArr.length,
    }]);
    app = answer.app;
  }

  if (app) {
    shell.exec(`pnpm --filter ${filterAppName(app)} start`);
  } else {
    shell.echo('请选择 app 项目!');
  }
}

start();
