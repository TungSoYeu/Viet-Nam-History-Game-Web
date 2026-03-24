/**
 * Script chuyển toàn bộ data từ MongoDB local sang MongoDB Atlas.
 * 
 * Cách dùng:
 *   node scripts/migrate_to_atlas.js "mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/history_game"
 */

const { MongoClient } = require('mongodb');

const LOCAL_URI = 'mongodb://localhost:27017/history_game';

async function migrate() {
    const ATLAS_URI = process.argv[2];

    if (!ATLAS_URI) {
        console.error('❌ Thiếu Atlas URI!');
        console.error('Cách dùng: node scripts/migrate_to_atlas.js "mongodb+srv://user:pass@cluster.mongodb.net/history_game"');
        process.exit(1);
    }

    console.log('🔗 Kết nối Local MongoDB...');
    const localClient = new MongoClient(LOCAL_URI);
    await localClient.connect();
    const localDb = localClient.db('history_game');

    console.log('🔗 Kết nối MongoDB Atlas...');
    const atlasClient = new MongoClient(ATLAS_URI);
    await atlasClient.connect();
    const atlasDb = atlasClient.db('history_game');

    // Lấy danh sách collections
    const collections = await localDb.listCollections().toArray();
    console.log(`\n📦 Tìm thấy ${collections.length} collections:\n`);

    let totalDocs = 0;

    for (const col of collections) {
        const name = col.name;
        const localCollection = localDb.collection(name);
        const atlasCollection = atlasDb.collection(name);

        // Đếm documents
        const count = await localCollection.countDocuments();
        
        if (count === 0) {
            console.log(`  ⏭️  ${name}: 0 documents (bỏ qua)`);
            continue;
        }

        // Lấy toàn bộ documents
        const docs = await localCollection.find({}).toArray();

        // Xóa data cũ trên Atlas (nếu có) rồi insert mới
        await atlasCollection.deleteMany({});
        await atlasCollection.insertMany(docs);

        console.log(`  ✅ ${name}: ${count} documents → OK`);
        totalDocs += count;
    }

    console.log(`\n🎉 Hoàn tất! Đã chuyển ${totalDocs} documents từ ${collections.length} collections.`);

    await localClient.close();
    await atlasClient.close();
}

migrate().catch(err => {
    console.error('❌ Lỗi:', err.message);
    process.exit(1);
});
