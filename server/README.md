# FinanceMate Server (Backend)

This is the backend API server for FinanceMate, a comprehensive personal finance management system specifically designed for young couples.

## Tech Stack

- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **Supabase**: Database and authentication service
- **PostgreSQL**: Database (via Supabase)
- **JWT**: JSON Web Tokens for authentication
- **Swagger/OpenAPI**: API documentation

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
SUPABASE_ANON_KEY=your_supabase_anon_key
JWT_SECRET=your_jwt_secret
CORS_ORIGIN=http://localhost:3000
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
│   ├── supabase.js   # Supabase client configuration
│   └── swagger.js    # API documentation setup
├── controllers/      # Request handlers
│   ├── authController.js        # Authentication logic
│   ├── budgetController.js      # Budget management
│   ├── categoryController.js    # Categories operations
│   ├── goalController.js        # Financial goals
│   ├── subscriptionController.js # Subscription tracking
│   └── transactionController.js  # Transaction management
├── middlewares/      # Express middlewares
│   ├── auth.js         # JWT authentication middleware
│   ├── errorHandler.js # Error handling
│   └── validation.js   # Request validation
├── models/           # Data models
│   ├── Budget.js       # Budget model
│   ├── Category.js     # Category model
│   ├── Goal.js         # Financial goal model
│   ├── Subscription.js # Subscription model
│   ├── Transaction.js  # Transaction model
│   └── User.js         # User model
├── routes/           # API routes
│   ├── auth.js         # Authentication routes
│   ├── budgets.js      # Budget endpoints
│   ├── categories.js   # Category endpoints
│   ├── goals.js        # Financial goal endpoints
│   ├── subscriptions.js # Subscription endpoints
│   ├── transactions.js # Transaction endpoints
│   └── users.js        # User management routes
├── utils/            # Utility functions, migrations, seeders
│   ├── db-schema.sql   # Database schema SQL
│   ├── helpers.js      # Helper utilities
│   ├── migrate.js      # Database migration runner
│   ├── seed.js         # Database seeder
│   ├── migrations/     # Individual migration files
│   └── seeders/        # Seeder data files
├── index.js          # Entry point
└── package.json      # Dependencies and scripts
```

## API Documentation

API documentation is available at http://localhost:5000/api-docs when the server is running, powered by Swagger. The interactive documentation allows you to:

- View all available endpoints
- Understand request/response schemas
- Test API calls directly from the browser
- Authenticate using JWT tokens

### Main API Endpoints

#### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get authentication token
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset user password
- `POST /api/auth/verify-token` - Verify JWT token validity

#### User Management

- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update current user profile
- `PUT /api/users/change-password` - Change user password
- `GET /api/users/preferences` - Get user preferences
- `PUT /api/users/preferences` - Update user preferences

#### Transactions

- `GET /api/transactions` - List all transactions (with filtering)
- `POST /api/transactions` - Create a new transaction
- `GET /api/transactions/:id` - Get transaction details
- `PUT /api/transactions/:id` - Update a transaction
- `DELETE /api/transactions/:id` - Delete a transaction
- `GET /api/transactions/stats` - Get transaction statistics

#### Categories

- `GET /api/categories` - List all categories
- `POST /api/categories` - Create a new category
- `GET /api/categories/:id` - Get category details
- `PUT /api/categories/:id` - Update a category
- `DELETE /api/categories/:id` - Delete a category

#### Budgets

- `GET /api/budgets` - List all budgets
- `POST /api/budgets` - Create a new budget
- `GET /api/budgets/:id` - Get budget details
- `PUT /api/budgets/:id` - Update a budget
- `DELETE /api/budgets/:id` - Delete a budget
- `GET /api/budgets/performance` - Get budget performance

#### Subscriptions

- `GET /api/subscriptions` - List all subscriptions
- `POST /api/subscriptions` - Create a new subscription
- `GET /api/subscriptions/:id` - Get subscription details
- `PUT /api/subscriptions/:id` - Update a subscription
- `DELETE /api/subscriptions/:id` - Delete a subscription
- `GET /api/subscriptions/upcoming` - Get upcoming payments

#### Financial Goals

- `GET /api/goals` - List all financial goals
- `POST /api/goals` - Create a new financial goal
- `GET /api/goals/:id` - Get goal details
- `PUT /api/goals/:id` - Update a financial goal
- `DELETE /api/goals/:id` - Delete a financial goal
- `PUT /api/goals/:id/progress` - Update goal progress

## Database Schema

The database schema includes the following tables:

### `users`

- `id`: UUID primary key
- `email`: String, unique
- `password`: String (hashed)
- `first_name`: String
- `last_name`: String
- `profile_picture`: String (URL)
- `created_at`: Timestamp
- `updated_at`: Timestamp
- `preferences`: JSON

### `transactions`

- `id`: UUID primary key
- `user_id`: UUID foreign key
- `amount`: Decimal
- `type`: String (income/expense)
- `description`: String
- `category_id`: UUID foreign key
- `date`: Date
- `created_at`: Timestamp
- `updated_at`: Timestamp
- `notes`: Text
- `is_shared`: Boolean
- `attachment`: String (URL)

### `categories`

- `id`: UUID primary key
- `name`: String
- `type`: String (income/expense)
- `icon`: String
- `color`: String
- `user_id`: UUID foreign key (null for defaults)
- `created_at`: Timestamp
- `updated_at`: Timestamp

### `budgets`

- `id`: UUID primary key
- `user_id`: UUID foreign key
- `name`: String
- `amount`: Decimal
- `period`: String (weekly/monthly/yearly)
- `start_date`: Date
- `end_date`: Date
- `category_id`: UUID foreign key
- `created_at`: Timestamp
- `updated_at`: Timestamp
- `rollover`: Boolean

### `subscriptions`

- `id`: UUID primary key
- `user_id`: UUID foreign key
- `name`: String
- `amount`: Decimal
- `frequency`: String
- `billing_date`: Date
- `category_id`: UUID foreign key
- `created_at`: Timestamp
- `updated_at`: Timestamp
- `auto_renew`: Boolean
- `notification`: Boolean
- `notes`: Text

### `goals`

- `id`: UUID primary key
- `user_id`: UUID foreign key
- `name`: String
- `target_amount`: Decimal
- `current_amount`: Decimal
- `deadline`: Date
- `priority`: Integer
- `created_at`: Timestamp
- `updated_at`: Timestamp
- `category_id`: UUID foreign key
- `notes`: Text
- `is_shared`: Boolean

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. After logging in, you'll receive a token that needs to be included in the Authorization header for protected endpoints:

```
Authorization: Bearer <your-jwt-token>
```

## Error Handling

The API uses consistent error response formats:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message description"
  }
}
```

Common error codes:

- `VALIDATION_ERROR`: Request data failed validation
- `AUTHENTICATION_ERROR`: Authentication failed
- `NOT_FOUND`: Requested resource not found
- `PERMISSION_DENIED`: Not authorized to access resource
- `SERVER_ERROR`: Internal server error

## Migrations and Seeders

- Run migrations: `node utils/migrate.js`
- Run seeders: `node utils/seed.js`
- Individual migrations are in the `utils/migrations` directory
- Seeders are in the `utils/seeders` directory

## Development Guidelines

### Adding New Endpoints

1. Create route handler in the appropriate controller
2. Add route definition in the corresponding route file
3. Add Swagger documentation annotations
4. Implement validation middleware if needed
5. Test with Swagger UI

### Modifying Database Schema

1. Create a new migration file in `utils/migrations`
2. Update the corresponding model
3. Update the Swagger schemas
4. Run the migration script

## Deployment

### Heroku

```bash
heroku create financemate-api
heroku config:set $(cat .env)
git push heroku main
```

### Railway

```bash
railway login
railway init
railway up
```

### DigitalOcean App Platform

1. Create a new app from the DigitalOcean dashboard
2. Connect your GitHub repository
3. Configure environment variables
4. Deploy the app

## Related

- [Frontend Repository](../client/README.md) - The client application for FinanceMate
