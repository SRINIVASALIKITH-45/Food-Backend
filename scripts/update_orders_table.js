const mysql = require('mysql2/promise');

async function updateOrdersTable() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'likithliki90',
        database: 'food_delivery_admin'
    });

    try {
        console.log('Updating orders table for Dine-in support...');
        const [columns] = await connection.query('SHOW COLUMNS FROM orders');
        const columnNames = columns.map(c => c.Field);

        if (!columnNames.includes('table_id')) {
            console.log('Adding table_id column...');
            await connection.query('ALTER TABLE orders ADD COLUMN table_id INT NULL AFTER driver_id');
        }

        if (!columnNames.includes('is_dine_in')) {
            console.log('Adding is_dine_in column...');
            await connection.query('ALTER TABLE orders ADD COLUMN is_dine_in BOOLEAN DEFAULT FALSE AFTER total_amount');
        }

        if (!columnNames.includes('order_type')) {
            console.log('Adding order_type column...');
            await connection.query("ALTER TABLE orders ADD COLUMN order_type ENUM('Delivery', 'Dine-in') DEFAULT 'Delivery' AFTER is_dine_in");
        }

        console.log('Database update complete!');
    } catch (err) {
        console.error('Error updating orders table:', err);
    } finally {
        await connection.end();
    }
}

updateOrdersTable();
