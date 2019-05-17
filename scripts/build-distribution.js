const shell = require('shelljs');

shell.exec('./node_modules/.bin/tsc && tscpaths -p tsconfig.json -s ./src -o ./dist');

const sourceDir = './src/contracts/';
const destDir = './dist/contracts/';

shell.cp(`${sourceDir}MonethaClaimHandler.d.ts`, destDir);
shell.cp(`${sourceDir}MonethaToken.d.ts`, destDir);
shell.cp(`${sourceDir}types.d.ts`, destDir);
