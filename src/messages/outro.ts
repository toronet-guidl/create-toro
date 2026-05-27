import { green, bold, dim } from 'picocolors';
import type { Options } from '../types';
import { mind } from 'gradient-string';

const website = 'https://scaffold-toro.vercel.app';

export function outro(options: Options) {
  let steps = 0;
  console.log(green('Your Toro project has been created successfully!'));
  console.log('');
  console.log(bold('Next steps:'));
  console.log(dim(`${++steps}. Change into the project directory:`));
  console.log(green('   cd ' + options.name));
  if (!options.skipInstall) {
    console.log(dim(`${++steps}. Install dependencies:`));
    console.log(green('   npm install'));
  }
  console.log(dim(`${++steps}. Start the development server:`));
  console.log(green('   npm run dev'));
  console.log('');
  console.log('Learn more about create-toro at ' + green(website));
  console.log('');
  console.log(mind('Happy coding!!!'));
  console.log('');
}
