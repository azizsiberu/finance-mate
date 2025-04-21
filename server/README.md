# FinanceMate Server (Backend)

This is the backend API server for FinanceMate, a comprehensive personal finance management system.

## Tech Stack

- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **Supabase**: Database and authentication service
- **PostgreSQL**: Database (via Supabase)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Supabase account and project

### Installation

1. Install dependencies
```bash
npm install
# or
yarn install
```

2. Create a `.env` file with the following variables:
```env
PORT=5000
NODE_ENV=development
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_service_role_key
JWT_SECRET=your_jwt_secret
```

3. Run database migrations
```bash
node utils/migrate.js
```

4. Seed the database with initial data
```bash
node utils/seed.js
```

5. Start the development server
```bash
npm run dev
# or
yarn dev
```

The server will run at http://localhost:5000 by default.

### Building for Production

```bash
npm start
# or
yarn start
```

## Project Structure

```
server/
├── config/           # Configuration files
├── controllers/      # Request handlers
├── middlewares/      # Express middlewares
├── models/           # Data models
├── routes/           # API routes
├── utils/            # Utility functions, migrations, seeders
├── index.js          # Entry point
└── package.json      # Dependencies and scripts
```

## API Documentation

API documentation is available at http://localhost:5000/api-docs when the server is running, powered by Swagger.

### Main API Endpoints

- `/api/auth` - Authentication routes
- `/api/users` - User management
- `/api/transactions` - Transaction CRUD operations
- `/api/categories` - Categories management
- `/api/budgets` - Budget tracking
- `/api/subscriptions` - Subscription management
- `/api/goals` - Financial goals

## Database Schema

The database schema includes the following tables:
- `users` - User accounts
- `transactions` - Financial transactions
- `categories` - Transaction categories
- `budgets` - Budget plans
- `subscriptions` - Recurring expenses
- `goals` - Financial goals

## Migrations and Seeders

- Run migrations: `node utils/migrate.js`
- Run seeders: `node utils/seed.js`
- Individual migrations are in the `utils/migrations` directory
- Seeders are in the `utils/seeders` directory

## Related

- [Frontend Repository](../client/README.md) - The client application for FinanceMate