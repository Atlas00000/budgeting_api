const fetch = require('node-fetch');

const API_URL = 'http://localhost:3000/api';

async function testExpenses() {
    console.log('\nTesting Expenses:');
    
    // Create a category first
    const categoryResponse = await fetch(`${API_URL}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Test Category', description: 'For testing' })
    });
    const category = await categoryResponse.json();
    console.log('Created test category:', category.name);

    // Create expense
    const expenseData = {
        amount: 100.50,
        category_id: category.id,
        description: 'Test expense'
    };
    
    const expenseResponse = await fetch(`${API_URL}/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expenseData)
    });
    
    if (!expenseResponse.ok) {
        throw new Error(`Failed to create expense: ${await expenseResponse.text()}`);
    }
    
    const expense = await expenseResponse.json();
    console.log('Created expense:', expense);
    
    // Get all expenses
    const expensesResponse = await fetch(`${API_URL}/expenses`);
    const expenses = await expensesResponse.json();
    console.log('All expenses:', expenses);
}

async function testBudgets() {
    console.log('\nTesting Budgets:');
    
    // Create budget
    const budgetData = {
        category_id: 1,
        amount: 1000.00,
        month: '2024-03-01'
    };
    
    const budgetResponse = await fetch(`${API_URL}/budgets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(budgetData)
    });
    
    if (!budgetResponse.ok) {
        throw new Error(`Failed to create budget: ${await budgetResponse.text()}`);
    }
    
    const budget = await budgetResponse.json();
    console.log('Created budget:', budget);
    
    // Get all budgets
    const budgetsResponse = await fetch(`${API_URL}/budgets`);
    const budgets = await budgetsResponse.json();
    console.log('All budgets:', budgets);
}

async function runTests() {
    try {
        await testExpenses();
        await testBudgets();
        console.log('\nAll tests completed successfully!');
    } catch (error) {
        console.error('Test failed:', error);
        process.exit(1);
    }
}

runTests(); 