const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Conference Room API',
      version: '1.0.0',
      description: 'API for managing users, conference rooms, and reservations',
    },
    servers: [{ url: 'http://localhost:3000' }],
  },
  apis: ['./routes/reservations.js', './routes/users.js', './routes/conferenceRooms.js', './routes/database.js'],
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };
