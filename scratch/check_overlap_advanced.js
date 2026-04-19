import fs from "fs";
import path from "path";

const dataPath = path.resolve("frontend/src/data/theme4GameData.js");
const dataContent = fs.readFileSync(dataPath, "utf-8");

const regex = /q:\s*["'](.*?)["'],\s*a:\s*["'](.*?)["']/g;
let match;
const overlaps = [];

function normalize(str) {
  return str.toLowerCase().replace(/[.,!?'"]/g, "");
}

while ((match = regex.exec(dataContent)) !== null) {
  const qOrig = match[1];
  const aOrig = match[2];
  const q = normalize(qOrig);
  const a = normalize(aOrig);
  
  const words = a.split(" ").filter(w => w.length > 2);
  const overlappingWords = words.filter(w => q.includes(w));
  
  if (overlappingWords.length > 0) {
    overlaps.push({ q: qOrig, a: aOrig, overlappingWords });
  }
}

const cwRegex = /question:\s*["'](.*?)["'],\s*options:\s*\[(.*?)\],\s*correctAnswer:\s*["'](.*?)["']/g;
while ((match = cwRegex.exec(dataContent)) !== null) {
  const qOrig = match[1];
  const aOrig = match[3];
  const q = normalize(qOrig);
  const a = normalize(aOrig);
  
  const words = a.split(" ").filter(w => w.length > 2);
  const overlappingWords = words.filter(w => q.includes(w));
  
  if (overlappingWords.length > 0) {
    overlaps.push({ type: "crossword", q: qOrig, a: aOrig, overlappingWords });
  }
}

console.log("Found Overlaps:", overlaps.length);
console.log(JSON.stringify(overlaps, null, 2));
