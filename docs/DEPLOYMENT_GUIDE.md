# Smart IT Project Cost Estimation System — Deployment Guide

## Prerequisites

- **Node.js** 18.x or higher
- **MySQL** 8.0 or higher
- **npm** 9.x or higher
- **Git** (optional, for version control)

---

## 1. Clone Repository

```bash
git clone <repository-url>
cd smart-it-estimation
```

---

## 2. Database Setup

### Create MySQL Database

```bash
mysql -u root -p < database/schema.sql
```

### Seed Initial Data

```bash
cd backend
cp .env.example .env
# Edit .env with your MySQL credentials
npm install
npm run seed
```

**Default Admin Credentials:**
- Email: `admin@smartit.com`
- Password: `admin123`

> Change the admin password immediately in production.

---

## 3. Backend Deployment

### Development

```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env`:

```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=smart_it_estimation
JWT_SECRET=generate_a_strong_random_secret
JWT_EXPIRES_IN=24h
CORS_ORIGIN=http://localhost:5173
```

```bash
npm run dev
```

### Production

```bash
cd backend
npm install --production
NODE_ENV=production node server.js
```

**Recommended:** Use PM2 for process management:

```bash
npm install -g pm2
pm2 start server.js --name smart-it-api
pm2 save
pm2 startup
```

---

## 4. Frontend Deployment

### Development

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Access: `http://localhost:5173`

### Production Build

```bash
cd frontend
npm install
```

Create `frontend/.env.production`:

```env
VITE_API_URL=https://api.yourdomain.com/api
```

```bash
npm run build
```

Serve the `dist/` folder with Nginx, Apache, or a CDN.

---

## 5. Nginx Reverse Proxy (Production)

```nginx
# Frontend
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/smart-it/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}

# Backend API
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable HTTPS with Let's Encrypt:

```bash
sudo certbot --nginx -d yourdomain.com -d api.yourdomain.com
```

---

## 6. Environment Variables Checklist

### Backend (Required)

| Variable | Description |
|----------|-------------|
| PORT | API server port |
| DB_HOST | MySQL host |
| DB_USER | MySQL username |
| DB_PASSWORD | MySQL password |
| DB_NAME | Database name |
| JWT_SECRET | Strong random secret (32+ chars) |
| CORS_ORIGIN | Frontend URL |

### Frontend (Required)

| Variable | Description |
|----------|-------------|
| VITE_API_URL | Backend API base URL |

---

## 7. Docker Deployment (Optional)

Create `docker-compose.yml` at project root:

```yaml
version: '3.8'
services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: smart_it_estimation
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
      - ./database/schema.sql:/docker-entrypoint-initdb.d/1-schema.sql

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      DB_HOST: mysql
      DB_USER: root
      DB_PASSWORD: rootpassword
      DB_NAME: smart_it_estimation
      JWT_SECRET: change_me_in_production
      CORS_ORIGIN: http://localhost:3000
    depends_on:
      - mysql

  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    depends_on:
      - backend

volumes:
  mysql_data:
```

---

## 8. Post-Deployment Checklist

- [ ] Change default admin password
- [ ] Set strong JWT_SECRET
- [ ] Enable HTTPS
- [ ] Configure database backups
- [ ] Set NODE_ENV=production
- [ ] Configure firewall (only ports 80/443 public)
- [ ] Test API health: `GET /api/health`
- [ ] Test estimation flow end-to-end
- [ ] Verify PDF download works

---

## 9. Troubleshooting

| Issue | Solution |
|-------|----------|
| CORS errors | Verify CORS_ORIGIN matches frontend URL |
| DB connection failed | Check credentials, MySQL running, firewall |
| 401 on admin routes | Token expired — re-login |
| Empty features/types | Run `npm run seed` in backend |
| PDF not downloading | Check browser popup blocker |

---

## 10. Monitoring

- Use PM2 monitoring: `pm2 monit`
- Log API errors to file or service (e.g., Winston + CloudWatch)
- Set up MySQL slow query log for performance tuning
- Monitor disk space for estimation records growth
