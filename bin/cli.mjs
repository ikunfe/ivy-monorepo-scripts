import { fileURLToPath } from 'url';
import { cac } from 'cac';
import { readFileSync } from 'fs';
import pkgJson from '../package.json' assert { type: "json" };
import lint from '../esm/lint.js'
import create from '../esm/create.js';
import start from '../esm/start.js';
import build from '../esm/build.js';

const cli = cac('ivy-monorepo-scripts');

console.log('start');
(async () => {
  cli
    .command('create', 'create app', {
      allowUnknownOptions: false,
    })
    .action(async () => {
      await create()
    });

  cli
    .command('commit', 'commit file', {
      allowUnknownOptions: false,
    })
    .option('--force', 'skip select project when change multiple apps')
    .action(async (options) => {
      delete options['--'];
      await lint(options)
    });

  cli
    .command('start', 'start develop project', {
      allowUnknownOptions: false,
    })
    .action(async () => {
      await start()
    });

  cli
    .command('build', 'build project', {
      allowUnknownOptions: false,
    })
    .action(() => {
      build()
    });
  cli.help();
  cli.version(pkgJson.version);
  cli.parse(process.argv, { run: true });
})()
  .catch((err) => {
    console.log('错误了');
    process.exit(1);
  });
