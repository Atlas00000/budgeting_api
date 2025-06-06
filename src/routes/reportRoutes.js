const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Get monthly report
router.get('/', async (req, res) => {
    const { month } = req.query;
    if (!month) {
        return res.status(400).json({ message: 'Month parameter is required' });
    }

    try {
        // Get the first and last day of the month
        const startDate = new Date(month + '-01');
        const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);

        // Get total expenses for the month
        const expensesResult = await pool.query(`
            SELECT COALESCE(SUM(amount), 0) as total_expenses
            FROM expenses
            WHERE date >= $1 AND date <= $2
        `, [startDate, endDate]);

        // Get total budget for the month
        const budgetsResult = await pool.query(`
            SELECT COALESCE(SUM(amount), 0) as total_budget
            FROM budgets
            WHERE month = $1
        `, [startDate]);

        // Get category breakdown
        const categoriesResult = await pool.query(`
            SELECT 
                c.id,
                c.name,
                COALESCE(b.amount, 0) as budget,
                COALESCE(SUM(e.amount), 0) as spent
            FROM categories c
            LEFT JOIN budgets b ON c.id = b.category_id AND b.month = $1
            LEFT JOIN expenses e ON c.id = e.category_id 
                AND e.date >= $2 AND e.date <= $3
            GROUP BY c.id, c.name, b.amount
            ORDER BY c.name
        `, [startDate, startDate, endDate]);

        res.json({
            total_expenses: parseFloat(expensesResult.rows[0].total_expenses),
            total_budget: parseFloat(budgetsResult.rows[0].total_budget),
            categories: categoriesResult.rows.map(row => ({
                id: row.id,
                name: row.name,
                budget: parseFloat(row.budget),
                spent: parseFloat(row.spent)
            }))
        });
    } catch (error) {
        console.error('Error generating report:', error);
        res.status(500).json({ message: 'Error generating report' });
    }
});

module.exports = router; 