import fs from "fs";
import path from "path";

const dataPath = path.resolve("frontend/src/data/theme4GameData.js");
const dataContent = fs.readFileSync(dataPath, "utf-8");

// We'll roughly parse questions using regex
const regex = /q:\s*["'](.*?)["'],\s*a:\s*["'](.*?)["']/g;
let match;
const overlaps = [];

while ((match = regex.exec(dataContent)) !== null) {
  const q = match[1];
  const a = match[2];
  // check if q contains a (case insensitive)
  if (a.length > 2 && q.toLowerCase().includes(a.toLowerCase())) {
    overlaps.push({ q, a });
  }
}

const cwRegex = /question:\s*["'](.*?)["'],\s*options:\s*\[(.*?)\],\s*correctAnswer:\s*["'](.*?)["']/g;
while ((match = cwRegex.exec(dataContent)) !== null) {
  const q = match[1];
  const a = match[3];
  if (a.length > 2 && q.toLowerCase().includes(a.toLowerCase())) {
    overlaps.push({ q, a });
  }
}

console.log("Found Overlaps:");
console.log(JSON.stringify(overlaps, null, 2));
