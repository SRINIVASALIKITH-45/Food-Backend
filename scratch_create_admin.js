const db = require('./config/db');
const bcrypt = require('bcryptjs');

async function createAdmin() {
    const username = 'admin_root';
    const password = 'admin_password_2026';
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query(
            'INSERT INTO admin (username, password, role) VALUES (?, ?, ?)',
            [username, hashedPassword, 'Admin']
        );
        console.log(`Admin created successfully!`);
        console.log(`Username: ${username}`);
        console.log(`Password: ${password}`);
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            console.log(`Admin '${username}' already exists.`);
        } else {
            console.error('Error creating admin:', error);
        }
    } finally {
        process.exit(0);
    }
}

createAdmin();
