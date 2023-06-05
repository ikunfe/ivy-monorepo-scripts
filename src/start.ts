import shell from 'shelljs';
import { getAppName } from './getAppName.js';

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

export default async function start() {
  const app = await getAppName('请选择需要启动的 app');

  if (app) {
    shell.exec(`pnpm --filter ${filterAppName(app)} start`);
  } else {
    shell.echo('请选择 app 项目!');
  }
}
