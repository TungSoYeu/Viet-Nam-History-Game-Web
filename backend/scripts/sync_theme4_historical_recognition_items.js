const path = require("path");
const dotenv = require("dotenv");
const connectDB = require("../config/db");
const { historicalRecognitionItems } = require("../data/theme4GameData");
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
    const previousItems = Array.isArray(content?.gameData?.historicalRecognitionItems)
      ? content.gameData.historicalRecognitionItems
      : [];

    content.gameData = {
      ...(content.gameData || {}),
      historicalRecognitionItems: JSON.parse(
        JSON.stringify(historicalRecognitionItems)
      ),
    };

    const saved = await replaceTheme4Content(content);
    const nextItems = Array.isArray(saved?.gameData?.historicalRecognitionItems)
      ? saved.gameData.historicalRecognitionItems
      : [];

    console.log("Theme 4 historical recognition items synced successfully.");
    console.log(`Previous items: ${previousItems.length}`);
    console.log(`Current items: ${nextItems.length}`);
    console.log(
      `Answers: ${nextItems
        .map((item) => (Array.isArray(item.acceptedAnswers) ? item.acceptedAnswers[0] : ""))
        .filter(Boolean)
        .join(" | ")}`
    );

    process.exit(0);
  } catch (error) {
    console.error(
      "Failed to sync Theme 4 historical recognition items:",
      error.message
    );
    process.exit(1);
  }
}

main();
