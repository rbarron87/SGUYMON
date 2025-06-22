# SGUYMON Project Management App

## Requirements
- Docker & Docker Compose
- Node.js >= 18

## Setup

### 1. Start PostgreSQL Database
```
docker-compose up -d
```

### 2. Backend Setup
```
cd server
npm install
npm run db:init   # To create tables
npm start
```

### 3. Frontend Setup
```
cd client
npm install
npm install -D tailwindcss postcss autoprefixer
npm start
```

The backend will run on http://localhost:4000
The frontend will run on http://localhost:3000

---

## Environment Variables
Edit `server/.env` if you want to change database credentials.

---

## Database
- PG Admin: http://localhost:5050 (optional, if you add it to docker-compose)
- DB Host: `localhost`, Port: `5432`, User: `sguymon_user`, Password: `sguymon_pass`, DB: `sguymon_db` 