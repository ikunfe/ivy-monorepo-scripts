import { Generator } from '@umijs/utils';
import inquirer from 'inquirer';
import fs from 'fs-extra';
import { join } from 'path';
import { Inquirer } from './types';


enum ProjectTypePath {
  apps = './apps/',
  libs = './packages/'
}

class PkgGenerator extends Generator {
  name: string;
  template: string;
  path: string;
  cwd: string;
  constructor(props) {
    const { name, template, path, cwd } = props;
    super(props);
    this.name = name;
    this.template = template;
    this.path = path;
    this.cwd = cwd;
  }

  async writing() {
    this.copyDirectory({
      context: {
        name: this.name,
        template: this.template,
      },
      path: join(this.cwd, `./templates/${this.template}`),
      target: join(this.cwd, `${this.path}${this.name}`),
    });
  }
}

const cwd = process.cwd();

async function create(name: string, template: string, projectType: string) {
  if (!name || !template || !projectType) {
    console.log('参数错误，请重新输入');
    run();
  }
  const path = ProjectTypePath[projectType];
  if (!fs.existsSync(join(cwd, `${path}${name}`))) {
    await new PkgGenerator({
      name,
      cwd,
      template,
      path,
    }).run();
  } else {
    console.log(`${name} 已存在，请重新输入合适的项目名称`);
    run(template, projectType);
  }
}

export default async function run(template = '', projectPath = '') {
  const imquiryArr: Inquirer[] = [];

  !projectPath && imquiryArr.push({
    type: 'list',
    name: 'projectType',
    message: '请选择项目的路径',
    choices: ['apps', 'packages'],
  });

  imquiryArr.push({
    type: 'input',
    name: 'projectName',
    message: '请输入项目名称',
  });

  !template && imquiryArr.unshift({
    type: 'list',
    name: 'frame',
    message: '请选择项目的框架',
    choices: ['react', 'vue'],
  });

  const {
    frame = template,
    projectName,
    projectType = projectPath,
  }: Record<string, string> = await inquirer.prompt(imquiryArr);
  await create(projectName, frame, projectType);
}
