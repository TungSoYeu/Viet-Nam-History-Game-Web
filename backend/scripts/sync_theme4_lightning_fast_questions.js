const path = require("path");
const dotenv = require("dotenv");
const connectDB = require("../config/db");
const { lightningFastQuestions } = require("../data/theme4GameData");
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
    const previousQuestions = Array.isArray(content?.gameData?.lightningFastQuestions)
      ? content.gameData.lightningFastQuestions
      : [];

    content.gameData = {
      ...(content.gameData || {}),
      lightningFastQuestions: JSON.parse(JSON.stringify(lightningFastQuestions)),
    };

    const saved = await replaceTheme4Content(content);
    const nextQuestions = Array.isArray(saved?.gameData?.lightningFastQuestions)
      ? saved.gameData.lightningFastQuestions
      : [];

    console.log("Theme 4 lightning-fast questions synced successfully.");
    console.log(`Previous questions: ${previousQuestions.length}`);
    console.log(`Current questions: ${nextQuestions.length}`);
    console.log(
      `First questions: ${nextQuestions
        .slice(0, 5)
        .map((question) => question.content)
        .filter(Boolean)
        .join(" | ")}`
    );

    process.exit(0);
  } catch (error) {
    console.error("Failed to sync Theme 4 lightning-fast questions:", error.message);
    process.exit(1);
  }
}

main();
