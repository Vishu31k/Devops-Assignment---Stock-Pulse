# Stock Pulse — Full-Stack Stock Market Portfolio & Analysis Platform

> "Track smarter. Invest better."

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)]()
[![Docker](https://img.shields.io/badge/docker-ready-blue)]()
[![Jenkins](https://img.shields.io/badge/CI%2FCD-Jenkins-red)]()

## 📋 Overview

**Stock Pulse** is a full-stack stock market portfolio and analysis platform built with the MERN stack (MongoDB, Express.js, React, Node.js). It allows users to search stocks, view price charts, build portfolios, track profit/loss, and manage watchlists.

The project demonstrates a complete **DevOps CI/CD workflow** using **Jenkins**, **Docker**, and **GitHub**.

## 🏗️ Architecture

```
Browser (Stock Pulse UI)
        |
    Port 3000
        v
Frontend Container (React + Vite + nginx)
        |
   REST API (/api/*)
    Port 5000
        v
Backend Container (Node.js + Express + JWT)
        |
    ┌───┴───┐
    v       v
MongoDB   Alpha Vantage
Container   External API
```

### CI/CD Pipeline

```
Developer → git push → GitHub → Jenkins Pipeline
                                      |
                    ┌─────────────────┼─────────────────┐
                    v                 v                  v
              CI Phase          CD Phase           Post Phase
            (Checkout,        (Docker Hub,        (Notify
             Install,          Push,               Success/
             Test,             Deploy)             Failure)
             Build,
             Docker Build)
```

## 🚀 Features

- **User Authentication** — Register/Login with JWT tokens
- **Stock Search** — Search stocks by symbol or name
- **Stock Details** — View real-time price, change, volume
- **Price Charts** — Interactive charts with daily/weekly/monthly data
- **Portfolio Management** — Add/remove stocks, track buy price & quantity
- **Profit/Loss Tracking** — Real-time P&L calculation per stock & total
- **Watchlist** — Save stocks to watch later
- **Dashboard** — Market overview with portfolio & watchlist summaries
- **Mock Data Mode** — Works without API key using sample data

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React 18, Vite, Chart.js | UI, charts, SPA |
| Backend | Node.js, Express.js | REST API server |
| Database | MongoDB 7.0 | Persistent storage |
| Auth | JWT, bcryptjs | User authentication |
| Stock Data | Alpha Vantage API | Market data |
| Containerization | Docker, Docker Compose | Packaging & orchestration |
| CI/CD | Jenkins (Declarative Pipeline) | Build automation |
| Version Control | Git, GitHub | Source control |
| Image Registry | Docker Hub | Docker image storage |

## 📁 Project Structure

```
stock-pulse-jenkins-cicd/
├── backend/
│   ├── config/db.js              # MongoDB connection
│   ├── controllers/              # Route handlers
│   ├── middleware/                # JWT auth middleware
│   ├── models/                   # Mongoose schemas
│   ├── routes/                   # API route definitions
│   ├── tests/                    # Backend tests (Jest)
│   ├── server.js                 # Express entry point
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   ├── pages/                # Page components
│   │   ├── context/              # Auth context
│   │   ├── services/             # API service
│   │   └── App.jsx               # Root component
│   ├── tests/                    # Frontend tests (Vitest)
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml            # Multi-container orchestration
├── Jenkinsfile                   # CI/CD pipeline definition
├── .gitignore
├── .env.example
└── README.md
```

## ⚡ Quick Start

### Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose
- MongoDB (local or Docker)
- Git

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Vishu31k/Devops-Assignment---Stock-Pulse.git
   cd Devops-Assignment---Stock-Pulse
   ```

2. **Setup environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your values
   ```

3. **Start the backend:**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

4. **Start the frontend (new terminal):**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

5. **Open the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Docker Deployment

```bash
# Build and start all containers
docker compose up -d --build

# View running containers
docker ps

# View logs
docker compose logs -f

# Stop all containers
docker compose down
```

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 🔄 Jenkins CI/CD Pipeline

The pipeline includes 10 stages:

| # | Stage | Description |
|---|-------|-------------|
| 1 | Checkout | Pull code from GitHub |
| 2 | Install Backend Deps | `npm install` for backend |
| 3 | Install Frontend Deps | `npm install` for frontend |
| 4 | Backend Tests | Run Jest test suite |
| 5 | Frontend Tests | Run Vitest test suite |
| 6 | Frontend Build | Vite production build |
| 7 | Docker Build | Build & tag Docker images |
| 8 | Docker Hub Login | Authenticate with Docker Hub |
| 9 | Docker Push | Push images to Docker Hub |
| 10 | Deploy | Deploy with Docker Compose |

### Jenkins Setup

1. Install Jenkins with Pipeline, Git, and Docker plugins
2. Create a "Username with password" credential for Docker Hub (ID: `docker-hub-credentials`)
3. Create a new Pipeline job pointing to this repository
4. Set the Jenkinsfile path to `Jenkinsfile`
5. Build the pipeline

## 📝 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/profile` | Get user profile |

### Stocks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stocks/search?q=AAPL` | Search stocks |
| GET | `/api/stocks/:symbol` | Get stock details |
| GET | `/api/stocks/:symbol/chart` | Get chart data |

### Portfolio
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/portfolio` | Get portfolio |
| POST | `/api/portfolio/add` | Add stock |
| DELETE | `/api/portfolio/remove/:id` | Remove stock |
| GET | `/api/portfolio/summary` | Get P&L summary |

### Watchlist
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/watchlist` | Get watchlist |
| POST | `/api/watchlist/add` | Add to watchlist |
| DELETE | `/api/watchlist/remove/:id` | Remove from watchlist |

## 📄 License

This project is created for academic purposes as part of a DevOps course assignment.

## 👤 Author

**Vishu31k**
- GitHub: [Vishu31k](https://github.com/Vishu31k)
- Course: DevOps Tools
