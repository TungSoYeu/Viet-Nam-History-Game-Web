const fs = require("fs");
const path = require("path");
const { put } = require("@vercel/blob");
const {
  createTheme4ModeItem,
  deleteTheme4ModeItem,
  getModeItems,
  getModeDataKey,
  getTheme4Content,
  replaceTheme4Content,
  syncDefaultTheme4Content,
  updateTheme4ModeItem,
} = require("../services/theme4ContentService");

function getTheme4Options(req) {
  return req.theme4Options || {};
}

exports.getTheme4Content = async (req, res) => {
  try {
    const content = await getTheme4Content(getTheme4Options(req));
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: "Unable to load Theme 4 content", error: error.message });
  }
};

exports.getTheme4Modes = async (req, res) => {
  try {
    const content = await getTheme4Content(getTheme4Options(req));
    res.json({
      theme: content.theme,
      lessons: content.lessons,
      requirements: content.requirements,
      modes: content.modes || [],
      meta: content.meta || {},
    });
  } catch (error) {
    res.status(500).json({ message: "Unable to load Theme 4 modes", error: error.message });
  }
};

exports.getTheme4Mode = async (req, res) => {
  try {
    const content = await getTheme4Content(getTheme4Options(req));
    const mode = (content.modes || []).find((item) => item.id === req.params.modeId);

    if (!mode) {
      return res.status(404).json({ message: "Theme 4 mode not found" });
    }

    const dataKey = getModeDataKey(mode.id);
    const data = dataKey ? content.gameData?.[dataKey] : null;

    res.json({
      theme: content.theme,
      lessons: content.lessons,
      requirements: content.requirements,
      mode,
      dataKey,
      data,
      meta: content.meta || {},
    });
  } catch (error) {
    res.status(500).json({ message: "Unable to load Theme 4 mode", error: error.message });
  }
};

exports.replaceTheme4Content = async (req, res) => {
  try {
    const nextContent = req.body?.content || req.body;

    if (!nextContent || !Array.isArray(nextContent.modes) || !nextContent.gameData) {
      return res.status(400).json({
        message: "Theme 4 content must include modes and gameData",
      });
    }

    const saved = await replaceTheme4Content(nextContent, getTheme4Options(req));
    res.json({ success: true, content: saved });
  } catch (error) {
    res.status(500).json({ message: "Unable to save Theme 4 content", error: error.message });
  }
};

exports.syncTheme4Defaults = async (req, res) => {
  try {
    const saved = await syncDefaultTheme4Content(getTheme4Options(req));
    res.json({ success: true, content: saved });
  } catch (error) {
    res.status(500).json({ message: "Unable to sync Theme 4 defaults", error: error.message });
  }
};

exports.getTheme4ModeItems = async (req, res) => {
  try {
    const content = await getTheme4Content(getTheme4Options(req));
    const mode = (content.modes || []).find((item) => item.id === req.params.modeId);

    if (!mode) {
      return res.status(404).json({ message: "Theme 4 mode not found" });
    }

    const dataKey = getModeDataKey(mode.id);
    const items = getModeItems(content, mode.id);

    return res.json({
      success: true,
      mode,
      dataKey,
      items,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to load Theme 4 admin items",
      error: error.message,
    });
  }
};

exports.createTheme4ModeItem = async (req, res) => {
  try {
    const item = await createTheme4ModeItem(
      req.params.modeId,
      req.body?.item || req.body,
      getTheme4Options(req)
    );
    return res.json({ success: true, item });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to create Theme 4 item",
      error: error.message,
    });
  }
};

exports.updateTheme4ModeItem = async (req, res) => {
  try {
    const item = await updateTheme4ModeItem(
      req.params.modeId,
      req.params.itemId,
      req.body?.item || req.body,
      getTheme4Options(req)
    );
    return res.json({ success: true, item });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to update Theme 4 item",
      error: error.message,
    });
  }
};

exports.deleteTheme4ModeItem = async (req, res) => {
  try {
    const items = await deleteTheme4ModeItem(
      req.params.modeId,
      req.params.itemId,
      getTheme4Options(req)
    );
    return res.json({ success: true, items });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to delete Theme 4 item",
      error: error.message,
    });
  }
};

exports.uploadTheme4Image = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng chọn ảnh để tải lên.",
      });
    }

    const ext = path.extname(req.file.originalname || "").toLowerCase() || ".png";
    const filename = `theme4-${Date.now()}-${Math.random().toString(36).slice(2, 10)}${ext}`;
    let imageUrl = "";

    if (process.env.VERCEL || process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(`theme4/${filename}`, req.file.buffer, {
        access: "public",
        contentType: req.file.mimetype,
      });
      imageUrl = blob.url;
    } else {
      const uploadDir = path.join(__dirname, "..", "uploads", "theme4");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const localPath = path.join(uploadDir, filename);
      fs.writeFileSync(localPath, req.file.buffer);
      imageUrl = `${req.protocol}://${req.get("host")}/uploads/theme4/${filename}`;
    }

    return res.json({
      success: true,
      imageUrl,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to upload Theme 4 image",
      error: error.message,
    });
  }
};
