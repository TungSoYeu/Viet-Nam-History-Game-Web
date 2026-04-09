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
const imagesDir = path.join('e:\\NCKH\\Project-game-NCKH\\frontend\\public\\assets\\images');

let missingImages = new Set();
let matchedImages = new Set();

const regexUrl = /\/assets\/images\/([a-zA-Z0-9_\-\.\/]+)/g;
const regexPicture = /picturePuzzleImage\(['"](.*?)['"]\)/g;
const regexLocal = /localImage\(['"](.*?)['"]\)/g;
const regexAvatar = /avatar:\s*['"](.*?)['"]/g;

traverseDir(srcDir, (filePath) => {
  const content = fs.readFileSync(filePath, 'utf8');
  let match;
  
  while ((match = regexUrl.exec(content)) !== null) {
      const imgPath = match[1];
      if (!fs.existsSync(path.join(imagesDir, imgPath))) missingImages.add(imgPath);
      else matchedImages.add(imgPath);
  }
  while ((match = regexLocal.exec(content)) !== null) {
     const imgPath = match[1];
     if (!fs.existsSync(path.join(imagesDir, imgPath))) missingImages.add(imgPath);
     else matchedImages.add(imgPath);
  }
  while ((match = regexPicture.exec(content)) !== null) {
     const imgPath = 'picture-puzzle/' + match[1];
     if (!fs.existsSync(path.join(imagesDir, imgPath))) missingImages.add(imgPath);
     else matchedImages.add(imgPath);
  }
  while ((match = regexAvatar.exec(content)) !== null) {
     const imgPath = match[1];
     if (imgPath.startsWith('http')) continue;
     if (!fs.existsSync(path.join(imagesDir, imgPath))) missingImages.add(imgPath);
     else matchedImages.add(imgPath);
  }
});

console.log('--- MISSING IMAGES in public/assets/images/ ---');
Array.from(missingImages).forEach(img => {
   console.log(`MISSING: ${img}`);
});
console.log(`\nTotal Missing: ${missingImages.size}, Total Found: ${matchedImages.size}`);
