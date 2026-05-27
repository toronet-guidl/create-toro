export type SolidityFramework = 'hardhat' | 'foundry';

export type Options = {
  name: string;
  skipInstall: boolean;
  dev: boolean;
  solidityFramework: SolidityFramework | 'none' | null;
  help: boolean;
  version: boolean;
};
