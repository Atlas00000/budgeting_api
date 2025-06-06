# API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
Currently, the API does not require authentication. All endpoints are publicly accessible.

## Endpoints

### Categories

#### Get All Categories
```http
GET /categories
```
Response:
```json
[
  {
    "id": 1,
    "name": "Food",
    "description": "Groceries and dining out",
    "created_at": "2024-03-06T12:00:00.000Z",
    "updated_at": "2024-03-06T12:00:00.000Z"
  }
]
```

#### Create Category
```http
POST /categories
Content-Type: application/json

{
  "name": "Food",
  "description": "Groceries and dining out"
}
```
Response:
```json
{
  "id": 1,
  "name": "Food",
  "description": "Groceries and dining out",
  "created_at": "2024-03-06T12:00:00.000Z",
  "updated_at": "2024-03-06T12:00:00.000Z"
}
```

#### Update Category
```http
PUT /categories/:id
Content-Type: application/json

{
  "name": "Updated Food",
  "description": "Updated description"
}
```
Response:
```json
{
  "id": 1,
  "name": "Updated Food",
  "description": "Updated description",
  "created_at": "2024-03-06T12:00:00.000Z",
  "updated_at": "2024-03-06T12:30:00.000Z"
}
```

#### Delete Category
```http
DELETE /categories/:id
```
Response:
```json
{
  "message": "Category deleted successfully"
}
```

### Expenses

#### Get All Expenses
```http
GET /expenses
```
Response:
```json
[
  {
    "id": 1,
    "amount": "100.50",
    "category_id": 1,
    "description": "Grocery shopping",
    "date": "2024-03-06T12:00:00.000Z",
    "created_at": "2024-03-06T12:00:00.000Z",
    "updated_at": "2024-03-06T12:00:00.000Z",
    "category_name": "Food"
  }
]
```

#### Create Expense
```http
POST /expenses
Content-Type: application/json

{
  "amount": 100.50,
  "category_id": 1,
  "description": "Grocery shopping"
}
```
Response:
```json
{
  "id": 1,
  "amount": "100.50",
  "category_id": 1,
  "description": "Grocery shopping",
  "date": "2024-03-06T12:00:00.000Z",
  "created_at": "2024-03-06T12:00:00.000Z",
  "updated_at": "2024-03-06T12:00:00.000Z"
}
```

#### Update Expense
```http
PUT /expenses/:id
Content-Type: application/json

{
  "amount": 150.75,
  "category_id": 1,
  "description": "Updated grocery shopping"
}
```
Response:
```json
{
  "id": 1,
  "amount": "150.75",
  "category_id": 1,
  "description": "Updated grocery shopping",
  "date": "2024-03-06T12:00:00.000Z",
  "created_at": "2024-03-06T12:00:00.000Z",
  "updated_at": "2024-03-06T12:30:00.000Z"
}
```

#### Delete Expense
```http
DELETE /expenses/:id
```
Response:
```json
{
  "message": "Expense deleted successfully"
}
```

### Budgets

#### Get All Budgets
```http
GET /budgets
```
Response:
```json
[
  {
    "id": 1,
    "category_id": 1,
    "amount": "1000.00",
    "month": "2024-03-01T00:00:00.000Z",
    "created_at": "2024-03-06T12:00:00.000Z",
    "updated_at": "2024-03-06T12:00:00.000Z",
    "category_name": "Food"
  }
]
```

#### Create Budget
```http
POST /budgets
Content-Type: application/json

{
  "category_id": 1,
  "amount": 1000.00,
  "month": "2024-03-01"
}
```
Response:
```json
{
  "id": 1,
  "category_id": 1,
  "amount": "1000.00",
  "month": "2024-03-01T00:00:00.000Z",
  "created_at": "2024-03-06T12:00:00.000Z",
  "updated_at": "2024-03-06T12:00:00.000Z"
}
```

#### Update Budget
```http
PUT /budgets/:id
Content-Type: application/json

{
  "amount": 1500.00
}
```
Response:
```json
{
  "id": 1,
  "category_id": 1,
  "amount": "1500.00",
  "month": "2024-03-01T00:00:00.000Z",
  "created_at": "2024-03-06T12:00:00.000Z",
  "updated_at": "2024-03-06T12:30:00.000Z"
}
```

#### Delete Budget
```http
DELETE /budgets/:id
```
Response:
```json
{
  "message": "Budget deleted successfully"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "message": "Valid amount is required"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Error message description"
}
```

## Data Types

### Amount
- Type: Decimal
- Format: DECIMAL(10,2)
- Example: 100.50

### Date
- Type: ISO 8601
- Format: YYYY-MM-DDTHH:mm:ss.sssZ
- Example: "2024-03-06T12:00:00.000Z"

### Month (for budgets)
- Type: Date
- Format: YYYY-MM-DD
- Example: "2024-03-01" 