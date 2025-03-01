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
  if (!req.body.name) {
    return res.status(400).json({ error: 'Missing name!' });
  } else if (req.body.name.length < 3) {
    return res.status(400).json({ error: 'Name must be at least 3 characters!' });
  }

  const user = await prisma.user.create({ data: { name: req.body.name } });
  res.status(201).json(user);
});

app.put('/users/:id', async (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ error: 'Missing name!' });
  } else if (req.body.name.length < 3) {
    return res.status(400).json({ error: 'Name must be at least 3 characters!' });
  }

  const user = await prisma.user.update({ where: { id: Number(req.params.id) }, data: { name: req.body.name } });
  res.status(200).json(user);
});

app.delete('/users/:id', async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.delete({ where: { id: Number(id) } });
  res.status(204).send();
});

// Conference Rooms
app.get('/conference-rooms', async (req, res) => {
  const conferenceRooms = await prisma.conferenceRoom.findMany();
  res.json(conferenceRooms);
});

app.put('/conference-rooms/:id', async (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ error: 'Missing name!' });
  }

  const conferenceRoom = await prisma.conferenceRoom.update({ where: { id: Number(req.body.id) }, data: { name: req.body.name } });
  res.status(200).json(conferenceRoom);
});

app.post('/conference-rooms', async (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ error: 'Missing name!' });
  }

  const conferenceRoom = await prisma.conferenceRoom.create({ data: { name: req.body.name } });
  res.status(201).json(conferenceRoom);
});

app.delete('/conference-rooms/:id', async (req, res) => {
  const { id } = req.params;
  const conferenceRoom = await prisma.conferenceRoom.delete({ where: { id: Number(id) } });
  res.status(204).send();
});

// Reservations
app.get('/reservations', async (req, res) => {
  const reservations = await prisma.reservation.findMany({
    include: { participants: true, conferenceRoom: true }
  });
  res.json(reservations);
});

app.post('/reservations', async (req, res) => {
  const { conferenceRoomId, participantIds, startTime, endTime} = req.body;

  if (!conferenceRoomId || !participantIds) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const reservation = await prisma.reservation.create({
    data: {
      conferenceRoom: { connect: { id: conferenceRoomId } },
      participants: { connect: participantIds.map((id) => ({ id })) },
      startTime: new Date(startTime),
      endTime: new Date(endTime) 
    }
  });

  res.status(201).json(reservation);
});

app.delete('/reservations/:id', async (req, res) => {
  const { id } = req.params;
  const reservation = await prisma.reservation.delete({ where: { id: Number(id) } });
  res.status(204).send();
});

// Start server
app.listen(3000, () => console.log('Server running on http://localhost:3000'));
