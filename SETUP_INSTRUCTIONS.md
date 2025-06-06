# Setup Instructions

## Prerequisites

- Docker and Docker Compose
- Node.js (v18 or higher)
- pnpm (recommended) or npm
- PostgreSQL client (optional, for direct database access)

## Installation Steps

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd budgetingapi
   ```

2. **Install Dependencies**
   ```bash
   pnpm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   DB_HOST=postgres
   DB_USER=postgres
   DB_PASSWORD=postgres
   DB_NAME=budgeting
   DB_PORT=5432
   PORT=3000
   ```

4. **Start the Application**
   ```bash
   docker-compose up -d
   ```

5. **Run Database Migrations**
   ```bash
   PGPASSWORD=postgres docker-compose exec app psql -h postgres -U postgres -d budgeting -f src/config/database.sql
   ```

## Development Setup

1. **Install Development Dependencies**
   ```bash
   pnpm install -D
   ```

2. **Start Development Server**
   ```bash
   docker-compose up
   ```

3. **Access the Application**
   - Frontend: http://localhost:3000
   - API: http://localhost:3000/api

## Project Structure

```
budgetingapi/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   └── database.sql
│   ├── routes/
│   │   ├── categoryRoutes.js
│   │   ├── expenseRoutes.js
│   │   └── budgetRoutes.js
│   └── views/
│       └── index.html
├── docker-compose.yml
├── Dockerfile
├── package.json
└── .env
```

## Database Schema

The application uses PostgreSQL with the following tables:

1. **categories**
   - id (SERIAL PRIMARY KEY)
   - name (VARCHAR)
   - description (TEXT)
   - created_at (TIMESTAMP)
   - updated_at (TIMESTAMP)

2. **expenses**
   - id (SERIAL PRIMARY KEY)
   - amount (DECIMAL(10,2))
   - category_id (INTEGER REFERENCES categories)
   - description (TEXT)
   - date (TIMESTAMP)
   - created_at (TIMESTAMP)
   - updated_at (TIMESTAMP)

3. **budgets**
   - id (SERIAL PRIMARY KEY)
   - category_id (INTEGER REFERENCES categories)
   - amount (DECIMAL(10,2))
   - month (DATE)
   - created_at (TIMESTAMP)
   - updated_at (TIMESTAMP)

## Common Issues and Solutions

1. **Database Connection Issues**
   - Ensure PostgreSQL container is running
   - Check environment variables
   - Verify network connectivity

2. **Migration Errors**
   - Stop all containers
   - Remove existing volumes
   - Rebuild containers
   - Run migrations again

3. **Port Conflicts**
   - Check if port 3000 is available
   - Modify PORT in .env if needed

## Development Workflow

1. **Making Changes**
   - Create a new branch
   - Make your changes
   - Test locally
   - Submit a pull request

2. **Testing Changes**
   - Run the test script:
     ```bash
     node test.js
     ```
   - Check the browser console for errors
   - Verify API endpoints

3. **Database Changes**
   - Update database.sql
   - Run migrations
   - Test the changes

## Maintenance

1. **Regular Updates**
   - Update dependencies regularly
   - Check for security updates
   - Monitor error logs

2. **Backup**
   - Regular database backups
   - Version control for code
   - Document configuration changes

## Support

For issues and support:
1. Check the documentation
2. Review common issues
3. Submit an issue on GitHub
4. Contact the development team 