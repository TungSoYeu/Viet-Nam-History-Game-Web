const path = require("path");
const dotenv = require("dotenv");
const connectDB = require("../config/db");
const { crosswordSets } = require("../data/theme4GameData");
const {
  getTheme4ContentForWrite,
  replaceTheme4Content,
} = require("../services/theme4ContentService");

dotenv.config({
  path: path.join(__dirname, "..", ".env"),
  override: true,
});

async function main() {
  try {
    await connectDB();

    const content = await getTheme4ContentForWrite();
    const previousSets = Array.isArray(content?.gameData?.crosswordSets)
      ? content.gameData.crosswordSets
      : [];

    content.gameData = {
      ...(content.gameData || {}),
      crosswordSets: JSON.parse(JSON.stringify(crosswordSets)),
    };

    const saved = await replaceTheme4Content(content);
    const nextSets = Array.isArray(saved?.gameData?.crosswordSets)
      ? saved.gameData.crosswordSets
      : [];

    console.log("Theme 4 crossword sets synced successfully.");
    console.log(`Previous sets: ${previousSets.length}`);
    console.log(`Current sets: ${nextSets.length}`);
    console.log(
      `Keywords: ${nextSets
        .map((set) => (Array.isArray(set.acceptedAnswers) ? set.acceptedAnswers[0] : set.keyword))
        .filter(Boolean)
        .join(" | ")}`
    );

    process.exit(0);
  } catch (error) {
    console.error("Failed to sync Theme 4 crossword sets:", error.message);
    process.exit(1);
  }
}

main();
