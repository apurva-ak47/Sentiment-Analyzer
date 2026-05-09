# Smart Review Analyzer — Frontend

Modern React + Tailwind dashboard for AI-powered review sentiment.

## Features

- Login / signup with full backend auth (JWT)
- Protected dashboard route
- Real-time review analyzer with color-coded sentiment + confidence bars
- CSV drag-and-drop bulk upload with preview table
- Sentiment distribution pie chart + confidence bar chart
- Keyword extraction badges
- Dark / light mode toggle
- CSV export of dataset results

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. (Optional) point at a different backend by editing `.env`:
   ```
   VITE_API_BASE_URL=http://localhost:5000/api
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   The app runs on http://localhost:4173

## Backend

The Node.js + MongoDB backend lives in `../Backend`. Start it with:
```bash
cd ../Backend
npm install
npm run dev
```

Endpoints used by the frontend:
- `POST /api/auth/signup`, `POST /api/auth/login`
- `POST /api/analyze`, `GET /api/analyze/history`
- `POST /api/upload-csv`
