import fs from "fs";
import path from "path";

const dir = "frontend/src/pages";
const files = fs.readdirSync(dir);

let count = 0;
files.forEach(file => {
  if (file.endsWith(".js") || file.endsWith(".jsx")) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, "utf-8");
    let changed = false;

    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
       if (lines[i].includes('theme-page') && lines[i].includes('overflow-hidden')) {
           lines[i] = lines[i].replace('overflow-hidden', 'overflow-y-auto overflow-x-hidden custom-scrollbar');
           changed = true;
       }
    }
    
    // Custom fix for HomePage
    for (let i = 0; i < lines.length; i++) {
       if (file === "HomePage.js" && lines[i].includes('homepage-shell') && lines[i].includes('lg:overflow-hidden')) {
           lines[i] = lines[i].replace('lg:overflow-hidden', 'lg:overflow-y-auto');
           changed = true;
       }
    }

    if (changed) {
      fs.writeFileSync(filePath, lines.join('\n'));
      console.log("Fixed " + file);
      count++;
    }
  }
});
console.log("Fixed files count:", count);
