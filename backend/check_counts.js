const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Question = require('./models/Question');

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/history-game')
  .then(async () => {
    const counts = await Question.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);
    console.log(JSON.stringify(counts, null, 2));
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
