import minimist from 'minimist';
import type { Options } from './types/index.ts';
import { input, select } from '@inquirer/prompts';
import { validateNpmName } from './utils.ts';
import { solidityFrameworkChoices } from './constants.ts';

const defaultOptions = {
  name: 'my-dapp-example',
  solidityFramework: 'foundry',
  dev: false,
  help: false,
  version: false,
} as const satisfies Options;

export async function promptForMissingOptions(options: Options): Promise<Options> {
  try {
    const name =
      options.name ??
      (await input({
        message: 'Your project name:',
        default: defaultOptions.name,
        validate: (name: string) => {
          const validation = validateNpmName(name);
          if (validation.valid) {
            return true;
          }
          return 'Project ' + validation.problems[0];
        },
      }));

    const solidityFramework =
      options.solidityFramework ??
      (await select({
        message: 'What solidity framework do you want to use?',
        choices: solidityFrameworkChoices.map((choice) =>
          typeof choice === 'string'
            ? { value: choice, name: choice.charAt(0).toUpperCase() + choice.slice(1) }
            : choice,
        ),
        default: defaultOptions.solidityFramework || undefined,
      }));

    const mergedOptions: Options = {
      name: name,
      solidityFramework: solidityFramework,
      dev: options.dev ?? defaultOptions.dev,
      help: options.help ?? defaultOptions.help,
      version: options.version ?? defaultOptions.version,
    };

    return mergedOptions;
  } catch (error) {
    console.log('Prompt was cancelled by the user.');
    process.exit(1);
  }
}

export function parseArgs(args: string[]): Options {
  const parsedArgs = minimist(args, {
    alias: {
      'solidity-framework': ['f', 'solidityFramework'],
      name: ['n', 'project'],
      help: ['h'],
      version: ['v'],
      dev: ['d'],
    },
    boolean: ['version', 'dev', 'help'],
    string: ['name', 'solidity-framework'],
  });

  return {
    name: parsedArgs.name || parsedArgs._[0] || null,
    solidityFramework: parsedArgs['solidity-framework'] || null,
    dev: parsedArgs.dev || false,
    help: !!parsedArgs.help,
    version: !!parsedArgs.version,
  };
}
