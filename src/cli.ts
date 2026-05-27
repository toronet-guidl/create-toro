import { intro, outro, help, version } from './messages';
import { parseArgs, promptForMissingOptions } from './prompts';
import { Listr } from 'listr2';
import { checkSystemRequirements } from './tasks/check-requirements';
import { red } from 'picocolors';
import { createProjectDirectory } from './tasks/create-directory';

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
          console.log(red('The following issues were found:'));
          errors.forEach((error) => console.log(red(`- ${error}`)));
          process.exit(1);
        }
      },
    },
    {
      title: `📁 Create project directory`,
      task: () => createProjectDirectory(options),
    },
  ]);

  await tasks.run();

  outro(options);
}

main();
