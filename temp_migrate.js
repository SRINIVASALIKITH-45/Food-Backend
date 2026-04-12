const db = require('./config/db');
const bcrypt = require('bcryptjs');

async function migrate() {
    try {
        console.log("Starting migration...");
        
        // 1. Create kitchen_staff table
        await db.query(`
            CREATE TABLE IF NOT EXISTS kitchen_staff (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                phone VARCHAR(20) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                is_active BOOLEAN DEFAULT true,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log("Table 'kitchen_staff' created or exists.");

        // 2. Seed default kitchen staff
        const hashed = await bcrypt.hash('kitchen123', 10);
        await db.query(`
            INSERT IGNORE INTO kitchen_staff (id, name, phone, password) 
            VALUES (1, 'Head Chef', '8888888888', ?)
        `, [hashed]);
        console.log("Default kitchen staff seeded.");

        console.log("Migration completed successfully.");
    } catch (error) {
        console.error("Migration failed:", error);
    } finally {
        process.exit();
    }
}

migrate();
