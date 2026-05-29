import pico from 'picocolors';
import type { Options } from '../types/index.ts';
import { mind } from 'gradient-string';

const website = 'https://scaffold-toro.vercel.app';

export function outro(options: Options) {
  let steps = 0;
  console.log(pico.green('Your Toro project has been created successfully!'));
  console.log('');
  console.log(pico.bold('Next steps:'));
  console.log(pico.dim(`${++steps}. Change into the project directory:`));
  console.log(pico.green('   cd ' + options.name));
  console.log(pico.dim(`${++steps}. Start the development server:`));
  console.log(pico.green('   npm run dev'));
  console.log('');
  console.log('Learn more about create-toro at ' + pico.green(website));
  console.log('');
  console.log(mind('Happy coding!!!'));
  console.log('');
}
