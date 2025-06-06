const { Pool } = require('pg');

// Log the connection attempt (without sensitive data)
console.log('Attempting to connect to database...');
console.log('Database host:', process.env.DB_HOST || 'from DATABASE_URL');
console.log('Environment:', process.env.NODE_ENV || 'development');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? {
        rejectUnauthorized: false
    } : false
});

// Test database connection
pool.connect((err, client, release) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        console.error('Connection details:', {
            host: process.env.DB_HOST || 'from DATABASE_URL',
            port: process.env.DB_PORT || 'from DATABASE_URL',
            database: process.env.DB_NAME || 'from DATABASE_URL',
            user: process.env.DB_USER || 'from DATABASE_URL',
            ssl: process.env.NODE_ENV === 'production' ? 'enabled' : 'disabled'
        });
    } else {
        console.log('Successfully connected to database');
        release();
    }
});

module.exports = pool; 