const db = require('../config/db');
const logActivity = require('../middlewares/activityLogger');

const getSettings = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM settings');
        const settings = {};
        rows.forEach(item => {
            settings[item.setting_key] = item.setting_value;
        });
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching settings', error });
    }
};

const updateSetting = async (req, res) => {
    const { settings } = req.body; // Expecting an object { key: value, ... }
    try {
        for (const [key, value] of Object.entries(settings)) {
            await db.execute(
                'UPDATE settings SET setting_value = ? WHERE setting_key = ?',
                [String(value), key]
            );
        }
        await logActivity(req.user.id, 'Update Settings', settings);
        res.json({ message: 'Settings updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating settings', error });
    }
};

const getDeliveryZones = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM delivery_zones');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching delivery zones', error });
    }
};

const addDeliveryZone = async (req, res) => {
    const { zone_name } = req.body;
    try {
        await db.execute('INSERT INTO delivery_zones (zone_name) VALUES (?)', [zone_name]);
        await logActivity(req.user.id, 'Add Delivery Zone', { zone_name });
        res.json({ message: 'Delivery zone added' });
    } catch (error) {
        res.status(500).json({ message: 'Error adding delivery zone', error });
    }
};

const deleteDeliveryZone = async (req, res) => {
    const { id } = req.params;
    try {
        await db.execute('DELETE FROM delivery_zones WHERE id = ?', [id]);
        await logActivity(req.user.id, 'Delete Delivery Zone', { id });
        res.json({ message: 'Delivery zone deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting delivery zone', error });
    }
};

const getAdminLogs = async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT al.*, a.username 
            FROM admin_logs al 
            JOIN admin a ON al.admin_id = a.id 
            ORDER BY al.created_at DESC 
            LIMIT 100
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching admin logs', error });
    }
};

module.exports = {
    getSettings,
    updateSetting,
    getDeliveryZones,
    addDeliveryZone,
    deleteDeliveryZone,
    getAdminLogs
};
