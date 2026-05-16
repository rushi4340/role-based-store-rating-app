# Store Rating Platform

A full-stack role-based store rating application built with NestJS and React.

## Tech Stack

**Backend:** NestJS, PostgreSQL, Prisma ORM, JWT Authentication  
**Frontend:** React, Plain CSS  

## Project Structure

```
├── backend/       # NestJS API server
│   ├── src/       # Application source code
│   └── prisma/    # Database schema and migrations
├── frontend/      # React application
│   └── src/       # React components and pages
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL
- npm

### Backend Setup
```sh
cd backend
npm install
# Update .env with your PostgreSQL connection string
npx prisma migrate dev
npm run start:dev
```

### Frontend Setup
```sh
cd frontend
npm install
npm run dev
```
