import { spawn } from 'child_process';
import { join, relative } from 'path';
import fs from 'fs-extra';

const cwd = process.cwd();
const PACKAGES_DIR = join(cwd, 'packages');
const APPS_DIR = join(cwd, 'apps');

export default function build() {
  const groupName = process.env.GROUP_NAME;

  let pnpmArgs: string[] = [];
  let packagePath = '';

  if (groupName) {
    packagePath = getPackagePath(groupName);
    pnpmArgs = pnpmArgs.concat(['--filter', `./${relative(cwd, packagePath)}`]);
  }

  pnpmArgs = pnpmArgs.concat(['run', '-r', 'build']);

  const ls = spawn('pnpm', pnpmArgs);

  ls.stdout.on('data', (data) => {
    console.log(String(data));
  });

  ls.on('error', (code) => {
    console.error(`child process exited with code ${code}`);
  });

  ls.on('close', () => {
    if (packagePath) {
      const distPath = join(packagePath, 'dist');
      if (fs.existsSync(distPath)) {
        fs.copySync(distPath, join(cwd, 'dist'));
      }
    }
  });
}

function getPackagePath(groupName: string): string {
  const dirName = groupName.replace('_', '-');

  if (fs.existsSync(join(PACKAGES_DIR, dirName))) {
    return join(PACKAGES_DIR, dirName);
  }

  if (fs.existsSync(join(APPS_DIR, dirName))) {
    return join(APPS_DIR, dirName);
  }

  throw new Error(`${groupName} is not a valid group name`);
}
