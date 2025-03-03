
const { PrismaClient } = require('@prisma/client');
const express = require('express');
const app = express();
const prisma = new PrismaClient();

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
    const { name, conferenceRoomId, participantIds, startTime, endTime } = req.body;

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

/**
 * @swagger
 * /reservations/{id}:
 *   delete:
 *     summary: Delete a reservation
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Deleted successfully
 */
app.delete('/reservations/:id', async (req, res) => {
    const { id } = req.params;
    const reservation = await prisma.reservation.delete({ where: { id: Number(id) } });
    res.status(204).send();
});

module.exports = app;