# **Budgeting API PRD**

## **1\. Overview**

### **1.1 Purpose**

The Budgeting API is a backend-focused portfolio project designed to demonstrate proficiency in building a RESTful API using Express.js and MySQL, with a simple frontend GUI using vanilla HTML and inline CSS. The application enables users to manage personal finances by categorizing expenses, setting monthly budget caps, generating spending reports, and supporting multiple currencies. Data encryption at rest ensures security, adhering to industry best practices while maintaining simplicity for a low/mid-level project.

### **1.2 Scope**

This PRD defines the functional requirements for:

* A RESTful API built with Express.js and MySQL.  
* Features: expense categorization, monthly budget caps, spending reports (CSV export), multi-currency support, and data encryption at rest.  
* A basic GUI using vanilla HTML with inline CSS for user interaction.  
* An admin page for viewing aggregated data and exporting reports.  
* No authentication or protected routing to prioritize functionality and rapid feedback.

### **1.3 Target Audience**

* Portfolio evaluators (hiring managers, recruiters) assessing backend development skills.  
* Users seeking a simple budgeting tool for personal finance management.

## **2\. Features**

### **2.1 Expense Categorization**

* **Description**: Users can categorize expenses (e.g., Food, Transportation, Entertainment) to track spending habits.  
* **Requirements**:  
  * API endpoint to create, read, update, and delete (CRUD) expense categories.  
  * API endpoint to assign categories to expenses.  
  * Store categories and expenses in MySQL with appropriate relationships (e.g., foreign keys).  
  * GUI: Dropdown menu to select or add categories when logging expenses.

### **2.2 Monthly Budget Caps**

* **Description**: Users can set monthly budget limits per category and receive warnings when approaching or exceeding limits.  
* **Requirements**:  
  * API endpoint to set, update, and retrieve monthly budget caps per category.  
  * API endpoint to check spending against budget caps and return status (e.g., under, near, over).  
  * MySQL table to store budget caps with category and month-year references.  
  * GUI: Form to set budget caps and display current spending vs. cap.

### **2.3 Spending Reports (CSV Export)**

* **Description**: Users can generate and export spending reports as CSV files, summarizing expenses by category and month.  
* **Requirements**:  
  * API endpoint to generate a report based on date range and category filters.  
  * API endpoint to export the report as a downloadable CSV file.  
  * MySQL queries to aggregate expense data by category and date.  
  * GUI: Button to trigger report generation and download.  
  * Admin Page: Display summary statistics (e.g., total spent per category) and export option.

### **2.4 Multi-Currency Support**

* **Description**: Users can log expenses in different currencies, with conversions to a base currency (e.g., USD) for consistent reporting.  
* **Requirements**:  
  * API endpoint to log expenses with currency codes (e.g., USD, EUR, GBP).  
  * Integrate a free exchange rate API (e.g., ExchangeRate-API) for real-time conversion.  
  * Store expenses in MySQL with original currency and converted amount (base currency).  
  * GUI: Dropdown to select currency when logging expenses; display converted amounts.

### **2.5 Data Encryption at Rest**

* **Description**: Sensitive data (e.g., expense amounts, descriptions) is encrypted in the MySQL database to ensure security.  
* **Requirements**:  
  * Use MySQL’s built-in encryption functions (e.g., AES\_ENCRYPT/AES\_DECRYPT) for sensitive fields.  
  * Store encryption keys securely (e.g., environment variables).  
  * Ensure API retrieves decrypted data transparently for authorized requests.

## **3\. Technical Requirements**

### **3.1 Backend**

* **Stack**: Express.js (Node.js) \+ MySQL.  
* **Database Schema**:  
  * `categories`: id (PK), name, description.  
  * `budgets`: id (PK), category\_id (FK), month\_year, cap\_amount.  
  * `expenses`: id (PK), category\_id (FK), amount, currency, converted\_amount, description (encrypted), date.  
  * `currencies`: id (PK), code (e.g., USD, EUR), exchange\_rate\_to\_usd.  
* **API Endpoints** (RESTful):  
  * `POST /categories`: Create a category.  
  * `GET /categories`: List all categories.  
  * `PUT /categories/:id`: Update a category.  
  * `DELETE /categories/:id`: Delete a category.  
  * `POST /expenses`: Create an expense (with category, currency, amount, description).  
  * `GET /expenses`: List expenses (filter by date, category).  
  * `PUT /expenses/:id`: Update an expense.  
  * `DELETE /expenses/:id`: Delete an expense.  
  * `POST /budgets`: Set a monthly budget cap for a category.  
  * `GET /budgets`: List budget caps (filter by month, category).  
  * `GET /reports`: Generate spending report (filter by date, category).  
  * `GET /reports/export`: Export report as CSV.  
* **Libraries**:  
  * `express`: For building the RESTful API.  
  * `mysql2`: For MySQL database connectivity.  
  * `axios`: For fetching exchange rates from a third-party API.  
  * `csv-writer`: For generating CSV reports.  
  * `dotenv`: For managing environment variables (e.g., database credentials, encryption keys).  
* **Best Practices**:  
  * Input validation using `express-validator`.  
  * Error handling with consistent HTTP status codes (e.g., 400, 404, 500).  
  * Environment variables for sensitive configurations.  
  * Modular code structure (e.g., separate routes, controllers, services).  
  * Basic logging for debugging (e.g., using `winston`).

### **3.2 Frontend**

* **Stack**: Vanilla HTML with inline CSS (no JavaScript framework for simplicity).  
* **Pages**:  
  * **User Page**:  
    * Form to log expenses (fields: amount, currency, category, description, date).  
    * Form to set monthly budget caps (fields: category, month, cap amount).  
    * Display current spending vs. budget caps.  
    * Button to generate and download spending reports.  
  * **Admin Page**:  
    * Summary table of total spending per category.  
    * Form to filter reports by date and category.  
    * Button to export reports as CSV.  
* **Design Principles**:  
  * Simple, clean layout with inline CSS (no external stylesheets).  
  * Responsive design for basic mobile compatibility (e.g., using percentage-based widths).  
  * Minimal JavaScript for form submission (e.g., fetch API to call backend endpoints).

### **3.3 Security**

* **Data Encryption at Rest**:  
  * Use MySQL’s AES encryption for sensitive fields (e.g., expense descriptions).  
  * Store encryption keys in environment variables (not hardcoded).  
* **No Authentication**: As per requirements, skip user authentication to focus on functionality.  
* **Input Sanitization**: Use `express-validator` to prevent SQL injection and XSS.

## **4\. Non-Functional Requirements**

* **Performance**: API response time \< 500ms for typical queries (e.g., list expenses).  
* **Scalability**: MySQL schema supports indexing for efficient queries (e.g., on date, category\_id).  
* **Maintainability**: Modular code structure with clear separation of concerns (routes, controllers, database logic).  
* **Portability**: Use environment variables for database credentials and API keys to ensure easy deployment.

## **5\. Assumptions and Constraints**

* **Assumptions**:  
  * Users have access to a modern browser for the GUI.  
  * A free exchange rate API (e.g., ExchangeRate-API) is available for currency conversions.  
  * MySQL is hosted locally or on a cloud provider with standard configurations.  
* **Constraints**:  
  * No authentication or protected routing to keep the project simple.  
  * Frontend limited to vanilla HTML and inline CSS for rapid development.  
  * No complex state management or frontend framework to avoid overengineering.

## **6\. Milestones and Deliverables**

1. **Backend Setup** (Week 1):  
   * Set up Express.js server and MySQL database.  
   * Define database schema and migrations.  
   * Implement encryption for sensitive fields.  
2. **API Development** (Weeks 2-3):  
   * Build CRUD endpoints for categories, expenses, and budgets.  
   * Implement report generation and CSV export.  
   * Integrate exchange rate API for multi-currency support.  
3. **Frontend Development** (Week 4):  
   * Create user page with forms for expenses and budgets.  
   * Create admin page with summary table and report export.  
   * Style with inline CSS for basic responsiveness.  
4. **Testing and Refinement** (Week 5):  
   * Test API endpoints using Postman or curl.  
   * Test GUI functionality in multiple browsers.  
   * Fix bugs and optimize queries for performance.  
5. **Documentation and Deployment** (Week 6):  
   * Write README with setup instructions and API documentation.  
   * Deploy to a local server or free hosting (e.g., Render, Heroku).  
   * Package code for portfolio submission.

## **7\. Success Criteria**

* **Functional**: All features (expense categorization, budget caps, reports, multi-currency, encryption) work as specified.  
* **Code Quality**: Clean, modular code following Express.js and MySQL best practices.  
* **Portfolio Impact**: Demonstrates backend skills (API design, database management, security) with a simple, functional GUI.  
* **Usability**: GUI is intuitive for logging expenses, setting budgets, and exporting reports.

## **8\. Future Enhancements (Out of Scope)**

* Add user authentication and role-based access.  
* Implement a frontend framework (e.g., React) for dynamic UI.  
* Add real-time budget alerts via email or notifications.  
* Support historical exchange rate data for accurate past conversions.

