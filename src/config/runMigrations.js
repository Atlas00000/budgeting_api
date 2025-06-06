const fs = require('fs');
const path = require('path');
const pool = require('./database');

async function runMigrations() {
    try {
        console.log('Starting database migrations...');
        
        // Read the SQL file
        const sqlPath = path.join(__dirname, 'database.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        // Split the SQL file into individual statements
        const statements = sql
            .split(';')
            .map(statement => statement.trim())
            .filter(statement => statement.length > 0);

        // Execute each statement
        for (const statement of statements) {
            try {
                await pool.query(statement);
                console.log('Executed SQL statement successfully');
            } catch (error) {
                // Skip if table already exists or other non-critical errors
                if (error.code === '42P07' || error.code === '42701') {
                    console.log('Table or column already exists, skipping...');
                    continue;
                }
                throw error;
            }
        }

        console.log('Database migrations completed successfully');
    } catch (error) {
        console.error('Error running migrations:', error);
        // Don't throw the error, just log it
        // This allows the app to start even if migrations fail
    }
}

module.exports = runMigrations; 