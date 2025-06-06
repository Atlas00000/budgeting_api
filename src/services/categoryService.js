// For now, the service simply proxies to the model, but this allows for future business logic expansion.
const db = require('../config/database');

const CategoryService = {
  async getAll() {
    const result = await db.query('SELECT * FROM categories ORDER BY name');
    return result.rows;
  },

  async getById(id) {
    const result = await db.query('SELECT * FROM categories WHERE id = $1', [id]);
    return result.rows[0];
  },

  async create(categoryData) {
    const { name, description } = categoryData;
    const result = await db.query(
      'INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *',
      [name, description]
    );
    return result.rows[0];
  },

  async update(id, categoryData) {
    const { name, description } = categoryData;
    const result = await db.query(
      'UPDATE categories SET name = $1, description = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
      [name, description, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    const result = await db.query('DELETE FROM categories WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }
};

module.exports = CategoryService; 