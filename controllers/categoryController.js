const db = require('../config/db');

const getCategories = async (req, res) => {
    try {
        const [categories] = await db.query('SELECT * FROM categories');
        res.json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const createCategory = async (req, res) => {
    try {
        const { name, description, emoji, color } = req.body;
        const [result] = await db.query(
            'INSERT INTO categories (name, description, emoji, color) VALUES (?, ?, ?, ?)', 
            [name, description, emoji || '', color || '#FF6B35']
        );
        res.status(201).json({ message: 'Category created', id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, emoji, color } = req.body;
        await db.query(
            'UPDATE categories SET name=?, description=?, emoji=?, color=? WHERE id=?', 
            [name, description, emoji, color, id]
        );
        res.json({ message: 'Category updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM categories WHERE id = ?', [id]);
        res.json({ message: 'Category deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
