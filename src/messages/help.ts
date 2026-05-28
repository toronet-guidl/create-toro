export function help() {
  console.log();
  console.log('Usage: npx create-toro@latest [options]');
  console.log();
  console.log('Options:');
  console.log('  --name, -n       Specify the project name');
  console.log(
    "  --solidity-framework, -f   Specify the Solidity framework to use (e.g., 'hardhat', 'foundry' or 'none')",
  );
  console.log();
  console.log('  --version, -v    Show the version number');
  console.log('  --help, -h       Show this help message');
  console.log();
  console.log('Example:');
  console.log('  npx create-toro@latest --name my-toro-project --solidity-framework foundry');
  console.log();
}
