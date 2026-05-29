import { solidityFrameworkChoices } from '../constants';

export type SolidityFramework = (typeof solidityFrameworkChoices)[number];

export type Options = {
  name: string;
  dev: boolean;
  solidityFramework: SolidityFramework;
  help: boolean;
  version: boolean;
};
