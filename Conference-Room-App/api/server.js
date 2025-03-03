const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const { swaggerUi, specs } = require('./swagger');

const userRoutes = require('./routes/users');
const conferenceRoomRoutes = require('./routes/conferenceRooms');
const reservationRoutes = require('./routes/reservations');
const databaseRoutes = require('./routes/database');

app.use(cors());
app.use(bodyParser.json());

app.use('/', userRoutes)
app.use('/', conferenceRoomRoutes)
app.use('/', reservationRoutes)
app.use('/', databaseRoutes)
app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));

// Start server
app.listen(3000, () => console.log('Server running on http://localhost:3000. Docs available on http://localhost:3000/docs'));
module.exports = app;