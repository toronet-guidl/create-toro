import { execa } from 'execa';
import semver from 'semver';
import type { Options } from '../types';
import { yellow } from 'picocolors';

export const checkSystemRequirements = async (options: Options) => {
  const errors: string[] = [];

  try {
    const { stdout: nodeVersion } = await execa('node', ['--version']);
    const cleanNodeVersion = nodeVersion.replace('v', '');
    if (semver.lt(cleanNodeVersion, '20.18.3')) {
      errors.push(`Node.js version must be >= 20.18.3. Current version: ${nodeVersion}`);
    }
  } catch {
    errors.push('Node.js is not installed. Please install Node.js >= 20.18.3');
  }

  if (!options.skipInstall) {
    try {
      const { stdout: pnpmVersion } = await execa('pnpm', ['--version']);
      if (semver.lt(pnpmVersion, '1.0.0')) {
        errors.push(`pnpm version should be >= 1.0.0. Recommended version is >= 10.x. Current version: ${pnpmVersion}`);
      }
    } catch {
      errors.push('pnpm is not installed. Please install pnpm >= 1.0.0. Recommended version is >= 10.x');
    }
  }

  try {
    await execa('git', ['--version']);

    try {
      await execa('git', ['config', 'user.name']);
    } catch {
      errors.push("Git user.name is not configured. Please set it using: git config --global user.name 'Your Name'");
    }

    try {
      await execa('git', ['config', 'user.email']);
    } catch {
      errors.push(
        "Git user.email is not configured. Please set it using: git config --global user.email 'your.email@example.com'",
      );
    }
  } catch {
    errors.push('Git is not installed. Please install Git');
  }

  if (options.solidityFramework === 'foundry') {
    try {
      await validateFoundry();
    } catch (error) {
      if (error instanceof Error) {
        errors.push(error.message);
      } else {
        errors.push('An unknown error occurred while validating Foundry installation');
      }
    }
  }

  return { errors };
};

// Custom error for Foundry validation
class FoundryValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FoundryValidationError';
  }
}

export const validateFoundry = async () => {
  const REQUIRED_FOUNDRY_VERSION = '1.4.0';
  let versionMatch: RegExpMatchArray | null = null;
  // Check if forge is installed
  try {
    const { stdout: forgeVersion } = await execa('forge', ['--version']);
    // Extract version from output like "forge Version: 1.4.3-stable"
    versionMatch = forgeVersion.match(/forge Version: (\d+\.\d+\.\d+)/);
    if (!versionMatch) {
      throw new Error();
    }
  } catch {
    const message = ` 
    ${yellow('Could not parse foundry version.')}
    ${yellow('Please ensure foundry is properly installed')}
    ${yellow('Checkout: https://getfoundry.sh')}
       `;
    throw new FoundryValidationError(message);
  }

  // Parse and validate version
  try {
    const version = versionMatch[1]!;
    if (semver.lt(version, REQUIRED_FOUNDRY_VERSION)) {
      const message = `
 ${yellow('Foundry version is older than required.')}
 ${yellow(`Current version: ${version}, required: >= ${REQUIRED_FOUNDRY_VERSION}`)}
 ${yellow('Please update foundry by running: foundryup')}
 ${yellow('Checkout: https://getfoundry.sh')}
    `;
      throw new FoundryValidationError(message);
    }
  } catch (error) {
    // Re-throw custom validation errors
    if (error instanceof FoundryValidationError) {
      throw error;
    }
    throw new Error('Unknown error occurred while validating Foundry version');
  }
};
