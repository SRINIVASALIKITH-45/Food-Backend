const db = require('../config/db');
const logActivity = require('../middlewares/activityLogger');

// Get all products with pagination and multi-filters
const getProducts = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 12, 
            search = '', 
            category_id, 
            food_type, 
            spice_level, 
            meal_type, 
            portion, 
            dietary_preference, 
            price_range, 
            temperature,
            tags,
            sort = 'newest' // newest, price_low, price_high
        } = req.query;
        
        const offset = (page - 1) * limit;

        let query = `
            SELECT DISTINCT p.*, c.name as category_name 
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN product_tags pt ON p.id = pt.product_id
            LEFT JOIN tags t ON pt.tag_id = t.id
            WHERE 1=1
        `;
        let params = [];

        // Name Search
        if (search) {
            query += ' AND p.name LIKE ?';
            params.push(`%${search}%`);
        }

        // Multi-select filters
        const applyArrayFilter = (field, values) => {
            if (values) {
                const valArray = Array.isArray(values) ? values : [values];
                if (valArray.length > 0) {
                    query += ` AND p.${field} IN (${valArray.map(() => '?').join(',')})`;
                    params.push(...valArray);
                }
            }
        };

        applyArrayFilter('category_id', category_id);
        applyArrayFilter('food_type', food_type);
        applyArrayFilter('spice_level', spice_level);
        applyArrayFilter('meal_type', meal_type);
        applyArrayFilter('portion', portion);
        applyArrayFilter('dietary_preference', dietary_preference);
        applyArrayFilter('price_range', price_range);
        applyArrayFilter('temperature', temperature);

        // Tags Filter (AND logic: product must have ALL selected tags)
        if (tags) {
            const tagArray = Array.isArray(tags) ? tags : [tags];
            if (tagArray.length > 0) {
                query += ` AND p.id IN (
                    SELECT product_id FROM product_tags 
                    WHERE tag_id IN (${tagArray.map(() => '?').join(',')})
                    GROUP BY product_id HAVING COUNT(DISTINCT tag_id) = ?
                )`;
                params.push(...tagArray, tagArray.length);
            }
        }

        // Count for pagination (using a subquery or distinct count)
        const countQuery = `SELECT COUNT(*) as count FROM (${query}) as filtered_products`;
        const [totalRows] = await db.query(countQuery, params);
        const totalCount = totalRows[0].count;

        // Sorting
        if (sort === 'price_low') {
            query += ' ORDER BY p.price ASC';
        } else if (sort === 'price_high') {
            query += ' ORDER BY p.price DESC';
        } else {
            query += ' ORDER BY p.created_at DESC';
        }

        query += ' LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));

        const [productsList] = await db.query(query, params);
        
        // Fetch tags for each product
        const productsWithTags = await Promise.all(productsList.map(async (p) => {
            const [productTags] = await db.query(`
                SELECT t.id, t.name FROM tags t
                JOIN product_tags pt ON t.id = pt.tag_id
                WHERE pt.product_id = ?
            `, [p.id]);
            return { ...p, tags: productTags };
        }));

        res.json({
            products: productsWithTags,
            totalCount,
            page: parseInt(page),
            totalPages: Math.ceil(totalCount / limit)
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Create product
const createProduct = async (req, res) => {
    try {
        const { 
            name, category_id, price, quantity, description, 
            is_available, prep_time, is_seasonal,
            food_type, spice_level, meal_type, portion,
            dietary_preference, price_range, temperature,
            tags // Expected as JSON string or array
        } = req.body;
        
        let image_url = null;
        if (req.file) {
            image_url = '/uploads/' + req.file.filename;
        }
        
        const [result] = await db.query(
            `INSERT INTO products (
                name, category_id, price, quantity, description, image_url, 
                is_available, prep_time, is_seasonal, food_type, spice_level,
                meal_type, portion, dietary_preference, price_range, temperature
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                name, category_id, price, quantity, description, image_url, 
                is_available === 'true' || is_available === true || is_available === 1,
                prep_time || 15,
                is_seasonal === 'true' || is_seasonal === true || is_seasonal === 1,
                food_type, spice_level, meal_type, portion,
                dietary_preference, price_range, temperature
            ]
        );
        
        const productId = result.insertId;

        // Handle Tags
        if (tags) {
            const tagIds = Array.isArray(tags) ? tags : JSON.parse(tags);
            for (const tagId of tagIds) {
                await db.query('INSERT INTO product_tags (product_id, tag_id) VALUES (?, ?)', [productId, tagId]);
            }
        }
        
        await logActivity(req.user.id, 'Create Product', { name, id: productId });
        res.status(201).json({ message: 'Product created', id: productId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Update product
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            name, category_id, price, quantity, description, 
            is_available, prep_time, is_seasonal,
            food_type, spice_level, meal_type, portion,
            dietary_preference, price_range, temperature,
            tags 
        } = req.body;
        
        const [existing] = await db.query('SELECT image_url FROM products WHERE id = ?', [id]);
        if(existing.length === 0) return res.status(404).json({message: 'Not found'});
        
        let image_url = existing[0].image_url;
        if (req.file) {
            image_url = '/uploads/' + req.file.filename;
        }
        
        await db.query(
            `UPDATE products SET 
                name=?, category_id=?, price=?, quantity=?, description=?, image_url=?, 
                is_available=?, prep_time=?, is_seasonal=?, food_type=?, spice_level=?,
                meal_type=?, portion=?, dietary_preference=?, price_range=?, temperature=?
            WHERE id=?`,
            [
                name, category_id, price, quantity, description, image_url, 
                is_available === 'true' || is_available === true || is_available === 1,
                prep_time,
                is_seasonal === 'true' || is_seasonal === true || is_seasonal === 1,
                food_type, spice_level, meal_type, portion,
                dietary_preference, price_range, temperature,
                id
            ]
        );

        // Update Tags
        if (tags) {
            const tagIds = Array.isArray(tags) ? tags : JSON.parse(tags);
            await db.query('DELETE FROM product_tags WHERE product_id = ?', [id]);
            for (const tagId of tagIds) {
                await db.query('INSERT INTO product_tags (product_id, tag_id) VALUES (?, ?)', [id, tagId]);
            }
        }
        
        await logActivity(req.user.id, 'Update Product', { name, id });
        res.json({ message: 'Product updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Delete product
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM products WHERE id = ?', [id]);
        await logActivity(req.user.id, 'Delete Product', { id });
        res.json({ message: 'Product deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Toggle Availability
const toggleAvailability = async (req, res) => {
    try {
        const { id } = req.params;
        const [existing] = await db.query('SELECT is_available, name FROM products WHERE id = ?', [id]);
        if(existing.length === 0) return res.status(404).json({message: 'Not found'});
        
        const newValue = !existing[0].is_available;
        await db.query('UPDATE products SET is_available = ? WHERE id = ?', [newValue, id]);
        await logActivity(req.user.id, 'Toggle Availability', { id, name: existing[0].name, is_available: newValue });
        res.json({ message: 'Availability toggled', is_available: newValue });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get all tags
const getTags = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM tags ORDER BY name ASC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tags' });
    }
};

// Toggle Favorite
const toggleFavorite = async (req, res) => {
    try {
        const productId = req.params.id;
        const customerId = req.user?.id;
        if (!customerId) return res.status(401).json({ message: 'Not authorized' });

        const [existing] = await db.query('SELECT * FROM customer_favorites WHERE customer_id = ? AND product_id = ?', [customerId, productId]);

        if (existing.length > 0) {
            await db.query('DELETE FROM customer_favorites WHERE customer_id = ? AND product_id = ?', [customerId, productId]);
            res.json({ message: 'Removed from favorites', is_favorite: false });
        } else {
            await db.query('INSERT INTO customer_favorites (customer_id, product_id) VALUES (?, ?)', [customerId, productId]);
            res.json({ message: 'Added to favorites', is_favorite: true });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get Favorites
const getFavorites = async (req, res) => {
    try {
        const customerId = req.user?.id;
        if (!customerId) return res.status(401).json({ message: 'Not authorized' });

        const [favorites] = await db.query(`
            SELECT p.*, c.name as category_name
            FROM products p
            JOIN customer_favorites cf ON p.id = cf.product_id
            JOIN categories c ON p.category_id = c.id
            WHERE cf.customer_id = ?
        `, [customerId]);

        res.json(favorites);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Add Review
const addReview = async (req, res) => {
    try {
        const { product_id, rating, comment } = req.body;
        const customerId = req.user?.id;
        if (!customerId) return res.status(401).json({ message: 'Not authorized' });

        await db.query('INSERT INTO product_reviews (product_id, customer_id, rating, comment) VALUES (?, ?, ?, ?)', 
            [product_id, customerId, rating, comment]);

        // Update product average rating (optional but good)
        const [avg] = await db.query('SELECT AVG(rating) as average FROM product_reviews WHERE product_id = ?', [product_id]);
        await db.query('UPDATE products SET rating = ? WHERE id = ?', [avg[0].average || 4.0, product_id]);

        res.status(201).json({ message: 'Review added' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { 
    getProducts, createProduct, updateProduct, deleteProduct, 
    toggleAvailability, getTags, toggleFavorite, getFavorites, addReview 
};
