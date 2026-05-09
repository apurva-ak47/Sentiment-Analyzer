# Sentiment Analyzer Backend

Node.js + Express + MongoDB backend powering the Smart Review Analyzer dashboard.

## Stack

- Express (REST API)
- MongoDB via Mongoose (auth + analysis persistence)
- JWT auth (Bearer tokens)
- `sentiment` package for scoring + lightweight keyword extraction
- Multer + csv-parse for CSV uploads

## Quick start

```bash
cd Backend
cp .env.example .env       # edit values if needed
npm install
npm run dev                # or: npm start
```

MongoDB must be running locally (default `mongodb://127.0.0.1:27017/sentiment_analyzer`)
or set `MONGODB_URI` to a remote cluster.

## Endpoints

All `/api/analyze` and `/api/upload-csv` routes require `Authorization: Bearer <token>`.

| Method | Path                | Body / Form                              | Description                              |
|--------|---------------------|------------------------------------------|------------------------------------------|
| GET    | `/api/health`       | —                                        | Health check                             |
| POST   | `/api/auth/signup`  | `{ email, password, name? }`             | Create account, returns `{ token, user }`|
| POST   | `/api/auth/login`   | `{ email, password }`                    | Login, returns `{ token, user }`         |
| GET    | `/api/auth/me`      | —                                        | Current user from token                  |
| POST   | `/api/analyze`      | `{ review }`                             | Analyze a single review                  |
| GET    | `/api/analyze/history` | —                                     | Last 50 analyses for the user            |
| POST   | `/api/upload-csv`   | multipart `file` (csv)                   | Bulk-analyze a CSV (looks for review/comment/text column or first column) |

### Response shape — `/api/analyze`

```json
{
  "sentiment": "Positive",
  "scores": [
    { "label": "Positive", "value": 0.78 },
    { "label": "Negative", "value": 0.10 },
    { "label": "Neutral",  "value": 0.12 }
  ],
  "keywords": ["fast", "great", "support"],
  "distribution": [70, 20, 10]
}
```

### Response shape — `/api/upload-csv`

```json
{
  "rows": [
    { "review": "...", "sentiment": "Positive", "scoreLabel": "84%", "keywords": ["..."] }
  ],
  "distribution": [60, 25, 15],
  "total": 42
}
```

## Environment

| Var            | Default                                         | Notes                              |
|----------------|-------------------------------------------------|------------------------------------|
| `PORT`         | `5000`                                          |                                    |
| `MONGODB_URI`  | `mongodb://127.0.0.1:27017/sentiment_analyzer`  |                                    |
| `JWT_SECRET`   | —                                               | Must be set; long random string    |
| `JWT_EXPIRES_IN` | `7d`                                          |                                    |
| `CORS_ORIGIN`  | `http://localhost:4173`                         | Comma-separated list allowed       |
