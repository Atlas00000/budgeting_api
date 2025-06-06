#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Base URL
BASE_URL="http://localhost:3000/api/categories"

# Function to print test results
print_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓ $2${NC}"
    else
        echo -e "${RED}✗ $2${NC}"
    fi
}

# Function to extract ID from response
extract_id() {
    echo $1 | grep -o '"id":[0-9]*' | cut -d':' -f2
}

echo "Starting API Tests..."
echo "-------------------"

# Test 1: Create valid category
echo "Test 1: Creating valid category..."
response=$(curl -s -X POST $BASE_URL \
    -H "Content-Type: application/json" \
    -d '{"name": "Food", "description": "Groceries and dining expenses"}')
if [[ $response == *"Food"* ]]; then
    print_result 0 "Created valid category"
    # Extract and store the ID for later tests
    category_id=$(extract_id "$response")
    echo "Created category with ID: $category_id"
else
    print_result 1 "Failed to create valid category"
    exit 1
fi

# Test 2: Create invalid category (name too short)
echo "Test 2: Creating invalid category (name too short)..."
response=$(curl -s -X POST $BASE_URL \
    -H "Content-Type: application/json" \
    -d '{"name": "F", "description": "Invalid name"}')
if [[ $response == *"error"* ]]; then
    print_result 0 "Properly rejected invalid category"
else
    print_result 1 "Failed to reject invalid category"
fi

# Test 3: Get all categories
echo "Test 3: Getting all categories..."
response=$(curl -s $BASE_URL)
if [[ $response == *"Food"* ]]; then
    print_result 0 "Retrieved all categories"
else
    print_result 1 "Failed to retrieve categories"
fi

# Test 4: Get specific category
echo "Test 4: Getting specific category..."
response=$(curl -s $BASE_URL/$category_id)
if [[ $response == *"Food"* ]]; then
    print_result 0 "Retrieved specific category"
else
    print_result 1 "Failed to retrieve specific category"
fi

# Test 5: Update category
echo "Test 5: Updating category..."
response=$(curl -s -X PUT $BASE_URL/$category_id \
    -H "Content-Type: application/json" \
    -d '{"name": "Food & Dining", "description": "Updated description"}')
if [[ $response == *"success"* && ($response == *"Food & Dining"* || $response == *"Food &amp; Dining"*) ]]; then
    print_result 0 "Updated category"
else
    print_result 1 "Failed to update category"
    echo "Response: $response"
fi

# Test 6: Delete category
echo "Test 6: Deleting category..."
response=$(curl -s -X DELETE $BASE_URL/$category_id)
if [[ $response == *"success"* && $response == *"deleted"* ]]; then
    print_result 0 "Deleted category"
else
    print_result 1 "Failed to delete category"
fi

echo "-------------------"
echo "Tests completed!" 