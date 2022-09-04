const write = require('fs').writeFileSync;
const { execSync } = require('child_process');
const package = require('./package.json');

console.clear();

console.log('Building')
execSync('npm run build');
console.clear();
console.log('Built')

let [major, minor, patch] = package.version.split('.').map(Number);
patch++;

write('./package.json', JSON.stringify({
    ...package,
    version: `${major}.${minor}.${patch}`
}, null, 2));

console.clear();
console.log('Ready to publish');