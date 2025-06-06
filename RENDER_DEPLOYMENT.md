# Deploying to Render

## Prerequisites

1. **Render Account**
   - Sign up at [render.com](https://render.com)
   - Verify your email address
   - Add a payment method (Render requires this for PostgreSQL databases)

2. **GitHub Repository**
   - Ensure your code is in a GitHub repository
   - Repository should be public or connected to Render

## Deployment Steps

### 1. Database Setup

1. **Create PostgreSQL Database**
   - Go to Render Dashboard
   - Click "New +" and select "PostgreSQL"
   - Configure database:
     ```
     Name: budgeting-db
     Database: budgeting
     User: postgres
     Region: Choose closest to your users
     PostgreSQL Version: 14
     ```
   - Click "Create Database"
   - Save the following information:
     - Internal Database URL
     - External Database URL
     - Username
     - Password

2. **Database Migrations**
   - Render will automatically run migrations if you add a build command
   - Ensure your `database.sql` is in the correct location

### 2. Web Service Setup

1. **Create Web Service**
   - Go to Render Dashboard
   - Click "New +" and select "Web Service"
   - Connect your GitHub repository
   - Configure the service:
     ```
     Name: budgeting-api
     Environment: Node
     Region: Choose closest to your users
     Branch: main
     Build Command: pnpm install && pnpm build
     Start Command: node src/index.js
     ```

2. **Environment Variables**
   Add the following environment variables:
   ```
   NODE_ENV=production
   DB_HOST=<your-db-host>
   DB_USER=postgres
   DB_PASSWORD=<your-db-password>
   DB_NAME=budgeting
   DB_PORT=5432
   PORT=3000
   ```

### 3. Update Configuration

1. **Update Database Configuration**
   Modify `src/config/database.js`:
   ```javascript
   const { Pool } = require('pg');

   const pool = new Pool({
     connectionString: process.env.DATABASE_URL,
     ssl: {
       rejectUnauthorized: false
     }
   });

   module.exports = pool;
   ```

2. **Update Docker Configuration**
   Create `render.yaml` in your project root:
   ```yaml
   services:
     - type: web
       name: budgeting-api
       env: node
       buildCommand: pnpm install && pnpm build
       startCommand: node src/index.js
       envVars:
         - key: NODE_ENV
           value: production
         - key: DATABASE_URL
           fromDatabase:
             name: budgeting-db
             property: connectionString

     - type: postgres
       name: budgeting-db
       plan: free
   ```

### 4. Deployment Process

1. **Initial Deployment**
   ```bash
   # Commit your changes
   git add .
   git commit -m "Configure for Render deployment"
   git push origin main
   ```

2. **Monitor Deployment**
   - Go to Render Dashboard
   - Select your web service
   - Check "Events" tab for deployment progress
   - Monitor logs for any issues

### 5. Post-Deployment

1. **Verify Deployment**
   - Check if the application is running
   - Test all API endpoints
   - Verify database connections
   - Check environment variables

2. **Set Up Custom Domain (Optional)**
   - Go to your web service settings
   - Click "Custom Domain"
   - Add your domain
   - Follow DNS configuration instructions

### 6. Maintenance

1. **Monitoring**
   - Use Render's built-in monitoring
   - Check logs regularly
   - Monitor database usage
   - Set up alerts if needed

2. **Updates**
   - Push changes to GitHub
   - Render will automatically deploy
   - Monitor deployment logs
   - Verify functionality after updates

3. **Backups**
   - Render automatically backs up PostgreSQL databases
   - Manual backups can be downloaded from dashboard
   - Consider setting up additional backup solutions

### 7. Troubleshooting

1. **Common Issues**
   - Database connection errors
   - Environment variable issues
   - Build failures
   - Memory limits

2. **Solutions**
   - Check environment variables
   - Verify database credentials
   - Review build logs
   - Check application logs

### 8. Security Considerations

1. **Environment Variables**
   - Keep sensitive data in environment variables
   - Don't commit `.env` files
   - Use Render's secure environment variable storage

2. **Database Security**
   - Use SSL for database connections
   - Regularly update dependencies
   - Monitor for security issues

### 9. Cost Management

1. **Free Tier Limitations**
   - Web services: 750 hours/month
   - PostgreSQL: 1GB storage
   - Automatic sleep after inactivity

2. **Upgrading**
   - Monitor resource usage
   - Upgrade when needed
   - Consider paid plans for production

## Support

For deployment issues:
1. Check Render documentation
2. Review deployment logs
3. Contact Render support
4. Check GitHub issues

## Additional Resources

- [Render Documentation](https://render.com/docs)
- [PostgreSQL on Render](https://render.com/docs/databases)
- [Node.js on Render](https://render.com/docs/deploy-node-express-app)
- [Environment Variables](https://render.com/docs/environment-variables) 