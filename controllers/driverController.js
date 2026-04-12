const db = require('../config/db');
const bcrypt = require('bcryptjs');
const { sendOutForDeliveryEmail, sendDeliveryOTPEmail, sendOrderDeliveredEmail } = require('../services/emailService');

const getDrivers = async (req, res) => {
    try {
        const [drivers] = await db.query('SELECT * FROM drivers');
        res.json(drivers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const createDriver = async (req, res) => {
    try {
        const { name, phone, vehicle_details, password } = req.body;
        const passToHash = password || 'driver123';
        const hashedPassword = await bcrypt.hash(passToHash, 10);
        
        const [result] = await db.query(
            'INSERT INTO drivers (name, phone, vehicle_details, password) VALUES (?, ?, ?, ?)', 
            [name, phone, vehicle_details, hashedPassword]
        );
        res.status(201).json({ message: 'Driver created', id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const updateDriver = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, phone, vehicle_details, password } = req.body;
        
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            await db.query(
                'UPDATE drivers SET name=?, phone=?, vehicle_details=?, password=? WHERE id=?', 
                [name, phone, vehicle_details, hashedPassword, id]
            );
        } else {
            await db.query(
                'UPDATE drivers SET name=?, phone=?, vehicle_details=? WHERE id=?', 
                [name, phone, vehicle_details, id]
            );
        }
        res.json({ message: 'Driver updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const toggleActiveDriver = async (req, res) => {
    try {
        const { id } = req.params;
        const [driver] = await db.query('SELECT is_active FROM drivers WHERE id = ?', [id]);
        if(driver.length === 0) return res.status(404).json({ message: 'Not found' });
        
        const newValue = !driver[0].is_active;
        await db.query('UPDATE drivers SET is_active = ? WHERE id = ?', [newValue, id]);
        res.json({ message: 'Driver status updated', is_active: newValue });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Driver App: Get available broadcasted orders
const getAvailableOrders = async (req, res) => {
    try {
        const driverId = req.user.id;

        // CRITICAL CHECK: If this driver already has an active 'Out for Delivery' order, hide available requests.
        const [activeOrders] = await db.query('SELECT id FROM orders WHERE driver_id = ? AND status = "Out for Delivery"', [driverId]);
        
        if (activeOrders.length > 0) {
            return res.json([]); // Driver is busy
        }

        const [orders] = await db.query(`
            SELECT id, order_id_string, total_amount, delivery_address, customer_name, customer_phone, payment_method, estimated_delivery_time, created_at
            FROM orders 
            WHERE status = 'Order Accepted' AND driver_id IS NULL
            ORDER BY created_at ASC
        `);
        // add items
        for (const order of orders) {
            const [items] = await db.query(`
                SELECT oi.quantity, p.name 
                FROM order_items oi
                JOIN products p ON oi.product_id = p.id
                WHERE oi.order_id = ?
            `, [order.id]);
            order.items = items;
        }
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Driver App: Accept an order
const acceptOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const driverId = req.user.id;
        
        // 1. Ensure driver is online
        const [driver] = await db.query('SELECT is_active FROM drivers WHERE id = ?', [driverId]);
        if (!driver[0].is_active) {
            return res.status(403).json({ message: 'You must be online to accept orders' });
        }

        // 2. Ensure driver is not already busy
        const [activeOrders] = await db.query('SELECT id FROM orders WHERE driver_id = ? AND status = "Out for Delivery"', [driverId]);
        if (activeOrders.length > 0) {
            return res.status(400).json({ message: 'You cannot accept a new order until the current one is delivered.' });
        }

        // 3. Try to claim
        const [result] = await db.query(`
            UPDATE orders 
            SET driver_id = ?, status = 'Out for Delivery' 
            WHERE id = ? AND status = 'Order Accepted' AND driver_id IS NULL
        `, [driverId, orderId]);

        if (result.affectedRows === 0) {
            return res.status(400).json({ message: 'Order already accepted or invalid status' });
        }

        // Emit hiding it from other drivers
        req.io.emit('orderAccepted', { id: orderId });
        req.io.emit('orderStatusUpdate', { id: orderId, status: 'Out for Delivery' });

        res.json({ message: 'Order accepted' });

        // Trigger Out for Delivery Email
        (async () => {
             const [orderInfo] = await db.query(`
                SELECT o.order_id_string, o.delivery_address, c.name as customer_name, c.email as customer_email, d.name as driver_name, d.phone as driver_phone
                FROM orders o
                JOIN customers c ON o.customer_id = c.id
                JOIN drivers d ON o.driver_id = d.id
                WHERE o.id = ?
            `, [orderId]);
            if (orderInfo.length > 0) {
                const info = orderInfo[0];
                sendOutForDeliveryEmail(info.customer_email, info.customer_name, info.order_id_string, info.driver_name, info.driver_phone, info.delivery_address);
            }
        })();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Driver App: Get currently active delivery or past deliveries
const getMyDeliveries = async (req, res) => {
    try {
        const driverId = req.user.id;
        const { filter } = req.query; // 'active' or 'past'
        
        let query = `
            SELECT o.* 
            FROM orders o 
            WHERE o.driver_id = ?
        `;
        
        if (filter === 'active') {
            query += " AND o.status = 'Out for Delivery'";
        } else {
            query += " AND o.status = 'Delivered'";
        }
        query += " ORDER BY o.created_at DESC";

        const [orders] = await db.query(query, [driverId]);

        for (const order of orders) {
            const [items] = await db.query(`
                SELECT oi.quantity, p.name 
                FROM order_items oi
                JOIN products p ON oi.product_id = p.id
                WHERE oi.order_id = ?
            `, [order.id]);
            order.items = items;
        }

        res.json(filter === 'active' ? (orders.length > 0 ? orders[0] : null) : orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Driver App: Mark Arrival at Customer Location
const markArrived = async (req, res) => {
    try {
        const orderId = req.params.id;
        const driverId = req.user.id;
        
        const [result] = await db.execute(
            'UPDATE orders SET is_arrived = true WHERE id = ? AND driver_id = ? AND status = "Out for Delivery"',
            [orderId, driverId]
        );

        if (result.affectedRows === 0) return res.status(400).json({ message: 'Update failed' });

        req.io.emit('driverArrived', { id: orderId });
        res.json({ message: 'Arrival marked. Please verify OTP with customer.' });

        // Trigger Delivery OTP Email
        (async () => {
             const [orderInfo] = await db.query(`
                SELECT o.delivery_otp, c.name as customer_name, c.email as customer_email, d.name as driver_name
                FROM orders o
                JOIN customers c ON o.customer_id = c.id
                JOIN drivers d ON o.driver_id = d.id
                WHERE o.id = ?
            `, [orderId]);
            if (orderInfo.length > 0) {
                const info = orderInfo[0];
                sendDeliveryOTPEmail(info.customer_email, info.customer_name, info.delivery_otp, info.driver_name);
            }
        })();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Driver App: Verify OTP and Complete Delivery
const verifyDelivery = async (req, res) => {
    try {
        const orderId = req.params.id;
        const driverId = req.user.id;
        const { otp } = req.body;

        const [orders] = await db.query(
            'SELECT delivery_otp, otp_expiry, total_amount FROM orders WHERE id = ? AND driver_id = ?',
            [orderId, driverId]
        );

        if (orders.length === 0) return res.status(404).json({ message: 'Order not found' });
        const order = orders[0];

        // 1. Check Expiry
        if (new Date() > new Date(order.otp_expiry)) {
            return res.status(400).json({ message: 'OTP has expired. Contact support.' });
        }

        // 2. Verify OTP
        if (order.delivery_otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP. Please check with customer.' });
        }

        // 3. Mark Delivered and Calculate Commission (Fixed ₹30 per delivery)
        const commission = 30.00;
        await db.execute(
            'UPDATE orders SET status = "Delivered", commission_amount = ? WHERE id = ?',
            [commission, orderId]
        );

        req.io.emit('orderStatusUpdate', { id: orderId, status: 'Delivered' });

        res.json({ message: 'Delivery Verified Successfully!', earned: commission });

        // Trigger Order Delivered Email
        (async () => {
             const [orderInfo] = await db.query(`
                SELECT o.order_id_string, o.total_amount, c.name as customer_name, c.email as customer_email
                FROM orders o
                JOIN customers c ON o.customer_id = c.id
                WHERE o.id = ?
            `, [orderId]);
            if (orderInfo.length > 0) {
                const info = orderInfo[0];
                sendOrderDeliveredEmail(info.customer_email, info.customer_name, info.order_id_string, info.total_amount);
            }
        })();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Driver App: Get Earnings Summary
const getEarnings = async (req, res) => {
    try {
        const driverId = req.user.id;
        
        const [stats] = await db.query(`
            SELECT 
                COUNT(*) as completed_count,
                SUM(commission_amount) as total_earnings,
                SUM(CASE WHEN DATE(created_at) = CURDATE() THEN commission_amount ELSE 0 END) as daily_earnings
            FROM orders 
            WHERE driver_id = ? AND status = 'Delivered'
        `, [driverId]);

        const [history] = await db.query(`
            SELECT id, order_id_string, total_amount, commission_amount, created_at
            FROM orders 
            WHERE driver_id = ? AND status = 'Delivered'
            ORDER BY created_at DESC
            LIMIT 20
        `, [driverId]);

        res.json({
            stats: stats[0] || { completed_count: 0, total_earnings: 0, daily_earnings: 0 },
            history
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Driver App: Update order status (mark Delivered) - DEPRECATED in favor of OTP
const updateStatusByDriver = async (req, res) => {
    res.status(403).json({ message: 'Direct delivery update is disabled. Please use OTP verification.' });
};

// Driver App: Toggle own status
const toggleMyStatus = async (req, res) => {
    try {
        const driverId = req.user.id;
        const [driver] = await db.query('SELECT is_active FROM drivers WHERE id = ?', [driverId]);
        const newValue = !driver[0].is_active;
        await db.query('UPDATE drivers SET is_active = ? WHERE id = ?', [newValue, driverId]);
        res.json({ message: 'Status updated', is_active: newValue });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { 
    getDrivers, createDriver, updateDriver, toggleActiveDriver,
    getAvailableOrders, acceptOrder, getMyDeliveries, updateStatusByDriver, toggleMyStatus,
    markArrived, verifyDelivery, getEarnings
};
