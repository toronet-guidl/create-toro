export type SolidityFramework = 'hardhat' | 'foundry';

export type Options = {
  name: string;
  dev: boolean;
  solidityFramework: SolidityFramework | 'none' | null;
  help: boolean;
  version: boolean;
};
