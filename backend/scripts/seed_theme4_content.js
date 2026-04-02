const path = require("path");
const dotenv = require("dotenv");
const connectDB = require("../config/db");
const { syncDefaultTheme4Content } = require("../services/theme4ContentService");

dotenv.config({
  path: path.join(__dirname, "..", ".env"),
  override: true,
});

async function main() {
  try {
    await connectDB();
    const saved = await syncDefaultTheme4Content();

    console.log("Theme 4 content synced successfully.");
    console.log(`Modes: ${(saved.modes || []).length}`);
    console.log(
      `Data sets: ${Object.keys(saved.gameData || {}).join(", ")}`
    );

    process.exit(0);
  } catch (error) {
    console.error("Failed to sync Theme 4 content:", error.message);
    process.exit(1);
  }
}

main();
