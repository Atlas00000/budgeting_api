const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Get all budgets
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                b.id,
                b.category_id,
                CAST(b.amount AS DECIMAL(10,2)) as amount,
                b.month,
                b.created_at,
                b.updated_at,
                c.name as category_name
            FROM budgets b 
            LEFT JOIN categories c ON b.category_id = c.id 
            ORDER BY b.month DESC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching budgets:', error);
        res.status(500).json({ message: 'Error fetching budgets' });
    }
});

// Create budget
router.post('/', async (req, res) => {
    const { category_id, amount, month } = req.body;

    // Input validation
    if (!amount || isNaN(amount) || amount <= 0) {
        return res.status(400).json({ message: 'Valid amount is required' });
    }
    if (!category_id || isNaN(category_id)) {
        return res.status(400).json({ message: 'Valid category is required' });
    }
    if (!month || !Date.parse(month)) {
        return res.status(400).json({ message: 'Valid month is required' });
    }

    try {
        const result = await pool.query(
            `INSERT INTO budgets (category_id, amount, month) 
             VALUES ($1, $2, $3) 
             RETURNING id, category_id, CAST(amount AS DECIMAL(10,2)) as amount, month, created_at, updated_at`,
            [parseInt(category_id), parseFloat(amount), month]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating budget:', error);
        if (error.code === '23505') { // Unique violation
            res.status(400).json({ message: 'Budget already exists for this category and month' });
        } else if (error.code === '23503') { // Foreign key violation
            res.status(400).json({ message: 'Invalid category' });
        } else {
            res.status(500).json({ message: 'Error creating budget' });
        }
    }
});

// Update budget
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { amount } = req.body;

    // Input validation
    if (!amount || isNaN(amount) || amount <= 0) {
        return res.status(400).json({ message: 'Valid amount is required' });
    }

    try {
        const result = await pool.query(
            `UPDATE budgets 
             SET amount = $1, updated_at = CURRENT_TIMESTAMP 
             WHERE id = $2 
             RETURNING id, category_id, CAST(amount AS DECIMAL(10,2)) as amount, month, created_at, updated_at`,
            [parseFloat(amount), id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Budget not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating budget:', error);
        res.status(500).json({ message: 'Error updating budget' });
    }
});

// Delete budget
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM budgets WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Budget not found' });
        }
        res.json({ message: 'Budget deleted successfully' });
    } catch (error) {
        console.error('Error deleting budget:', error);
        res.status(500).json({ message: 'Error deleting budget' });
    }
});

module.exports = router; 