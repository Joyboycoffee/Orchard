# Hostinger & Production Deployment Guide

This document outlines step-by-step instructions for deploying Orchard onto Hostinger VPS / Node Hosting with PostgreSQL database and SSL setup.

---

## 1. Environment Preparation on Hostinger VPS

1. SSH into your Hostinger VPS:
   ```bash
   ssh root@your_vps_ip
   ```

2. Update system packages and install Node.js 20, Docker, and Nginx:
   ```bash
   apt update && apt upgrade -y
   curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
   apt install -y nodejs nginx git docker.io docker-compose
   ```

3. Global PM2 Process Manager Installation:
   ```bash
   npm install -g pm2
   ```

---

## 2. PostgreSQL & Redis Database Setup

You can run PostgreSQL either via Hostinger Managed PostgreSQL or through Docker:

### Option A: Running via Docker Compose
```bash
cd /var/www/Orchard
docker-compose -f docker/docker-compose.yml up -d postgres redis
```

### Option B: Hostinger Managed Database Connection String
Set `DATABASE_URL` in `.env`:
```env
DATABASE_URL="postgresql://username:password@hostinger_pg_host:5432/orchard_db?sslmode=require"
```

---

## 3. Application Build & Database Migration

1. Clone codebase and install production dependencies:
   ```bash
   cd /var/www
   git clone https://github.com/joyboycoffee/orchard.git Orchard
   cd Orchard
   npm ci
   ```

2. Generate Prisma Client and Run Database Migrations:
   ```bash
   npx prisma generate
   npx prisma db push
   npm run db:seed
   ```

3. Build Production Next.js 15 Bundle:
   ```bash
   npm run build
   ```

---

## 4. PM2 Process Launch

Launch cluster using `ecosystem.config.js`:
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

---

## 5. Nginx & SSL Certificate Setup

1. Copy Nginx configuration file:
   ```bash
   cp docker/nginx.conf /etc/nginx/sites-available/orchard
   ln -s /etc/nginx/sites-available/orchard /etc/nginx/sites-enabled/
   nginx -t
   systemctl reload nginx
   ```

2. Obtain Let's Encrypt Free SSL Certificate:
   ```bash
   apt install -y certbot python3-certbot-nginx
   certbot --nginx -d orchard-store.com -d www.orchard-store.com
   ```
