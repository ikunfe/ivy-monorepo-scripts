import { cac } from 'cac';
import pkgJson from '../package.json' assert { type: "json" };
import lint from '../esm/lint.js'
import create from '../esm/create.js';
import start from '../esm/start.js';
import build from '../esm/build.js';
import createBranch from '../esm/createBranch.js';

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
  
  cli
    .command('createBranch', 'create branch by app', {
      allowUnknownOptions: false,
    })
    .action(async () => {
      await createBranch()
    });
  cli.help();
  cli.version(pkgJson.version);
  cli.parse(process.argv, { run: true });
})()
  .catch((err) => {
    console.log('错误了', err);
    process.exit(1);
  });
