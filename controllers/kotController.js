const db = require('../config/db');

const createKOT = async (req, res) => {
    try {
        const { order_id, table_id, items, writer_id, customer_name, pax } = req.body;

        // 1. Check for existing active KOT for this table (one KOT per table rule)
        const [existingKOTs] = await db.query(
            `SELECT id, version, items_json FROM kots 
             WHERE table_id = ? AND status IN ('Pending', 'Preparing', 'Ready')
             ORDER BY created_at ASC LIMIT 1`,
            [table_id]
        );

        if (existingKOTs.length > 0) {
            // ── UPDATE existing KOT ──────────────────────────────────────
            const existing = existingKOTs[0];
            const prevItems = typeof existing.items_json === 'string'
                ? JSON.parse(existing.items_json)
                : (existing.items_json || []);

            // Build a map of existing items by product_id OR name
            const mergedMap = {};
            prevItems.forEach(item => {
                const key = item.product_id || item.name;
                mergedMap[key] = { ...item };
            });

            // ADD new quantities on top of existing (not replace)
            const newItems = [];
            items.forEach(newItem => {
                const key = newItem.product_id || newItem.name;
                if (mergedMap[key]) {
                    // Item already exists → ADD the new qty on top
                    mergedMap[key].quantity = (mergedMap[key].quantity || 0) + newItem.quantity;
                    newItems.push({ ...newItem, added_qty: newItem.quantity });
                } else {
                    // Brand new item this round
                    mergedMap[key] = { ...newItem };
                    newItems.push({ ...newItem, added_qty: newItem.quantity });
                }
            });

            const mergedItems = Object.values(mergedMap);
            const newVersion = (existing.version || 1) + 1;

            await db.query(
                `UPDATE kots 
                 SET items_json = ?, new_items_json = ?, version = ?, status = 'Pending', priority = ?, customer_name = ?, pax = ?
                 WHERE id = ?`,
                [
                    JSON.stringify(mergedItems),
                    newItems.length > 0 ? JSON.stringify(newItems) : null,
                    newVersion,
                    req.body.priority || 'Normal',
                    customer_name || null,
                    pax || null,
                    existing.id
                ]
            );

            // Broadcast KOT update to kitchen
            req.io.emit('kotUpdated', {
                id: existing.id,
                table_id,
                writer_id,
                items: mergedItems,
                new_items: newItems,
                version: newVersion,
                status: 'Pending',
                priority: req.body.priority || 'Normal',
                customer_name,
                pax
            });

            return res.status(200).json({
                message: `KOT updated to v${newVersion} for Table ${table_id}`,
                kotId: existing.id,
                version: newVersion,
                isUpdate: true
            });

        } else {
            // ── CREATE new KOT (v1) ──────────────────────────────────────
            const [result] = await db.query(
                `INSERT INTO kots 
                 (order_id, table_id, writer_id, items_json, new_items_json, status, priority, customer_name, pax, version)
                 VALUES (?, ?, ?, ?, NULL, 'Pending', ?, ?, ?, 1)`,
                [
                    order_id || null, 
                    table_id, 
                    writer_id, 
                    JSON.stringify(items), 
                    req.body.priority || 'Normal',
                    customer_name || null, 
                    pax || null
                ]
            );

            const kotId = result.insertId;

            req.io.emit('newKOT', {
                id: kotId,
                table_id,
                writer_id,
                items,
                new_items: null,
                version: 1,
                status: 'Pending',
                priority: req.body.priority || 'Normal',
                customer_name,
                pax,
                created_at: new Date()
            });

            // Update table status to Occupied
            await db.query('UPDATE restaurant_tables SET status = "Occupied" WHERE id = ?', [table_id]);
            req.io.emit('tableStatusUpdate', { id: table_id, status: 'Occupied' });

            return res.status(201).json({
                message: 'KOT generated and sent to kitchen',
                kotId,
                version: 1,
                isUpdate: false
            });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const getKOTsByTable = async (req, res) => {
    try {
        const { table_id } = req.params;
        const [kots] = await db.query(
            'SELECT * FROM kots WHERE table_id = ? AND status != "Served" ORDER BY created_at DESC',
            [table_id]
        );
        res.json(kots);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const updateKOTStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        await db.query('UPDATE kots SET status = ? WHERE id = ?', [status, id]);
        
        req.io.emit('kotStatusUpdate', { id, status });
        
        if (status === 'Served') {
            req.io.emit('kot_completed', { id });
        }

        res.json({ message: 'KOT status updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const getActiveKOTs = async (req, res) => {
    try {
        const [kots] = await db.query(`
            SELECT k.*, t.table_number, w.name as writer_name 
            FROM kots k
            JOIN restaurant_tables t ON k.table_id = t.id
            LEFT JOIN writers w ON k.writer_id = w.id
            WHERE k.status IN ('Pending', 'Preparing', 'Ready')
            ORDER BY k.created_at ASC
        `);
        res.json(kots);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { createKOT, getKOTsByTable, updateKOTStatus, getActiveKOTs };
