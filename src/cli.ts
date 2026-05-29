import { intro, outro, help, version } from './messages/index.ts';
import { parseArgs, promptForMissingOptions } from './prompts.ts';
import { Listr } from 'listr2';
import pico from 'picocolors';
import {
  createProjectDirectory,
  checkSystemRequirements,
  copyTemplates,
  initializeGitRepository,
  createGitCommit,
  installDependenciesRunPostScripts,
} from './tasks/index.ts';

const args = process.argv;
const initialOptions = parseArgs(args.slice(2));

if (initialOptions.help) {
  help();
  process.exit(0);
}

if (initialOptions.version) {
  version();
  process.exit(0);
}

async function main() {
  intro();

  const options = await promptForMissingOptions(initialOptions);

  const tasks = new Listr([
    {
      title: 'Checking requirements are met',
      task: async () => {
        const { errors } = await checkSystemRequirements(options);
        if (errors.length > 0) {
          console.log(pico.red('The following issues were found:'));
          errors.forEach((error) => console.log(pico.red(`- ${error}`)));
          process.exit(1);
        }
      },
    },
    {
      title: `📁 Create project directory`,
      task: async () => await createProjectDirectory(options),
    },
    {
      title: '📄 Copy template files',
      task: async () => await copyTemplates(options),
    },
    {
      title: '⚙️ Initialize Git repository',
      task: async () => await initializeGitRepository(options),
    },
    {
      title: '📦 Installing dependencies and running setup scripts',
      task: async () => await installDependenciesRunPostScripts(options),
    },
    {
      title: '⚙️ Finishing Up',
      task: async () => await createGitCommit(options),
    },
  ]);

  await tasks.run();

  outro(options);
}

main();
