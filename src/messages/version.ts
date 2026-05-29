import packageJson from '../../package.json' with { type: 'json' };

export function version() {
  console.log(packageJson.version);
}
