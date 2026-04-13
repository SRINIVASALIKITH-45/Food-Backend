const db = require('./config/db');

async function checkDrivers() {
    try {
        const [drivers] = await db.query('SELECT * FROM drivers');
        console.log('Drivers:', JSON.stringify(drivers, null, 2));
        
        const [kitchen] = await db.query('SELECT * FROM kitchen_staff');
        console.log('Kitchen Staff:', JSON.stringify(kitchen, null, 2));

        const [writers] = await db.query('SELECT * FROM writers');
        console.log('Writers:', JSON.stringify(writers, null, 2));
    } catch (error) {
        console.error('Error querying DB:', error);
    } finally {
        process.exit(0);
    }
}

checkDrivers();
