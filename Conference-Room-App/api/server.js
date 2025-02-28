const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(bodyParser.json());

// Users
app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.post('/users', async (req, res) => {
  const { name } = req.body;
  const user = await prisma.user.create({ data: { name } });
  res.json(user);
});

// Conference Rooms
app.get('/conference-rooms', async (req, res) => {
  const conferenceRooms = await prisma.conferenceRoom.findMany();
  res.json(conferenceRooms);
});

app.post('/conference-rooms', async (req, res) => {
  const { name } = req.body;
  const conferenceRoom = await prisma.conferenceRoom.create({ data: { name } });
  res.json(conferenceRoom);
});

// Reservations
app.get('/reservations', async (req, res) => {
  const reservations = await prisma.reservation.findMany({
    include: { participants: true, conferenceRoom: true }
  });
  res.json(reservations);
});

app.post('/reservations', async (req, res) => {
  const { conferenceRoomId, participantIds } = req.body;

  const reservation = await prisma.reservation.create({
    data: {
      conferenceRoom: { connect: { id: conferenceRoomId } },
      participants: { connect: participantIds.map((id) => ({ id })) }
    }
  });

  res.json(reservation);
});

// Start server
app.listen(3000, () => console.log('Server running on http://localhost:3000'));
