const path = require("path");
const dotenv = require("dotenv");
const connectDB = require("../config/db");
const theme4Modes = require("../data/theme4Modes");
const { picturePuzzleItems } = require("../data/theme4GameData");
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
    const previousItems = Array.isArray(content?.gameData?.picturePuzzleItems)
      ? content.gameData.picturePuzzleItems
      : [];

    content.gameData = {
      ...(content.gameData || {}),
      picturePuzzleItems: JSON.parse(JSON.stringify(picturePuzzleItems)),
    };

    if (Array.isArray(content.modes)) {
      const sourceMode = theme4Modes.find((mode) => mode.id === "picture-puzzle");
      content.modes = content.modes.map((mode) =>
        mode?.id === "picture-puzzle" && sourceMode
          ? { ...mode, ...sourceMode }
          : mode
      );
    }

    if (Array.isArray(content?.requirements?.notes)) {
      content.requirements.notes = content.requirements.notes.map((note) =>
        typeof note === "string" &&
        (/^Đuổi hình bắt chữ:/i.test(note) ||
          /^Xâu chuỗi diễn biến:/i.test(note))
          ? "Xâu chuỗi diễn biến: xem video tư liệu rồi sắp xếp các khung hình theo đúng trình tự thời gian của sự kiện lịch sử."
          : note
      );
    }

    const saved = await replaceTheme4Content(content);
    const nextItems = Array.isArray(saved?.gameData?.picturePuzzleItems)
      ? saved.gameData.picturePuzzleItems
      : [];

    console.log("Theme 4 picture puzzle items synced successfully.");
    console.log(`Previous items: ${previousItems.length}`);
    console.log(`Current items: ${nextItems.length}`);
    console.log(
      `Titles: ${nextItems.map((item) => item.title || item.id).join(" | ")}`
    );

    process.exit(0);
  } catch (error) {
    console.error("Failed to sync Theme 4 picture puzzle items:", error.message);
    process.exit(1);
  }
}

main();
