import { fileURLToPath } from 'url';
import { cac } from 'cac';
import { readFileSync } from 'fs';
import shell from 'shelljs';
import { join, dirname } from 'path';

const cli = cac('ivy-monorepo-scripts');

(async () => {
  cli
    .command('build', 'Bundle files', {
      allowUnknownOptions: false,
    })
    .action(async (options) => {
      delete options['--'];
      const { rootDir, ...commandArgs } = options;
      console.log(456456456);
    });

  cli
    .command('commit', 'commit file', {
      allowUnknownOptions: false,
    })
    .option('--rootDir <rootDir>', 'specify root directory', {
      default: process.cwd(),
    })
    .action(async (options) => {
      delete options['--'];
      const { rootDir, ...commandArgs } = options;
      console.log(123123123);
      /* shell.exec('esno ./lint.ts'); */
    });

  cli.help();

  const pkgPath = join(__dirname, '../package.json');
  cli.version(JSON.parse(readFileSync(pkgPath, 'utf-8')).version);

  cli.parse(process.argv, { run: true });
})()
  .catch((err) => {
    process.exit(1);
  });
