const path = require("path");
const dotenv = require("dotenv");
const connectDB = require("../config/db");
const { revealPictureSets } = require("../data/theme4GameData");
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
    const previousItems = Array.isArray(content?.gameData?.revealPictureSets)
      ? content.gameData.revealPictureSets
      : [];

    content.gameData = {
      ...(content.gameData || {}),
      revealPictureSets: JSON.parse(JSON.stringify(revealPictureSets)),
    };

    const saved = await replaceTheme4Content(content);
    const nextItems = Array.isArray(saved?.gameData?.revealPictureSets)
      ? saved.gameData.revealPictureSets
      : [];

    console.log("Theme 4 reveal picture sets synced successfully.");
    console.log(`Previous items: ${previousItems.length}`);
    console.log(`Current items: ${nextItems.length}`);
    console.log(
      `Answers: ${nextItems.map((item) => item.answer).join(" | ")}`
    );

    process.exit(0);
  } catch (error) {
    console.error("Failed to sync Theme 4 reveal picture sets:", error.message);
    process.exit(1);
  }
}

main();
