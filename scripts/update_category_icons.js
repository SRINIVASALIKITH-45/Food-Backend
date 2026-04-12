const mysql = require('mysql2/promise');

const config = {
  host: 'localhost',
  user: 'root',
  password: 'likithliki90',
  database: 'food_delivery_admin'
};

async function updateCategoryIcons() {
  const connection = await mysql.createConnection(config);
  try {
    const letters = {
      'Biryani': 'B',
      'Burgers': 'Bu',
      'Pizza': 'P',
      'North Indian': 'NI',
      'South Indian': 'SI',
      'Chinese': 'C',
      'Desserts': 'D',
      'Cakes': 'Ca',
      'Thalis': 'T',
      'Rolls': 'R',
      'Pizza': 'P',
      'Beverages': 'Be',
      'Kebabs': 'K'
    };

    const [rows] = await connection.execute('SELECT id, name FROM categories');
    
    for (const row of rows) {
      const letter = letters[row.name] || row.name.charAt(0).toUpperCase();
      const color = '#4F46E5'; // Consistent Indigo
      await connection.execute(
        'UPDATE categories SET emoji = ?, color = ? WHERE id = ?',
        [letter, color, row.id]
      );
      console.log(`Updated category ${row.name} to letter ${letter}`);
    }
    
    console.log('All categories updated to Letter-based icons.');
  } catch (err) {
    console.error('Error updating icons:', err);
  } finally {
    await connection.end();
  }
}

updateCategoryIcons();
