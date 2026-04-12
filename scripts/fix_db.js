const mysql = require('mysql2/promise');
require('dotenv').config();

async function fixKotsTable() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'likithliki90',
        database: 'food_delivery_admin'
    });

    try {
        console.log('Checking kots table structure...');
        const [columns] = await connection.query('SHOW COLUMNS FROM kots');
        const columnNames = columns.map(c => c.Field);
        
        console.log('Current columns:', columnNames);

        const columnsToAdd = [
            { name: 'priority', type: "ENUM('Normal', 'Urgent', 'VIP') DEFAULT 'Normal' AFTER status" },
            { name: 'customer_name', type: 'VARCHAR(100) AFTER priority' },
            { name: 'pax', type: 'INT AFTER customer_name' },
            { name: 'version', type: 'INT DEFAULT 1 AFTER pax' },
            { name: 'new_items_json', type: 'JSON NULL AFTER items_json' }
        ];

        for (const col of columnsToAdd) {
            if (!columnNames.includes(col.name)) {
                console.log(`Adding column: ${col.name}`);
                await connection.query(`ALTER TABLE kots ADD COLUMN ${col.name} ${col.type}`);
            } else {
                console.log(`Column ${col.name} already exists.`);
            }
        }

        console.log('Table fix complete!');
    } catch (err) {
        console.error('Error fixing table:', err);
    } finally {
        await connection.end();
    }
}

fixKotsTable();
