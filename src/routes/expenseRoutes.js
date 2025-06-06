const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Get all expenses
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                e.id,
                CAST(e.amount AS DECIMAL(10,2)) as amount,
                e.category_id,
                e.description,
                e.date,
                e.created_at,
                e.updated_at,
                c.name as category_name
            FROM expenses e 
            LEFT JOIN categories c ON e.category_id = c.id 
            ORDER BY e.date DESC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching expenses:', error);
        res.status(500).json({ message: 'Error fetching expenses' });
    }
});

// Create expense
router.post('/', async (req, res) => {
    const { amount, category_id, description } = req.body;
    
    // Input validation
    if (!amount || isNaN(amount) || amount <= 0) {
        return res.status(400).json({ message: 'Valid amount is required' });
    }
    if (!category_id || isNaN(category_id)) {
        return res.status(400).json({ message: 'Valid category is required' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO expenses (amount, category_id, description) VALUES ($1, $2, $3) RETURNING id, CAST(amount AS DECIMAL(10,2)) as amount, category_id, description, date, created_at, updated_at',
            [parseFloat(amount), parseInt(category_id), description]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating expense:', error);
        if (error.code === '23503') { // Foreign key violation
            res.status(400).json({ message: 'Invalid category' });
        } else {
            res.status(500).json({ message: 'Error creating expense' });
        }
    }
});

// Update expense
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { amount, category_id, description } = req.body;

    // Input validation
    if (!amount || isNaN(amount) || amount <= 0) {
        return res.status(400).json({ message: 'Valid amount is required' });
    }
    if (!category_id || isNaN(category_id)) {
        return res.status(400).json({ message: 'Valid category is required' });
    }

    try {
        const result = await pool.query(
            'UPDATE expenses SET amount = $1, category_id = $2, description = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING id, CAST(amount AS DECIMAL(10,2)) as amount, category_id, description, date, created_at, updated_at',
            [parseFloat(amount), parseInt(category_id), description, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Expense not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating expense:', error);
        if (error.code === '23503') { // Foreign key violation
            res.status(400).json({ message: 'Invalid category' });
        } else {
            res.status(500).json({ message: 'Error updating expense' });
        }
    }
});

// Delete expense
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM expenses WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Expense not found' });
        }
        res.json({ message: 'Expense deleted successfully' });
    } catch (error) {
        console.error('Error deleting expense:', error);
        res.status(500).json({ message: 'Error deleting expense' });
    }
});

module.exports = router; 