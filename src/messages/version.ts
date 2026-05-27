import { readFileSync } from 'node:fs';
import path from 'node:path';

export function version() {
  const packageData = readFileSync(path.join(__dirname, '../../package.json'), 'utf-8');
  const packageJson = JSON.parse(packageData);
  console.log(packageJson.version);
}
