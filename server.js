const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// In-memory Users Data
let users = [
  { id: 1, name: 'Pandukumar' , city: 'Wgl' , position: "angular developer" },
  { id: 2, name: 'Madhu kumar', city: 'Hyd' , position: "react developer"},
];

// Basic Authentication Middleware
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token || token !== 'Bearer mysecrettoken') {
    return res.status(401).json({ message: 'Unauthorized. Invalid token.' });
  }

  next();
};

// Swagger Definition
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Node.js Express CRUD API with Authentication and Swagger',
      version: '1.0.0',
      description: 'A simple CRUD API with authentication and Swagger documentation',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT', // Custom token format
        },
      },
    },
  },
  apis: ['./server.js'], // Swagger API docs in this file
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Default Route
app.get('/', (req, res) => {
  res.send('Welcome to the API server with CRUD, Auth, and Swagger!');
});

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Retrieve all users
 *     description: Get a list of all users.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 */
app.get('/api/v1/users', authenticateToken, (req, res) => {
  res.json(users);
});

/**
 * @swagger
 * /api/v1/users:
 *   post:
 *     summary: Add a new user
 *     description: Add a new user to the list.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: User added successfully.
 */
app.post('/api/v1/users', authenticateToken, (req, res) => {
  const { name , city , position } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Name is required' });
  }

  const newUser = { id: users.length + 1, name ,city, position};
  users.push(newUser);

  res.status(201).json(newUser);
});

/**
 * @swagger
 * /api/v1/users/{id}:
 *   put:
 *     summary: Update a user
 *     description: Update a user's details.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to update.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Madhu Kumar"
 *               city:
 *                 type: string
 *                 example: "Hyderabad"
 *               position:
 *                 type: string
 *                 example: "React Developer"
 *     responses:
 *       200:
 *         description: User updated successfully.
 *       404:
 *         description: User not found.
 */
app.put('/api/v1/users/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { name, city, position } = req.body;
  
    const user = users.find((u) => u.id === parseInt(id));
  
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
  
    // Update the fields dynamically
    user.name = name || user.name;
    user.city = city || user.city;
    user.position = position || user.position;
  
    res.json(user);
  });
  

/**
 * @swagger
 * /api/v1/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     description: Delete a user by ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to delete.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User deleted successfully.
 *       404:
 *         description: User not found.
 */
app.delete('/api/v1/users/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  const userIndex = users.findIndex((u) => u.id === parseInt(id));

  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
  }

  users.splice(userIndex, 1);

  res.json({ message: 'User deleted successfully' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});
