# Testing Documentation

## Overview

This document outlines the testing procedures and guidelines for the Budgeting API application. Following the Development Commandments, we maintain a simple and focused testing approach.

## Test Types

### 1. Unit Tests
- Test individual components
- Focus on specific functionality
- Mock external dependencies

### 2. Integration Tests
- Test component interactions
- Verify API endpoints
- Test database operations

### 3. End-to-End Tests
- Test complete user flows
- Verify frontend-backend integration
- Test real user scenarios

## Test Scripts

### API Test Script (test.js)

```javascript
const fetch = require('node-fetch');
const API_URL = 'http://localhost:3000/api';

async function testExpenses() {
    // Test expense creation and retrieval
}

async function testBudgets() {
    // Test budget creation and retrieval
}

async function runTests() {
    // Run all tests
}
```

## Running Tests

### 1. Setup Test Environment
```bash
# Install dependencies
pnpm install

# Start the application
docker-compose up -d

# Run database migrations
PGPASSWORD=postgres docker-compose exec app psql -h postgres -U postgres -d budgeting -f src/config/database.sql
```

### 2. Run Tests
```bash
# Run API tests
node test.js
```

## Test Cases

### Categories

1. **Create Category**
   - Input: Valid category data
   - Expected: Category created successfully
   - Status: 201

2. **Get Categories**
   - Input: None
   - Expected: List of categories
   - Status: 200

3. **Update Category**
   - Input: Valid update data
   - Expected: Category updated
   - Status: 200

4. **Delete Category**
   - Input: Valid category ID
   - Expected: Category deleted
   - Status: 200

### Expenses

1. **Create Expense**
   - Input: Valid expense data
   - Expected: Expense created
   - Status: 201

2. **Get Expenses**
   - Input: None
   - Expected: List of expenses
   - Status: 200

3. **Update Expense**
   - Input: Valid update data
   - Expected: Expense updated
   - Status: 200

4. **Delete Expense**
   - Input: Valid expense ID
   - Expected: Expense deleted
   - Status: 200

### Budgets

1. **Create Budget**
   - Input: Valid budget data
   - Expected: Budget created
   - Status: 201

2. **Get Budgets**
   - Input: None
   - Expected: List of budgets
   - Status: 200

3. **Update Budget**
   - Input: Valid update data
   - Expected: Budget updated
   - Status: 200

4. **Delete Budget**
   - Input: Valid budget ID
   - Expected: Budget deleted
   - Status: 200

## Error Cases

### 1. Invalid Input
- Test with missing required fields
- Test with invalid data types
- Test with negative amounts

### 2. Database Errors
- Test with non-existent foreign keys
- Test with duplicate entries
- Test with invalid date formats

### 3. API Errors
- Test with invalid endpoints
- Test with invalid HTTP methods
- Test with malformed requests

## Test Data

### Sample Category
```json
{
  "name": "Test Category",
  "description": "For testing purposes"
}
```

### Sample Expense
```json
{
  "amount": 100.50,
  "category_id": 1,
  "description": "Test expense"
}
```

### Sample Budget
```json
{
  "category_id": 1,
  "amount": 1000.00,
  "month": "2024-03-01"
}
```

## Test Results

### Expected Output Format
```json
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Operation successful"
}
```

### Error Output Format
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE"
  }
}
```

## Manual Testing

### Frontend Testing
1. Open http://localhost:3000
2. Test all CRUD operations
3. Verify data display
4. Check error handling
5. Test form validation

### API Testing
1. Use Postman or similar tool
2. Test all endpoints
3. Verify response formats
4. Check error responses
5. Test edge cases

## Performance Testing

### Load Testing
- Test with multiple concurrent requests
- Monitor response times
- Check database performance
- Verify error handling under load

### Memory Usage
- Monitor application memory
- Check for memory leaks
- Verify garbage collection
- Test with large datasets

## Security Testing

### Input Validation
- Test SQL injection prevention
- Test XSS prevention
- Test input sanitization
- Verify error messages

### Authentication (Future)
- Test user authentication
- Test authorization
- Verify session handling
- Test password policies

## Continuous Integration

### GitHub Actions
```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run tests
        run: node test.js
```

## Test Maintenance

### Regular Updates
- Update test cases
- Add new test scenarios
- Remove obsolete tests
- Update test data

### Documentation
- Keep test documentation current
- Document new test cases
- Update test procedures
- Maintain test results

## Support

For testing issues:
1. Check test documentation
2. Review test cases
3. Check test environment
4. Contact development team 