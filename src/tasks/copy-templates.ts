import type { Options } from '../types/index.ts';
import { templateRepository, solidityFrameworkChoices } from '../constants.ts';
import degit from 'degit';
import path from 'node:path';
import fs from 'node:fs';
import ncp from 'ncp';
import mergeJsonStr from 'merge-packages';

export async function copyTemplates(options: Options) {
  // copy github repository to destination path
  const destinationPath = path.resolve(options.name);
  let emitter = degit(templateRepository, {
    cache: false,
    force: true,
    verbose: false,
  });

  await emitter.clone(destinationPath);

  // copy the correct solidity framework template to `contracts` directory
  const contractsPath = path.join(destinationPath, 'packages', 'contracts');
  const frameworkTemplatePath = path.join(destinationPath, 'packages', options.solidityFramework);

  await new Promise((resolve, reject) => {
    ncp(frameworkTemplatePath, contractsPath, { clobber: false, stopOnErr: true }, function (err: Error[] | null) {
      if (err) {
        reject(err);
      } else {
        resolve(undefined);
      }
    });
  });

  // merge package.json files in solidity framework folder to the `contracts` folder
  const frameworkPackageJsonPath = path.join(frameworkTemplatePath, 'package.json');
  const contractsPackageJsonPath = path.join(contractsPath, 'package.json');

  const frameworkPackageJson = fs.readFileSync(frameworkPackageJsonPath, 'utf-8');
  const contractsPackageJson = fs.readFileSync(contractsPackageJsonPath, 'utf-8');

  const mergedPackageJson = (mergeJsonStr as any).default
    ? (mergeJsonStr as any).default(contractsPackageJson, frameworkPackageJson)
    : (mergeJsonStr as any)(contractsPackageJson, frameworkPackageJson);

  fs.writeFileSync(contractsPackageJsonPath, mergedPackageJson);

  // remove the unnecessary framework templates
  const packagesPath = path.join(destinationPath, 'packages');
  const templatesToRemove = solidityFrameworkChoices;

  for (const template of templatesToRemove) {
    const templatePath = path.join(packagesPath, template);

    if (fs.existsSync(templatePath)) {
      fs.rmSync(templatePath, { recursive: true, force: true });
    }
  }
}
