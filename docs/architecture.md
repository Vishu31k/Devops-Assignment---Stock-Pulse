# Stock Pulse — System Architecture

## Application Architecture

Stock Pulse follows a **three-tier architecture**:

### Tier 1: Presentation Layer (Frontend)
- **Technology**: React 18 + Vite
- **Served by**: nginx (in Docker)
- **Port**: 3000
- **Responsibilities**:
  - User interface rendering
  - Client-side routing (React Router)
  - Authentication state management (React Context)
  - Stock chart visualization (Chart.js)
  - API calls to backend via Axios

### Tier 2: Application Layer (Backend)
- **Technology**: Node.js + Express.js
- **Port**: 5000
- **Responsibilities**:
  - REST API endpoints
  - User authentication (JWT)
  - Business logic (portfolio P&L calculations)
  - External API integration (Alpha Vantage)
  - Request validation and error handling

### Tier 3: Data Layer (Database)
- **Technology**: MongoDB 7.0
- **Port**: 27017
- **Responsibilities**:
  - User data persistence
  - Portfolio storage
  - Watchlist storage

### External Service
- **Alpha Vantage API**: Provides real-time and historical stock market data
- **Fallback**: Mock data when API key is not configured

## Data Flow

```
User Action (e.g., Search "AAPL")
    |
    v
React Frontend (SearchBar component)
    |
    | HTTP GET /api/stocks/search?q=AAPL
    v
Express Backend (stockController.searchStocks)
    |
    | HTTP GET to Alpha Vantage API
    v
Alpha Vantage (or Mock Data)
    |
    | JSON response
    v
Express Backend (formats response)
    |
    | JSON response
    v
React Frontend (renders StockCard components)
    |
    v
User sees search results
```

## DevOps Architecture

```
Developer writes code locally
    |
    | git add, git commit, git push
    v
GitHub Repository (stock-pulse-jenkins-cicd)
    |
    | Webhook / Poll trigger
    v
Jenkins Pipeline (10 stages)
    |
    ├── CI Phase
    │   ├── Stage 1: Checkout (pull code)
    │   ├── Stage 2: Install Backend Deps
    │   ├── Stage 3: Install Frontend Deps
    │   ├── Stage 4: Backend Tests (Jest)
    │   ├── Stage 5: Frontend Tests (Vitest)
    │   ├── Stage 6: Frontend Build (Vite)
    │   └── Stage 7: Docker Build (images)
    │
    ├── CD Phase
    │   ├── Stage 8: Docker Hub Login
    │   ├── Stage 9: Docker Push (images)
    │   └── Stage 10: Deploy (docker compose)
    │
    └── Post Phase
        └── Success / Failure notification
            |
            v
        Running Application
        ├── stockpulse_frontend (port 3000)
        ├── stockpulse_backend  (port 5000)
        └── stockpulse_mongodb  (port 27017)
```

## Container Architecture

| Container | Image Base | Port | Connects To |
|-----------|-----------|------|-------------|
| stockpulse_frontend | nginx:alpine | 3000 | backend (via proxy) |
| stockpulse_backend | node:18-alpine | 5000 | db (MongoDB), Alpha Vantage |
| stockpulse_mongodb | mongo:7.0 | 27017 | — |

All containers communicate over a shared Docker bridge network (`stockpulse-network`).
