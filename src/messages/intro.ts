import gradient from 'gradient-string';
import figlet from 'figlet';
import pico from 'picocolors';
import { version } from './index.ts';

export function intro() {
  const title = figlet.textSync('Create ToroNet App', {
    font: 'Future',
    horizontalLayout: 'fitted',
    verticalLayout: 'fitted',
    whitespaceBreak: true,
  });

  console.log('');
  console.log(gradient(['green', 'cyan'])(title));
  console.log(pico.green('Welcome to ToroNet!'));
  version();
  console.log('');
  console.log(pico.cyan("Let's get started with setting up your project."));
  console.log('');
}
