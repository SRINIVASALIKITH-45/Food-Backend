const db = require('../config/db');
const PDFDocument = require('pdfkit');
const logActivity = require('../middlewares/activityLogger');

// Helper to get global settings
const getSettingValue = async (key) => {
    const [rows] = await db.execute('SELECT setting_value FROM settings WHERE setting_key = ?', [key]);
    return rows.length > 0 ? rows[0].setting_value : null;
};

// Auto assign driver logic
const autoAssignDriver = async () => {
    const [availableDrivers] = await db.query(`
        SELECT d.id FROM drivers d
        WHERE d.is_active = true
        AND d.id NOT IN (
            SELECT driver_id FROM orders 
            WHERE status IN ('Preparing', 'Out for Delivery') 
            AND driver_id IS NOT NULL
        )
        LIMIT 1
    `);
    return availableDrivers.length > 0 ? availableDrivers[0].id : null;
};

const createOrder = async (req, res) => {
    try {
        const { customer_id, delivery_address, items, coupon_code } = req.body;
        
        // 1. Check if restaurant is open
        const isOpen = await getSettingValue('is_restaurant_open');
        if (isOpen === 'false') {
            return res.status(403).json({ message: 'Restaurant is currently closed for orders.' });
        }

        // 2. Zone check (Mock logic based on address string for now)
        const [zones] = await db.query('SELECT zone_name FROM delivery_zones WHERE is_active = true');
        const allowedZones = zones.map(z => z.zone_name.toLowerCase());
        const addressLower = delivery_address.toLowerCase();
        const isInZone = allowedZones.length === 0 || allowedZones.some(zone => addressLower.includes(zone));
        
        if (!isInZone) {
            return res.status(400).json({ message: 'We do not deliver to this area.' });
        }

        // 3. Calculate breakdown
        const gstRate = parseFloat(await getSettingValue('gst_percentage') || 0) / 100;
        const deliveryCharge = parseFloat(await getSettingValue('delivery_charge') || 0);
        const packagingCharge = parseFloat(await getSettingValue('packaging_charge') || 0);

        let subtotal = 0;
        let maxPrepTime = 0;
        
        for (const item of items) {
            const [product] = await db.query('SELECT price, quantity, prep_time FROM products WHERE id = ?', [item.product_id]);
            if (product.length === 0) return res.status(404).json({ message: `Product ${item.product_id} not found` });
            if (product[0].quantity < item.quantity) {
                return res.status(400).json({ message: `Product out of stock / insufficient quantity` });
            }
            subtotal += product[0].price * item.quantity;
            if (product[0].prep_time > maxPrepTime) maxPrepTime = product[0].prep_time;
        }

        const gstAmount = subtotal * gstRate;
        const totalAmount = subtotal + gstAmount + deliveryCharge + packagingCharge;

        // 4. Estimation
        const estimatedDeliveryTime = new Date();
        estimatedDeliveryTime.setMinutes(estimatedDeliveryTime.getMinutes() + maxPrepTime + 15); // maxPrep + 15 mins buffer for delivery

        // 5. No auto assign - Drivers will claim it
        const driver_id = null;
        
        const [result] = await db.query(
            'INSERT INTO orders (customer_id, driver_id, total_amount, gst_amount, delivery_charge, packaging_charge, delivery_address, status, estimated_delivery_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [customer_id, driver_id, totalAmount, gstAmount, deliveryCharge, packagingCharge, delivery_address, 'Pending', estimatedDeliveryTime]
        );
        
        const orderId = result.insertId;
        
        // Insert order items & Reduce Stock
        for (const item of items) {
            const [prod] = await db.query('SELECT price FROM products WHERE id = ?', [item.product_id]);
            await db.query(
                'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
                [orderId, item.product_id, item.quantity, prod[0].price]
            );
            await db.query('UPDATE products SET quantity = quantity - ? WHERE id = ?', [item.quantity, item.product_id]);
        }

        // Notify Admin and Kitchen via Socket.io
        req.io.emit('newOrder', { id: orderId, status: 'Pending', total: totalAmount });
        
        res.status(201).json({ message: 'Order placed successfully', orderId, estimatedDeliveryTime });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const getOrders = async (req, res) => {
    try {
        const { status, startDate, endDate, minPrice, maxPrice } = req.query;
        let query = `
            SELECT o.*, c.name as customer_name, d.name as driver_name 
            FROM orders o 
            LEFT JOIN customers c ON o.customer_id = c.id
            LEFT JOIN drivers d ON o.driver_id = d.id
            WHERE 1=1
        `;
        let params = [];

        if (status) { query += ' AND o.status = ?'; params.push(status); }
        if (startDate) { query += ' AND DATE(o.created_at) >= ?'; params.push(startDate); }
        if (endDate) { query += ' AND DATE(o.created_at) <= ?'; params.push(endDate); }
        if (minPrice) { query += ' AND o.total_amount >= ?'; params.push(minPrice); }
        if (maxPrice) { query += ' AND o.total_amount <= ?'; params.push(maxPrice); }

        query += ' ORDER BY o.created_at DESC';
        
        const [orders] = await db.query(query, params);
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const [orders] = await db.query(`
            SELECT o.*, c.name as customer_name, c.phone as customer_phone, c.email as customer_email, d.name as driver_name 
            FROM orders o 
            LEFT JOIN customers c ON o.customer_id = c.id
            LEFT JOIN drivers d ON o.driver_id = d.id
            WHERE o.id = ?
        `, [id]);
        
        if(orders.length === 0) return res.status(404).json({ message: 'Order not found' });
        
        const [items] = await db.query(`
            SELECT oi.*, p.name as product_name, p.image_url 
            FROM order_items oi
            LEFT JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id = ?
        `, [id]);
        
        res.json({ order: orders[0], items });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const { sendOrderPendingEmail, sendOrderAcceptedEmail } = require('../services/emailService');

const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, driver_id, cancellation_reason } = req.body;
        
        let query = 'UPDATE orders SET status = ?, driver_id = ?';
        let params = [status, driver_id || null];

        let otp = null;
        let expiry = null;

        if (status === 'Cancelled') {
            query += ', cancellation_reason = ?';
            params.push(cancellation_reason || 'N/A');
        } else if (status === 'Order Accepted') {
            otp = Math.floor(100000 + Math.random() * 900000).toString();
            expiry = new Date(Date.now() + 10 * 60000); // 10 minutes
            query += ', delivery_otp = ?, otp_expiry = ?';
            params.push(otp, expiry);
        }

        query += ' WHERE id = ?';
        params.push(id);

        await db.execute(query, params);
        
        await logActivity(req.user ? req.user.id : null, 'Update Order Status', { id, status, reason: cancellation_reason });

        // If it's a Dine-in order being marked as Delivered (Paid), release the table
        if (status === 'Delivered') {
            const [orderCheck] = await db.query('SELECT table_id, order_type FROM orders WHERE id = ?', [id]);
            if (orderCheck.length > 0 && orderCheck[0].order_type === 'Dine-in' && orderCheck[0].table_id) {
                const tableId = orderCheck[0].table_id;
                await db.query(`
                    UPDATE restaurant_tables 
                    SET status = 'Available', 
                        customer_name = NULL, 
                        customer_phone = NULL, 
                        customer_email = NULL, 
                        pax = NULL, 
                        current_order_id = NULL 
                    WHERE id = ?`, [tableId]);
                
                // Clear active KOTs for this table
                await db.query("UPDATE kots SET status = 'Served' WHERE table_id = ? AND status != 'Served'", [tableId]);
                
                req.io.emit('tableStatusUpdate', { id: tableId, status: 'Available' });
            }
        }

        // Real-time update
        req.io.emit('orderStatusUpdate', { id, status });
        
        // Broadcast to drivers and send real email if it's accepted
        if (status === 'Order Accepted') {
            // Find customer email for this order
            const [orders] = await db.query(`
                SELECT o.id, o.customer_name, o.total_amount, c.email 
                FROM orders o
                JOIN customers c ON o.customer_id = c.id
                WHERE o.id = ?
            `, [id]);

            if (orders.length > 0) {
                const orderData = orders[0];
                console.log(`[EMAIL QUEUED] Sending Order Accepted email to ${orderData.email}...`);
                await sendOrderAcceptedEmail(orderData.email, orderData.customer_name, id, orderData.total_amount);
            }

            req.io.emit('availableOrder', { id });
        }
        
        res.json({ message: 'Order updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const generateInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        const [orders] = await db.query(`
            SELECT o.*, c.name as customer_name, c.phone as customer_phone, c.email as customer_email
            FROM orders o 
            LEFT JOIN customers c ON o.customer_id = c.id
            WHERE o.id = ?
        `, [id]);
        
        if(orders.length === 0) return res.status(404).json({ message: 'Order not found' });
        const order = orders[0];

        const [items] = await db.query(`
            SELECT oi.*, p.name as product_name
            FROM order_items oi
            LEFT JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id = ?
        `, [id]);

        const doc = new PDFDocument();
        let filename = `invoice_${id}.pdf`;
        res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-type', 'application/pdf');

        doc.fontSize(25).text('Invoice', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Order ID: ${order.id}`);
        doc.text(`Date: ${new Date(order.created_at).toLocaleString()}`);
        doc.moveDown();
        doc.text(`Customer: ${order.customer_name}`);
        doc.text(`Address: ${order.delivery_address}`);
        doc.moveDown();

        doc.text('Order Details:', { underline: true });
        items.forEach(item => {
            doc.text(`${item.product_name} - ₹${item.price} x ${item.quantity} = ₹${item.price * item.quantity}`);
        });
        doc.moveDown();
        
        doc.text(`Subtotal: ₹${order.total_amount - order.gst_amount - order.delivery_charge - order.packaging_charge}`);
        doc.text(`GST: ₹${order.gst_amount}`);
        doc.text(`Delivery Charge: ₹${order.delivery_charge}`);
        doc.text(`Packaging Charge: ₹${order.packaging_charge}`);
        doc.fontSize(16).text(`Total Amount: ₹${order.total_amount}`, { align: 'right' });

        doc.pipe(res);
        doc.end();

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Customer: Get own orders
const getMyOrders = async (req, res) => {
    try {
        const customerId = req.user?.id;
        if (!customerId) return res.status(401).json({ message: 'Not authorized' });

        const [orders] = await db.query(`
            SELECT o.*, o.total_amount as total_price, d.name as driver_name, d.phone as driver_phone
            FROM orders o
            LEFT JOIN drivers d ON o.driver_id = d.id
            WHERE o.customer_id = ?
            ORDER BY o.created_at DESC
        `, [customerId]);

        // Attach items to each order
        for (const order of orders) {
            const [items] = await db.query(`
                SELECT oi.*, p.name, p.image_url
                FROM order_items oi
                LEFT JOIN products p ON oi.product_id = p.id
                WHERE oi.order_id = ?
            `, [order.id]);
            order.items = items;
            order.driver = order.driver_name ? { name: order.driver_name, phone: order.driver_phone } : null;
            
            // Normalize status for frontend compatibility
            if (order.status) {
                order.status = order.status.toLowerCase().replace(/ /g, '_');
            }
        }

        res.json(orders);
    } catch (error) {
        console.error('Error fetching customer orders:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Customer: Place an order
const createCustomerOrder = async (req, res) => {
    try {
        const customerId = req.user?.id;
        if (!customerId) return res.status(401).json({ message: 'Not authorized' });

        const { items, delivery_address, total_price, coupon_code } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'No items in order' });
        }

        // Get customer details for snapshot
        const [customers] = await db.query('SELECT name, phone FROM customers WHERE id = ?', [customerId]);
        if (customers.length === 0) return res.status(404).json({ message: 'Customer not found' });
        const customer = customers[0];

        // Generate Unique Order ID String (e.g. ORD-20231027-A1B2)
        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
        const orderIdString = `ORD-${dateStr}-${randomStr}`;

        const driver_id = null;

        const [result] = await db.query(
            'INSERT INTO orders (order_id_string, customer_id, driver_id, total_amount, delivery_address, customer_name, customer_phone, payment_method, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [orderIdString, customerId, driver_id, total_price || 0, delivery_address || 'Default Address', customer.name, customer.phone, 'COD', 'Pending']
        );

        const orderId = result.insertId;

        for (const item of items) {
            await db.query(
                'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
                [orderId, item.product_id, item.quantity, item.unit_price]
            );
        }

        // Notify Admin and Kitchen
        req.io.emit('newOrder', { 
            id: orderId, 
            order_id_string: orderIdString,
            status: 'Pending', 
            total: total_price,
            customer_name: customer.name 
        });

        res.status(201).json({ 
            message: 'Order placed successfully', 
            orderId, 
            order_id_string: orderIdString 
        });

        // Send Pending Email (Non-blocking)
        const itemsList = items.map(i => `${i.quantity}x ${i.product_name || 'Item'}`).join(', ');
        sendOrderPendingEmail(customer.email || req.user.email, customer.name, orderIdString, itemsList, total_price || 0);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const generateDineInBill = async (req, res) => {
    try {
        const { table_id } = req.body;

        // 1. Fetch all active or served (but unbilled) KOTs for the table
        const [kots] = await db.query(`
            SELECT * FROM kots 
            WHERE table_id = ? AND order_id IS NULL AND status IN ('Pending', 'Preparing', 'Ready', 'Served')
        `, [table_id]);

        if (kots.length === 0) {
            return res.status(400).json({ message: 'No active orders found for this table' });
        }

        // 2. Consolidate items from all KOTs
        const itemsMap = {};
        let subtotal = 0;

        kots.forEach(kot => {
            const items = typeof kot.items_json === 'string' ? JSON.parse(kot.items_json) : kot.items_json;
            items.forEach(item => {
                const key = item.product_id || item.name;
                if (itemsMap[key]) {
                    itemsMap[key].quantity += item.quantity;
                } else {
                    itemsMap[key] = { ...item };
                }
                subtotal += parseFloat(item.price) * item.quantity;
            });
        });

        const consolidatedItems = Object.values(itemsMap);

        // 3. Calculate taxes (Mocking 5% GST as per summary)
        const gstRate = 0.05;
        const gstAmount = subtotal * gstRate;
        const totalAmount = subtotal + gstAmount;

        // 4. Create Order
        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
        const orderIdString = `ORD-DIN-${dateStr}-${randomStr}`;

        const [result] = await db.query(
            `INSERT INTO orders 
             (order_id_string, table_id, total_amount, gst_amount, is_dine_in, order_type, status, customer_name, customer_phone, payment_method, delivery_address) 
             VALUES (?, ?, ?, ?, TRUE, 'Dine-in', 'Bill Generated', ?, ?, 'Table Payment', 'Dine-in')`,
            [
                orderIdString, 
                table_id, 
                totalAmount, 
                gstAmount, 
                kots[0].customer_name || 'Guest', 
                kots[0].customer_phone || null
            ]
        );

        const orderId = result.insertId;

        // 5. Insert Order Items
        for (const item of consolidatedItems) {
            await db.query(
                'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
                [orderId, item.product_id, item.quantity, item.price]
            );
        }

        // 6. Update table with current_order_id
        await db.query('UPDATE restaurant_tables SET current_order_id = ? WHERE id = ?', [orderId, table_id]);

        // 7. Permanently link KOTs to this Order and mark them as billed (status: Served)
        await db.query(
            "UPDATE kots SET order_id = ?, status = 'Served' WHERE table_id = ? AND order_id IS NULL AND status IN ('Pending', 'Preparing', 'Ready', 'Served')",
            [orderId, table_id]
        );

        // Notify Admin and Writer
        req.io.emit('newOrder', { 
            id: orderId, 
            order_id_string: orderIdString,
            status: 'Bill Generated', 
            total: totalAmount,
            table_id,
            is_dine_in: true
        });

        res.status(201).json({ 
            message: 'Bill generated successfully', 
            orderId, 
            total: totalAmount 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { createOrder, getOrders, getOrderById, updateOrderStatus, generateInvoice, getMyOrders, createCustomerOrder, generateDineInBill };
