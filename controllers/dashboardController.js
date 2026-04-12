const db = require('../config/db');

const getDashboardStats = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        let dateFilter = '';
        let params = [];
        
        if (startDate && endDate) {
            dateFilter = ' AND DATE(created_at) BETWEEN ? AND ?';
            params = [startDate, endDate];
        }

        const stats = {};
        
        // Total Orders
        const [totOrders] = await db.query('SELECT COUNT(*) as count FROM orders WHERE 1=1' + dateFilter, params);
        stats.totalOrders = totOrders[0].count;
        
        // Total Revenue
        const [totRev] = await db.query('SELECT SUM(total_amount) as total FROM orders WHERE status = "Delivered"' + dateFilter, params);
        stats.totalRevenue = totRev[0].total || 0;
        
        // Total Customers (Usually total, but can filter by registration date if needed - I'll keep total)
        const [totCust] = await db.query('SELECT COUNT(*) as count FROM customers');
        stats.totalCustomers = totCust[0].count;
        
        // Today's Orders
        const [todays] = await db.query('SELECT COUNT(*) as count FROM orders WHERE DATE(created_at) = CURDATE()');
        stats.todaysOrders = todays[0].count;
        
        // Revenue chart
        const [revData] = await db.query(`
            SELECT DATE(created_at) as date, SUM(total_amount) as total 
            FROM orders 
            WHERE status = 'Delivered' ${dateFilter}
            GROUP BY DATE(created_at) 
            ORDER BY DATE(created_at) ASC 
        `, params);
        stats.revenueChart = revData;

        // Order status breakdown
        const [statusData] = await db.query(`
            SELECT status, COUNT(*) as count
            FROM orders
            WHERE 1=1 ${dateFilter}
            GROUP BY status
        `, params);
        stats.orderStatusChart = statusData;

        // Most Ordered Products
        const [mostOrdered] = await db.query(`
            SELECT p.name, COUNT(oi.product_id) as total_orders
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            JOIN orders o ON oi.order_id = o.id
            WHERE 1=1 ${dateFilter.replace('created_at', 'o.created_at')}
            GROUP BY oi.product_id
            ORDER BY total_orders DESC
            LIMIT 5
        `, params);
        stats.mostOrderedProducts = mostOrdered;

        // Peak Order Time (Highest Orders Hour)
        const [peakTime] = await db.query(`
            SELECT HOUR(created_at) as hour, COUNT(*) as count
            FROM orders
            WHERE 1=1 ${dateFilter}
            GROUP BY hour
            ORDER BY count DESC
            LIMIT 1
        `, params);
        stats.peakOrderHour = peakTime.length > 0 ? peakTime[0] : { hour: 'N/A', count: 0 };

        // Category-wise sales
        const [catSales] = await db.query(`
            SELECT c.name, SUM(oi.price * oi.quantity) as total_sales
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            JOIN categories c ON p.category_id = c.id
            JOIN orders o ON oi.order_id = o.id
            WHERE 1=1 ${dateFilter.replace('created_at', 'o.created_at')}
            GROUP BY p.category_id
        `, params);
        stats.categorySales = catSales;

        // Low Stock Alerts (quantity < 5)
        const [lowStock] = await db.query(`
            SELECT name, quantity FROM products WHERE quantity < 5
        `);
        stats.lowStockAlerts = lowStock;

        // Customer Insights: Top Customers by total spending
        const [topCustomers] = await db.query(`
            SELECT c.id, c.name, COUNT(o.id) as order_count, SUM(o.total_amount) as total_spent
            FROM customers c
            JOIN orders o ON c.id = o.customer_id
            WHERE o.status = "Delivered"
            GROUP BY c.id
            ORDER BY total_spent DESC
            LIMIT 5
        `);
        stats.topCustomers = topCustomers;

        // Fraud Detection: Users with high cancellation count (> 3)
        const [suspiciousUsers] = await db.query(`
            SELECT c.id, c.name, COUNT(o.id) as cancellation_count
            FROM customers c
            JOIN orders o ON c.id = o.customer_id
            WHERE o.status = "Cancelled"
            GROUP BY c.id
            HAVING cancellation_count > 3
            ORDER BY cancellation_count DESC
        `);
        stats.suspiciousUsers = suspiciousUsers;

        // Cancellation Statistics
        const [cancellationStats] = await db.query(`
            SELECT cancellation_reason, COUNT(*) as count
            FROM orders
            WHERE status = "Cancelled" AND cancellation_reason IS NOT NULL
            GROUP BY cancellation_reason
        `);
        stats.cancellationStats = cancellationStats;

        res.json(stats);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}

module.exports = { getDashboardStats };
