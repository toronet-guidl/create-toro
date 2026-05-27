import gradient from 'gradient-string';
import figlet from 'figlet';
import { green, cyan } from 'picocolors';
import { version } from './';

export function intro() {
  const title = figlet.textSync('Create ToroNet App', {
    font: 'Future',
    horizontalLayout: 'fitted',
    verticalLayout: 'fitted',
    whitespaceBreak: true,
  });

  console.log('');
  console.log(gradient(['green', 'cyan'])(title));
  console.log(green('Welcome to ToroNet!'));
  version();
  console.log('');
  console.log(cyan("Let's get started with setting up your project."));
  console.log('');
}
