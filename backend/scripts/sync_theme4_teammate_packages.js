const path = require("path");
const dotenv = require("dotenv");
const connectDB = require("../config/db");
const {
  getTheme4ContentForWrite,
  replaceTheme4Content,
} = require("../services/theme4ContentService");
const { teammatePackages } = require("../data/theme4GameData");

dotenv.config({
  path: path.join(__dirname, "..", ".env"),
  override: true,
});

async function main() {
  try {
    await connectDB();

    const content = await getTheme4ContentForWrite();
    const previousPackages = Array.isArray(content?.gameData?.teammatePackages)
      ? content.gameData.teammatePackages
      : [];

    content.gameData = {
      ...(content.gameData || {}),
      teammatePackages: JSON.parse(JSON.stringify(teammatePackages)),
    };

    const saved = await replaceTheme4Content(content);
    const nextPackages = Array.isArray(saved?.gameData?.teammatePackages)
      ? saved.gameData.teammatePackages
      : [];

    console.log("Theme 4 teammate packages synced successfully.");
    console.log(`Previous packages: ${previousPackages.length}`);
    console.log(`Current packages: ${nextPackages.length}`);
    console.log(
      `Titles: ${nextPackages.map((pkg) => pkg.title).join(", ")}`
    );

    process.exit(0);
  } catch (error) {
    console.error("Failed to sync Theme 4 teammate packages:", error.message);
    process.exit(1);
  }
}

main();
