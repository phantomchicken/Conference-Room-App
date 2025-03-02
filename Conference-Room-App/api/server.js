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

app.get('/users/:id', async (req, res) => {
  const user = await prisma.user.findFirst({ where: { id: Number(req.params.id) } });
  res.status(200).json(user);
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

app.get('/conference-rooms/:id', async (req, res) => {
  const conferenceRoom = await prisma.conferenceRoom.findFirst({ where: { id: Number(req.params.id) } });
  res.status(200).json(conferenceRoom);
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
  res.status(200).json(reservations);
});

app.get('/reservations/:id', async (req, res) => {
  const { id } = req.params;
  const reservation = await prisma.reservation.findUnique({
    where: { id: Number(id) },
    include: { participants: true, conferenceRoom: true }
  });
  res.status(200).json(reservation);
})

app.post('/reservations', async (req, res) => {
  const { name, conferenceRoomId, participantIds, startTime, endTime} = req.body;

  if (!name || !conferenceRoomId || !participantIds) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const reservation = await prisma.reservation.create({
    data: {
      name: name,
      conferenceRoom: { connect: { id: conferenceRoomId } },
      participants: { connect: participantIds.map((id) => ({ id })) },
      startTime: new Date(startTime),
      endTime: new Date(endTime) 
    }
  });

  res.status(201).json(reservation);
});

app.put('/reservations/:id', async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const updatedReservation = await prisma.reservation.update({
    where: { id: Number(id) },
    data: { name },
  });

  res.status(200).json(updatedReservation);
});

app.delete('/reservations/:id', async (req, res) => {
  const { id } = req.params;
  const reservation = await prisma.reservation.delete({ where: { id: Number(id) } });
  res.status(204).send();
});


app.delete('/admin/clear-data', async (req, res) => {
  try {
    console.log('Clearing database...');
    await prisma.user.deleteMany();
    await prisma.reservation.deleteMany();
    await prisma.conferenceRoom.deleteMany();
    res.status(200).send({ message: 'Database cleared successfully.' });
  } catch (e) {
    console.error(e);
    res.status(500).send({ error: 'Error clearing database' });
  }
});

app.post('/admin/seed-data', async (req, res) => {
  try {
    console.log('Seeding database...');
    
    await prisma.user.createMany({
      data: [
        { name: 'Alice' },
        { name: 'Bob' },
        { name: 'Charlie' }
      ]
    });

    await prisma.conferenceRoom.createMany({
      data: [
        { name: 'Room A' },
        { name: 'Room B' },
        { name: 'Room C' }
      ]
    });

    const users = await prisma.user.findMany();
    const rooms = await prisma.conferenceRoom.findMany();

    const startTime1 = new Date('2025-05-01T10:00:00');
    const endTime1 = new Date('2025-05-01T11:00:00');
    const startTime2 = new Date('2025-05-02T11:00:00');
    const endTime2 = new Date('2025-05-02T12:00:00');
    const startTime3 = new Date('2025-05-03T12:00:00');
    const endTime3 = new Date('2025-05-03T13:00:00');

    const reservations = await prisma.reservation.createMany({
      data: [
        { name: 'Reservation 1', conferenceRoomId: rooms[0].id, startTime: startTime1, endTime: endTime1 },
        { name: 'Reservation 2', conferenceRoomId: rooms[1].id, startTime: startTime2, endTime: endTime2 },
        { name: 'Reservation 3', conferenceRoomId: rooms[2].id, startTime: startTime3, endTime: endTime3 }
      ]
    });

    const reservationList = await prisma.reservation.findMany();
    
    await prisma.reservation.update({
      where: { id: reservationList[0].id },
      data: { participants: { connect: [{ id: users[0].id }, { id: users[1].id }] } }
    });

    await prisma.reservation.update({
      where: { id: reservationList[1].id },
      data: { participants: { connect: [{ id: users[2].id }] } }
    });

    await prisma.reservation.update({
      where: { id: reservationList[2].id },
      data: { participants: { connect: [{ id: users[1].id }, { id: users[2].id }] } }
    });

    res.status(200).send({ message: 'Database seeded successfully.' });
  } catch (e) {
    console.error(e);
    res.status(500).send({ error: 'Error seeding database' });
  }
});


// Start server
app.listen(3000, () => console.log('Server running on http://localhost:3000'));
