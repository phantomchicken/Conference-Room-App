const { PrismaClient } = require('@prisma/client');
const express = require('express');
const app = express();
const prisma = new PrismaClient();

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

  module.exports = app;