const path = require("path");
const dotenv = require("dotenv");
const connectDB = require("../config/db");
const { historicalFlowSets } = require("../data/theme4GameData");
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
    const previousSets = Array.isArray(content?.gameData?.historicalFlowSets)
      ? content.gameData.historicalFlowSets
      : [];

    content.gameData = {
      ...(content.gameData || {}),
      historicalFlowSets: JSON.parse(JSON.stringify(historicalFlowSets)),
      historicalFlowSet: historicalFlowSets[0] || null,
    };

    const saved = await replaceTheme4Content(content);
    const nextSets = Array.isArray(saved?.gameData?.historicalFlowSets)
      ? saved.gameData.historicalFlowSets
      : [];

    console.log("Theme 4 historical flow sets synced successfully.");
    console.log(`Previous sets: ${previousSets.length}`);
    console.log(`Current sets: ${nextSets.length}`);
    console.log(
      `Titles: ${nextSets.map((set) => set.title).filter(Boolean).join(" | ")}`
    );

    process.exit(0);
  } catch (error) {
    console.error("Failed to sync Theme 4 historical flow sets:", error.message);
    process.exit(1);
  }
}

main();
