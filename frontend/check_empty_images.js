const fs = require('fs');
const path = require('path');

const traverseDir = (dir, callback) => {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      traverseDir(fullPath, callback);
    } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
      callback(fullPath);
    }
  }
};

const srcDir = path.join('e:\\NCKH\\Project-game-NCKH\\frontend\\src');
let emptyOccurrences = [];

traverseDir(srcDir, (filePath) => {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, index) => {
    // Check if line contains properties that usually hold image links
    if (/image:|imageUrl:|avatar:|bgImage:/i.test(line)) {
      // Check if it's assigned an empty string "" or '' or ``
      if (/:\s*(['"`]\s*['"`]|[nN]ull|[uU]ndefined)/.test(line)) {
         emptyOccurrences.push(`FILE: ${filePath.split('\\').pop()}:${index+1} -> ${line.trim()}`);
      }
    }
  });
});

console.log('--- EMPTY/NULL IMAGE LINKS ---');
emptyOccurrences.forEach(o => console.log(o));
if (emptyOccurrences.length === 0) console.log('None found.');
