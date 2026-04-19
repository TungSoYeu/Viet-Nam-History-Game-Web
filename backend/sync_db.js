const mongoose = require('mongoose');
const Theme4Content = require('./models/Theme4Content');
const { theme4Content } = require('./data/theme4DefaultContent');
require('dotenv').config({ path: './.env' });

async function sync() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const doc = await Theme4Content.findOne({ singletonKey: 'theme4' });
    if (doc) {
      doc.content.gameData.revealPictureSets = theme4Content.gameData.revealPictureSets;
      // ensure admin ids
      for (const item of doc.content.gameData.revealPictureSets) {
        if (!item._adminId) {
          item._adminId = require('crypto').randomUUID();
        }
      }
      
      // We need to tell mongoose that the mixed type was modified
      doc.markModified('content');
      
      await doc.save();
      console.log('Updated revealPictureSets in DB successfully');
    } else {
      console.log('No theme4 doc found in DB, standard fallback will happen');
    }
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}
sync();
