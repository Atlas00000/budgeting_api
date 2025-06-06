# Deployment Guide

## Production Deployment

### Prerequisites

1. **Server Requirements**
   - Linux-based server (Ubuntu 20.04 LTS recommended)
   - Docker and Docker Compose installed
   - Git installed
   - Node.js v18 or higher
   - pnpm (recommended) or npm

2. **Domain and SSL**
   - Registered domain name
   - SSL certificate (Let's Encrypt recommended)

### Deployment Steps

1. **Server Setup**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y

   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh

   # Install Docker Compose
   sudo curl -L "https://github.com/docker/compose/releases/download/v2.24.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```

2. **Application Deployment**
   ```bash
   # Clone repository
   git clone <repository-url>
   cd budgetingapi

   # Create production environment file
   cp .env.example .env.production
   ```

3. **Environment Configuration**
   Edit `.env.production`:
   ```env
   NODE_ENV=production
   DB_HOST=postgres
   DB_USER=postgres
   DB_PASSWORD=<secure-password>
   DB_NAME=budgeting
   DB_PORT=5432
   PORT=3000
   ```

4. **SSL Setup (Using Let's Encrypt)**
   ```bash
   # Install Certbot
   sudo apt install certbot python3-certbot-nginx -y

   # Obtain SSL certificate
   sudo certbot --nginx -d yourdomain.com
   ```

5. **Nginx Configuration**
   Create `/etc/nginx/sites-available/budgetingapi`:
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       return 301 https://$server_name$request_uri;
   }

   server {
       listen 443 ssl;
       server_name yourdomain.com;

       ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

6. **Enable Nginx Configuration**
   ```bash
   sudo ln -s /etc/nginx/sites-available/budgetingapi /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

7. **Start Application**
   ```bash
   # Build and start containers
   docker-compose -f docker-compose.prod.yml up -d --build

   # Run migrations
   PGPASSWORD=<secure-password> docker-compose -f docker-compose.prod.yml exec app psql -h postgres -U postgres -d budgeting -f src/config/database.sql
   ```

### Production Docker Compose

Create `docker-compose.prod.yml`:
```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.prod
    restart: always
    environment:
      - NODE_ENV=production
    env_file:
      - .env.production
    depends_on:
      - postgres

  postgres:
    image: postgres:14-alpine
    restart: always
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - POSTGRES_DB=budgeting
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Production Dockerfile

Create `Dockerfile.prod`:
```dockerfile
FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN pnpm install --production

COPY . .

EXPOSE 3000

CMD ["node", "src/index.js"]
```

## Monitoring and Maintenance

### Logging
```bash
# View application logs
docker-compose -f docker-compose.prod.yml logs -f app

# View database logs
docker-compose -f docker-compose.prod.yml logs -f postgres
```

### Backup
```bash
# Database backup
docker-compose -f docker-compose.prod.yml exec postgres pg_dump -U postgres budgeting > backup.sql

# Restore database
cat backup.sql | docker-compose -f docker-compose.prod.yml exec -T postgres psql -U postgres -d budgeting
```

### Updates
```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose -f docker-compose.prod.yml up -d --build
```

## Security Considerations

1. **Firewall Configuration**
   ```bash
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw enable
   ```

2. **Regular Updates**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y

   # Update Docker images
   docker-compose -f docker-compose.prod.yml pull
   ```

3. **SSL Renewal**
   ```bash
   # Test renewal
   sudo certbot renew --dry-run

   # Add to crontab
   echo "0 0 1 * * /usr/bin/certbot renew --quiet" | sudo tee -a /etc/crontab
   ```

## Troubleshooting

1. **Application Issues**
   - Check application logs
   - Verify environment variables
   - Ensure database connectivity

2. **Database Issues**
   - Check database logs
   - Verify database backups
   - Check disk space

3. **Network Issues**
   - Verify firewall rules
   - Check SSL certificate validity
   - Test domain resolution

## Rollback Procedure

1. **Code Rollback**
   ```bash
   git checkout <previous-version>
   docker-compose -f docker-compose.prod.yml up -d --build
   ```

2. **Database Rollback**
   ```bash
   # Restore from backup
   cat backup.sql | docker-compose -f docker-compose.prod.yml exec -T postgres psql -U postgres -d budgeting
   ```

## Support

For deployment issues:
1. Check logs
2. Review configuration
3. Contact system administrator
4. Submit issue on GitHub 