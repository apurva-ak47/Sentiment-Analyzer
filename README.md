# Sentiment Analyzer

A full-stack AI-powered Sentiment Analyzer application deployed on AWS.

## Live Demo

### Frontend
dyqeqiicfucwh.cloudfront.net

### Backend API
https://api.myanalyzerapp.com/api/health

---

# Features

- User Authentication (JWT)
- Sentiment Analysis API
- CSV Upload Support
- Secure REST APIs
- MongoDB Atlas Integration
- AWS Cloud Deployment
- HTTPS Enabled with SSL
- Responsive Frontend

---

# Tech Stack

## Frontend
- React.js
- Vite
- Tailwind CSS
- Axios

## Backend
- Node.js
- Express.js
- JWT Authentication
- Multer
- CORS

## Database
- MongoDB Atlas

## Deployment
- AWS S3
- AWS CloudFront
- AWS EC2
- AWS Route 53
- Nginx
- PM2
- Certbot SSL

---

# Project Structure

```bash
Sentiment-Analyzer/
│
├── Frontend/
│   ├── src/
│   ├── public/
│   └── vite.config.js
│
├── Backend/
│   ├── src/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   └── server.js
│
└── README.md
```

---

# Environment Variables

## Frontend (.env)

```env
VITE_API_BASE_URL=https://api.myanalyzerapp.com/api
```

## Backend (.env)

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key
CORS_ORIGIN=https://app.myanalyzerapp.com
```

---

# Local Development Setup

## Clone Repository

```bash
git clone https://github.com/your-username/sentiment-analyzer.git
cd sentiment-analyzer
```

---

## Frontend Setup

```bash
cd Frontend
npm install
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

---

## Backend Setup

```bash
cd Backend
npm install
npm run dev
```

Backend runs on:

```bash
http://localhost:5000
```

---

# AWS Deployment Architecture

```text
Users
   ↓
CloudFront (HTTPS)
   ↓
S3 Static Hosting
   ↓
React Frontend

Frontend API Calls
   ↓
Route53
   ↓
Nginx + SSL (HTTPS)
   ↓
EC2 Node.js Backend
   ↓
MongoDB Atlas
```

---

# Deployment Steps

## Frontend Deployment

1. Build frontend

```bash
npm run build
```

2. Upload `dist` folder to AWS S3
3. Configure CloudFront distribution
4. Connect custom domain using Route53
5. Enable HTTPS

---

## Backend Deployment

### Install Dependencies

```bash
sudo apt update
sudo apt install nginx -y
sudo npm install -g pm2
```

### Start Backend

```bash
pm2 start server.js
```

### Configure Nginx

```nginx
server {
    listen 80;
    server_name api.myanalyzerapp.com;

    location / {
        proxy_pass http://localhost:5000;

        proxy_http_version 1.1;

        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Enable SSL

```bash
sudo certbot --nginx
```

---

# API Endpoints

## Health Check

```http
GET /api/health
```

## Authentication

```http
POST /api/auth/register
POST /api/auth/login
```

## Sentiment Analysis

```http
POST /api/analyze
```

## CSV Upload

```http
POST /api/upload-csv
```

---

# Security Features

- HTTPS Enabled
- JWT Authentication
- CORS Protection
- Environment Variables
- Secure MongoDB Atlas Connection
- Reverse Proxy via Nginx

---

# Future Improvements

- Docker Deployment
- CI/CD Pipeline
- Kubernetes Support
- AI Model Improvements
- User Dashboard
- Analytics

---

# Author

Developed by Apurva Kohad

---

# License

This project is licensed under the MIT License.
