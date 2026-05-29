import path from 'node:path';
import type { Options } from '../types/index.ts';
import { execa } from 'execa';
import fs from 'fs';

export async function installDependenciesRunPostScripts(options: Options) {
  const projectPath = path.resolve(options.name);

  // install dependencies in /core
  const corePath = path.join(projectPath, 'packages','core');
  await execa('pnpm', ['install'], { cwd: corePath });

  // run all post scripts in /contracts
  const contractsPath = path.join(projectPath, 'packages', 'contracts');
  const scaffoldConfigPath = path.join(contractsPath, 'scaffold.config.json');
  const scaffoldConfig = JSON.parse(fs.readFileSync(scaffoldConfigPath, 'utf8'));
  const postScripts = scaffoldConfig.postCommands || [];
  for (const script of postScripts) {
    script.split(' ').length > 1
      ? await execa(script.split(' ')[0], script.split(' ').slice(1), { cwd: contractsPath })
      : await execa(script, { cwd: contractsPath });
  }

  // remove `scaffold.config.json` from the scaffold ((in 'core' and 'contracts' - if they exist))
  const scaffoldConfigCorePath = path.join(corePath, 'scaffold.config.json');
  if (fs.existsSync(scaffoldConfigCorePath)) {
    fs.rmSync(scaffoldConfigCorePath);
  }
  if (fs.existsSync(scaffoldConfigPath)) {
    fs.rmSync(scaffoldConfigPath);
  }
}
