const db = require('./config/db');

async function test() {
    try {
        const [result] = await db.query(
            'INSERT INTO saved_addresses (customer_id, label, address, is_default) VALUES (?, ?, ?, ?)',
            [1, 'Work', '123 Main St', false]
        );
        console.log(result);
    } catch (e) {
        console.log("SQL ERROR: ", e.message);
    }
    process.exit(0);
}
test();
