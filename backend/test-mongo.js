const { MongoClient } = require('mongodb');
const uri = process.env.MONGO_URI || "mongodb+srv://tungnghienhy:tvantung1904@projecnckh.qlbvlo3.mongodb.net/history_game";

async function run() {
  console.log("Testing connection to:", uri);
  const client = new MongoClient(uri, {
    family: 4 // Force IPv4
  });

  try {
    await client.connect();
    console.log("Connected successfully to server");
    await client.close();
  } catch (error) {
    console.error("Connection failed:", error.message);
  }
}

run();
