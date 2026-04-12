const db = require('./config/db');

async function seed() {
    try {
        console.log('Seeding categories...');
        await db.query(`UPDATE categories SET emoji='🍗', color='#FCE4EC' WHERE id=1`);
        
        const categories = [
            ['Biryani', '🍛', '#FFF3E0'],
            ['Pizza', '🍕', '#FFF8E1'],
            ['Tiffins', '🥘', '#F3E5F5'],
            ['Meals', '🍱', '#E8F5E9'],
            ['Beverages', '🥤', '#E3F2FD'],
            ['Snacks', '🍿', '#FCE4EC'],
            ['Desserts', '🍰', '#F9FBE7'],
            ['Burgers', '🍔', '#FFF3E0']
        ];

        for (const [name, emoji, color] of categories) {
            await db.query(
                'INSERT INTO categories (name, emoji, color) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE emoji=VALUES(emoji), color=VALUES(color)',
                [name, emoji, color]
            );
        }

        // 2. Seed some coupons
        console.log('Seeding coupons...');
        const coupons = [
            ['WELCOME50', 50, '2026-12-31', true],
            ['FREESHIP', 15, '2026-12-31', true],
            ['WEEKEND75', 75, '2026-12-31', true]
        ];

        for (const [code, discount, expiry, active] of coupons) {
            await db.query(
                'INSERT INTO coupons (code, discount_percentage, expiry_date, is_active) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE is_active=VALUES(is_active)',
                [code, discount, expiry, active]
            );
        }

        console.log('Seeded successfully!');
    } catch (error) {
        console.error('Seed failed:', error);
    } finally {
        process.exit(0);
    }
}

seed();
