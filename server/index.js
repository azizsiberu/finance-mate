require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { errorHandler, notFound } = require("./middlewares/errorHandler");
const swaggerSetup = require("./config/swagger");

// Import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const transactionRoutes = require("./routes/transactions");
const subscriptionRoutes = require("./routes/subscriptions");
const budgetRoutes = require("./routes/budgets");
const goalRoutes = require("./routes/goals");
const categoryRoutes = require("./routes/categories");

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Setup Swagger Documentation
swaggerSetup(app);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/categories", categoryRoutes);

// Home route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to FinanceMate API",
    version: "1.0.0",
    status: "active",
    docs: "/api-docs",
  });
});

// 404 handler - Use the centralized not found handler
app.use(notFound);

// Global error handler - Use the centralized error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT} in ${
      process.env.NODE_ENV || "development"
    } mode`
  );
  console.log(
    `API Documentation available at http://localhost:${PORT}/api-docs`
  );
});

module.exports = app;
