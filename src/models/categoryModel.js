const db = require('../config/database');

const CategoryModel = {
  async getAll() {
    const result = await db.query('SELECT * FROM categories ORDER BY id ASC');
    return result.rows;
  },
  async getById(id) {
    const result = await db.query('SELECT * FROM categories WHERE id = $1', [id]);
    return result.rows[0];
  },
  async create({ name, description }) {
    const result = await db.query(
      'INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *',
      [name, description]
    );
    return result.rows[0];
  },
  async update(id, { name, description }) {
    const result = await db.query(
      'UPDATE categories SET name = $1, description = $2 WHERE id = $3 RETURNING *',
      [name, description, id]
    );
    return result.rows[0];
  },
  async delete(id) {
    const result = await db.query('DELETE FROM categories WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }
};

module.exports = CategoryModel; 