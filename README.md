# ⚡ Shortly — URL Shortener

A clean URL shortener with a **Python (FastAPI)** backend and **React (Vite)** frontend.

## Features

- 🔗 Shorten any URL to a 6-character code
- 📋 Copy short links to clipboard
- 🔥 Click tracking & analytics
- 🗑️ Delete links
- 🌙 Dark-themed glassmorphism UI

## Project Structure

```
short-link/
├── docker-compose.yml
├── backend/
│   ├── Dockerfile
│   ├── main.py
│   ├── database.py
│   ├── routes.py
│   ├── schemas.py
│   └── requirements.txt
└── frontend/
    ├── Dockerfile
    ├── nginx.conf
    └── src/
        ├── App.jsx
        ├── index.css
        └── components/
            ├── ShortenForm.jsx
            ├── LinkCard.jsx
            └── LinkList.jsx
```

## Getting Started

### Docker (Production)

```bash
docker compose up -d --build
```

The app will be available at `http://localhost` (port 80). That's it!

### Local Development

#### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

The UI will be at `http://localhost:5173` with API requests proxied to the backend.

## API Endpoints

| Method   | Endpoint           | Description                     |
| -------- | ------------------ | ------------------------------- |
| `POST`   | `/api/links`       | Create a short link             |
| `GET`    | `/api/links`       | List all links (newest first)   |
| `GET`    | `/api/links/:id`   | Get link details                |
| `DELETE` | `/api/links/:id`   | Delete a link                   |
| `GET`    | `/:code`           | Redirect to original URL (302)  |

## Tech Stack

- **Backend:** FastAPI, sqlite3, Uvicorn
- **Frontend:** React, Vite, Nginx
- **Database:** SQLite (file-based, zero config)
- **Deployment:** Docker Compose