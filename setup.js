const mysql = require('mysql2/promise');
require('dotenv').config();

const setupDatabase = async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || 'likithliki90',
            port: process.env.DB_PORT || 3306,
        });

        console.log("Connected to MySQL Server...");

        const dbName = process.env.DB_NAME || 'food_delivery_admin';
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
        console.log(`Database '${dbName}' created or exists.`);

        await connection.query(`USE \`${dbName}\`;`);

        // 1. Admin Table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS admin (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                role ENUM('Admin', 'Manager', 'Kitchen') DEFAULT 'Admin',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Table admin created.');

        // Insert default admin
        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await connection.query(`
            INSERT IGNORE INTO admin (id, username, password, role) VALUES (1, 'admin', '${hashedPassword}', 'Admin');
        `);

        // 2. Customers
        await connection.query(`
            CREATE TABLE IF NOT EXISTS customers (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                phone VARCHAR(20),
                is_blocked BOOLEAN DEFAULT false,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // 3. Drivers
        await connection.query(`
            CREATE TABLE IF NOT EXISTS drivers (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                phone VARCHAR(20) NOT NULL,
                password VARCHAR(255) NOT NULL,
                vehicle_details VARCHAR(100),
                is_active BOOLEAN DEFAULT true,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // 4. Categories
        await connection.query(`
            CREATE TABLE IF NOT EXISTS categories (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // 5. Products
        await connection.query(`
            CREATE TABLE IF NOT EXISTS products (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                category_id INT,
                price DECIMAL(10, 2) NOT NULL,
                quantity INT NOT NULL DEFAULT 0,
                description TEXT,
                image_url VARCHAR(255),
                food_type ENUM('Veg', 'Non-Veg', 'Egg') DEFAULT 'Veg',
                spice_level ENUM('Mild', 'Medium', 'Spicy') DEFAULT 'Mild',
                meal_type ENUM('Breakfast', 'Lunch', 'Dinner', 'Snacks') DEFAULT 'Lunch',
                portion ENUM('Half', 'Full', 'Family Pack') DEFAULT 'Full',
                dietary_preference ENUM('None', 'Vegan', 'Gluten-Free', 'Dairy-Free') DEFAULT 'None',
                price_range ENUM('Budget', 'Medium', 'Premium') DEFAULT 'Medium',
                temperature ENUM('Hot', 'Cold') DEFAULT 'Hot',
                is_available BOOLEAN DEFAULT true,
                prep_time INT DEFAULT 15,
                delivery_time INT DEFAULT 30,
                rating DECIMAL(3, 2) DEFAULT 4.0,
                has_offer BOOLEAN DEFAULT false,
                free_delivery BOOLEAN DEFAULT false,
                is_seasonal BOOLEAN DEFAULT false,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
            );
        `);

        // Migration: Add columns if table existed but without them
        try {
            const [columns] = await connection.query(`SHOW COLUMNS FROM products`);
            const colNames = columns.map(c => c.Field);
            if (!colNames.includes('food_type')) {
                await connection.query(`
                    ALTER TABLE products 
                    ADD COLUMN food_type ENUM('Veg', 'Non-Veg', 'Egg') DEFAULT 'Veg',
                    ADD COLUMN spice_level ENUM('Mild', 'Medium', 'Spicy') DEFAULT 'Mild',
                    ADD COLUMN meal_type ENUM('Breakfast', 'Lunch', 'Dinner', 'Snacks') DEFAULT 'Lunch',
                    ADD COLUMN portion ENUM('Half', 'Full', 'Family Pack') DEFAULT 'Full',
                    ADD COLUMN dietary_preference ENUM('None', 'Vegan', 'Gluten-Free', 'Dairy-Free') DEFAULT 'None',
                    ADD COLUMN price_range ENUM('Budget', 'Medium', 'Premium') DEFAULT 'Medium',
                    ADD COLUMN temperature ENUM('Hot', 'Cold') DEFAULT 'Hot'
                `);
                console.log('Products table updated with new filtering columns.');
            }

            if (!colNames.includes('rating')) {
                await connection.query(`
                    ALTER TABLE products 
                    ADD COLUMN rating DECIMAL(3, 2) DEFAULT 4.0 AFTER prep_time,
                    ADD COLUMN delivery_time INT DEFAULT 30 AFTER rating,
                    ADD COLUMN has_offer BOOLEAN DEFAULT false AFTER delivery_time,
                    ADD COLUMN free_delivery BOOLEAN DEFAULT false AFTER has_offer
                `);
                console.log('Products table updated with rating and offer fields.');
            }
        } catch (e) {
            console.log('Alter table skipped or failed:', e.message);
        }

        // Migration for drivers: Add password if missing
        try {
            const [columns] = await connection.query(`SHOW COLUMNS FROM drivers`);
            const colNames = columns.map(c => c.Field);
            if (!colNames.includes('password')) {
                const bcrypt = require('bcryptjs');
                const defaultHashedPassword = await bcrypt.hash('driver123', 10);
                await connection.query(`
                    ALTER TABLE drivers 
                    ADD COLUMN password VARCHAR(255) NOT NULL DEFAULT '${defaultHashedPassword}' AFTER phone
                `);
                console.log('Drivers table updated with password column.');
            }
        } catch (e) {
            console.log('Drivers table alter failed:', e.message);
        }

        // 5.1 Tags Table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS tags (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(50) UNIQUE NOT NULL
            );
        `);

        // 5.2 Product Tags (Relationship)
        await connection.query(`
            CREATE TABLE IF NOT EXISTS product_tags (
                product_id INT,
                tag_id INT,
                PRIMARY KEY (product_id, tag_id),
                FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
                FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
            );
        `);

        // Seed Tags
        const tags = [
            'Sweet', 'Spicy', 'Tangy', 'Crispy', 'Soft',
            'Best Seller', 'Chef Special', 'Top Rated',
            'Festival Special', 'Prasadam', 'Temple Special'
        ];
        for (const tag of tags) {
            await connection.query(`INSERT IGNORE INTO tags (name) VALUES (?)`, [tag]);
        }
        console.log('Tags table created and seeded.');

        // 6. Orders
        await connection.query(`
            CREATE TABLE IF NOT EXISTS orders (
                id INT AUTO_INCREMENT PRIMARY KEY,
                order_id_string VARCHAR(50) UNIQUE,
                customer_id INT,
                driver_id INT,
                total_amount DECIMAL(10, 2) NOT NULL,
                gst_amount DECIMAL(10, 2) DEFAULT 0.00,
                delivery_charge DECIMAL(10, 2) DEFAULT 0.00,
                packaging_charge DECIMAL(10, 2) DEFAULT 0.00,
                payment_method VARCHAR(20) DEFAULT 'COD',
                status VARCHAR(50) DEFAULT 'Pending',
                delivery_address TEXT NOT NULL,
                customer_name VARCHAR(100),
                customer_phone VARCHAR(20),
                cancellation_reason TEXT,
                estimated_delivery_time TIMESTAMP NULL,
                delivery_otp VARCHAR(6),
                otp_expiry TIMESTAMP NULL,
                is_arrived BOOLEAN DEFAULT false,
                commission_amount DECIMAL(10, 2) DEFAULT 0.00,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
                FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE SET NULL,
                table_id INT,
                writer_id INT
            );
        `);

        // Migration for orders: Add columns if missing
        try {
            const [columns] = await connection.query(`SHOW COLUMNS FROM orders`);
            const colNames = columns.map(c => c.Field);
            if (!colNames.includes('order_id_string')) {
                await connection.query(`
                    ALTER TABLE orders 
                    ADD COLUMN order_id_string VARCHAR(50) UNIQUE AFTER id,
                    ADD COLUMN payment_method VARCHAR(20) DEFAULT 'COD' AFTER packaging_charge,
                    ADD COLUMN customer_name VARCHAR(100) AFTER delivery_address,
                    ADD COLUMN customer_phone VARCHAR(20) AFTER customer_name
                `);
                console.log('Orders table updated with new columns.');
            }
        } catch (e) {
            console.log('Orders table alter failed:', e.message);
        }

        // 7. Order Items
        await connection.query(`
            CREATE TABLE IF NOT EXISTS order_items (
                id INT AUTO_INCREMENT PRIMARY KEY,
                order_id INT,
                product_id INT,
                quantity INT NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
                FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
            );
        `);

        // 8. Coupons
        await connection.query(`
            CREATE TABLE IF NOT EXISTS coupons (
                id INT AUTO_INCREMENT PRIMARY KEY,
                code VARCHAR(50) UNIQUE NOT NULL,
                discount_percentage DECIMAL(5, 2) NOT NULL,
                is_active BOOLEAN DEFAULT true,
                expiry_date DATE,
                max_usage_per_user INT DEFAULT 1,
                min_order_value DECIMAL(10, 2) DEFAULT 0.00,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // 9. Settings
        await connection.query(`
            CREATE TABLE IF NOT EXISTS settings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                setting_key VARCHAR(100) UNIQUE NOT NULL,
                setting_value TEXT,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            );
        `);

        // Insert default settings
        const settings = [
            ['is_restaurant_open', 'true'],
            ['gst_percentage', '5'],
            ['delivery_charge', '40'],
            ['packaging_charge', '10'],
            ['festival_mode_active', 'false']
        ];
        for (const [key, val] of settings) {
            await connection.query(`INSERT IGNORE INTO settings (setting_key, setting_value) VALUES (?, ?)`, [key, val]);
        }

        // 10. Delivery Zones
        await connection.query(`
            CREATE TABLE IF NOT EXISTS delivery_zones (
                id INT AUTO_INCREMENT PRIMARY KEY,
                zone_name VARCHAR(100) UNIQUE NOT NULL,
                is_active BOOLEAN DEFAULT true,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // 11. Admin Logs
        await connection.query(`
            CREATE TABLE IF NOT EXISTS admin_logs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                admin_id INT,
                action VARCHAR(255) NOT NULL,
                details TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (admin_id) REFERENCES admin(id) ON DELETE SET NULL
            );
        `);

        // 12. Coupon Usage
        await connection.query(`
            CREATE TABLE IF NOT EXISTS coupon_usage (
                id INT AUTO_INCREMENT PRIMARY KEY,
                coupon_id INT,
                customer_id INT,
                used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE CASCADE,
                FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
            );
        `);

        // 10. Customer Favorites
        await connection.query(`
            CREATE TABLE IF NOT EXISTS customer_favorites (
                id INT AUTO_INCREMENT PRIMARY KEY,
                customer_id INT,
                product_id INT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(customer_id, product_id),
                FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
                FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
            );
        `);

        // 11. Product Reviews
        await connection.query(`
            CREATE TABLE IF NOT EXISTS product_reviews (
                id INT AUTO_INCREMENT PRIMARY KEY,
                product_id INT,
                customer_id INT,
                rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
                comment TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
                FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
            );
        `);

        // 12. Saved Addresses
        await connection.query(`
            CREATE TABLE IF NOT EXISTS saved_addresses (
                id INT AUTO_INCREMENT PRIMARY KEY,
                customer_id INT,
                label VARCHAR(50) DEFAULT 'Home',
                address TEXT NOT NULL,
                is_default BOOLEAN DEFAULT false,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
            );
        `);

        // 13. Payment Methods
        await connection.query(`
            CREATE TABLE IF NOT EXISTS payment_methods (
                id INT AUTO_INCREMENT PRIMARY KEY,
                customer_id INT,
                type VARCHAR(50) NOT NULL,
                detail VARCHAR(100) NOT NULL,
                is_default BOOLEAN DEFAULT false,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
            );
        `);

        // 14. Restaurant Tables
        await connection.query(`
            CREATE TABLE IF NOT EXISTS restaurant_tables (
                id INT AUTO_INCREMENT PRIMARY KEY,
                table_number VARCHAR(20) UNIQUE NOT NULL,
                capacity INT DEFAULT 4,
                status ENUM('Available', 'Occupied', 'Cleaning', 'Reserved') DEFAULT 'Available',
                current_order_id INT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // 15. Writers (Captains)
        await connection.query(`
            CREATE TABLE IF NOT EXISTS writers (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                phone VARCHAR(20) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                is_on_duty BOOLEAN DEFAULT false,
                last_login_time TIMESTAMP NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        // Seed a default writer
        const hashedWriterPass = await bcrypt.hash('writer123', 10);
        await connection.query(`
            INSERT IGNORE INTO writers (id, name, phone, password) VALUES (1, 'Test Writer', '9999999999', '${hashedWriterPass}');
        `);

        // 15.5 Kitchen Staff
        await connection.query(`
            CREATE TABLE IF NOT EXISTS kitchen_staff (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                phone VARCHAR(20) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                is_active BOOLEAN DEFAULT true,
                last_login_time TIMESTAMP NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        // Seed a default kitchen staff
        const hashedKitchenPass = await bcrypt.hash('kitchen123', 10);
        await connection.query(`
            INSERT IGNORE INTO kitchen_staff (id, name, phone, password) VALUES (1, 'Main Chef', '8888888888', '${hashedKitchenPass}');
        `);

        // 16. KOTs (Kitchen Order Tickets)
        await connection.query(`
            CREATE TABLE IF NOT EXISTS kots (
                id INT AUTO_INCREMENT PRIMARY KEY,
                order_id INT,
                table_id INT,
                writer_id INT,
                customer_name VARCHAR(100),
                pax INT DEFAULT 1,
                items_json JSON NOT NULL,
                new_items_json JSON,
                status ENUM('Pending', 'Preparing', 'Ready', 'Served') DEFAULT 'Pending',
                priority ENUM('Normal', 'VIP', 'Urgent') DEFAULT 'Normal',
                version INT DEFAULT 1,
                is_printed BOOLEAN DEFAULT false,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
                FOREIGN KEY (table_id) REFERENCES restaurant_tables(id) ON DELETE SET NULL,
                FOREIGN KEY (writer_id) REFERENCES writers(id) ON DELETE SET NULL
            );
        `);

        // Migration for KOTs
        try {
            const [columns] = await connection.query(`SHOW COLUMNS FROM kots`);
            const colNames = columns.map(c => c.Field);
            if (!colNames.includes('priority')) {
                await connection.query(`
                    ALTER TABLE kots 
                    ADD COLUMN priority ENUM('Normal', 'VIP', 'Urgent') DEFAULT 'Normal' AFTER status,
                    ADD COLUMN pax INT DEFAULT 1 AFTER customer_name,
                    ADD COLUMN version INT DEFAULT 1 AFTER priority,
                    ADD COLUMN new_items_json JSON AFTER items_json
                `);
                console.log('KOTs table updated with priority and versioning.');
            }
        } catch (e) {
            console.log('KOTs table alter failed:', e.message);
        }

        // Seed some tables
        for(let i=1; i<=12; i++) {
            await connection.query(`INSERT IGNORE INTO restaurant_tables (table_number) VALUES ('T-${i}')`);
        }

        console.log('All tables created successfully.');
        await connection.end();
        console.log("Database connection closed.");

    } catch (error) {
        console.error("Database initialization failed:", error);
        process.exit(1);
    }
};

setupDatabase();
