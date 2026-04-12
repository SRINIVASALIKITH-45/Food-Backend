const db = require('../config/db');

const logActivity = async (adminId, action, details) => {
    try {
        await db.execute(
            'INSERT INTO admin_logs (admin_id, action, details) VALUES (?, ?, ?)',
            [adminId, action, JSON.stringify(details)]
        );
    } catch (error) {
        console.error('Failed to log admin activity:', error);
    }
};

module.exports = logActivity;
