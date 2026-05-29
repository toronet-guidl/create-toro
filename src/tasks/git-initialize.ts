import type { Options } from '../types/index.ts';
import { execa } from 'execa';
import path from 'node:path';
import packageJson from '../../package.json' with { type: 'json' };

export async function initializeGitRepository(options: Options) {
  const projectRootPath = path.resolve(options.name);

  await execa('git', ['init'], { cwd: projectRootPath });
  await execa('git', ['checkout', '-b', 'main'], { cwd: projectRootPath });
}

export async function createGitCommit(options: Options) {
  const projectRootPath = path.resolve(options.name);

  await execa('git', ['add', '.'], { cwd: projectRootPath });
  await execa('git', ['commit', '-m', `Initial commit with create-toro v${packageJson.version}`], {
    cwd: projectRootPath,
  });
}
