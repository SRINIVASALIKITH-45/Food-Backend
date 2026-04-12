const db = require('../config/db');

const getTables = async (req, res) => {
    try {
        const [tables] = await db.query('SELECT * FROM restaurant_tables ORDER BY id ASC');
        res.json(tables);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const updateTableStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, current_order_id, customer_name, customer_phone, customer_email, pax } = req.body;
        
        await db.query(
            'UPDATE restaurant_tables SET status = ?, current_order_id = ?, customer_name = ?, customer_phone = ?, customer_email = ?, pax = ? WHERE id = ?', 
            [status, current_order_id || null, customer_name || null, customer_phone || null, customer_email || null, pax || null, id]
        );
        
        // Broadcast via socket
        req.io.emit('tableStatusUpdate', { 
            id, 
            status, 
            current_order_id,
            customer_name,
            pax 
        });
        
        res.json({ message: 'Table status updated with customer details' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const mergeTables = async (req, res) => {
    try {
        const { tableIds, mainTableId } = req.body; // Array of IDs to merge into mainTableId
        
        // This is a simplified logic marking all as occupied and linking to the same order if needed
        // For now, let's just update statuses
        await db.query('UPDATE restaurant_tables SET status = "Occupied" WHERE id IN (?)', [tableIds]);
        
        req.io.emit('tablesMerged', { tableIds, mainTableId });
        
        res.json({ message: 'Tables merged successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getTables, updateTableStatus, mergeTables };
