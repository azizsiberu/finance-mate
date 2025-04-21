const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'FinanceMate API',
    version: '1.0.0',
    description: 'API documentation for FinanceMate - personal finance management application',
    contact: {
      name: 'FinanceMate Team',
      email: 'info@financemate.com',
    },
    license: {
      name: 'MIT',
    },
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Development server',
    },
    {
      url: 'https://api.financemate.com',
      description: 'Production server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  tags: [
    {
      name: 'Auth',
      description: 'Authentication operations',
    },
    {
      name: 'Users',
      description: 'User management operations',
    },
    {
      name: 'Transactions',
      description: 'Financial transactions operations',
    },
    {
      name: 'Subscriptions',
      description: 'Subscription management operations',
    },
    {
      name: 'Budgets',
      description: 'Budget management operations',
    },
    {
      name: 'Goals',
      description: 'Financial goals operations',
    },
    {
      name: 'Categories',
      description: 'Category management operations',
    },
  ],
};

// Options for the swagger docs
const options = {
  swaggerDefinition,
  // Path to the API docs
  apis: [
    './routes/*.js',
    './models/*.js',
    './controllers/*.js',
    './docs/**/*.yaml',
  ],
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

// Function to setup swagger in express
const swaggerSetup = (app) => {
  // Swagger page
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Docs in JSON format
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  console.log('Swagger docs available at /api-docs');
};

module.exports = swaggerSetup;