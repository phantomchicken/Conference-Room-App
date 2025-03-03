const { PrismaClient } = require('@prisma/client');
const express = require('express');
const app = express();
const prisma = new PrismaClient();

/**
 * @swagger
 * /reservations:
 *   get:
 *     summary: Get a list of reservations
 *     tags:
 *     - reservations
 *     responses:
 *       200:
 *         description: A list of reservations
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
 *                   startTime:
 *                     type: string
 *                   endTime:
 *                     type: string
 *                   conferenceRoom:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                   participants:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         name:
 *                           type: string
 */
app.get('/reservations', async (req, res) => {
    const reservations = await prisma.reservation.findMany({
        include: { participants: true, conferenceRoom: true }
    });
    res.status(200).json(reservations);
});

/**
 * @swagger
 * /reservations/{id}:
 *   get:
 *     summary: Get a specific reservation by ID
 *     tags:
 *     - reservations
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A reservation object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 startTime:
 *                   type: string
 *                 endTime:
 *                   type: string
 *                 conferenceRoom:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                 participants:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 */
app.get('/reservations/:id', async (req, res) => {
    const { id } = req.params;
    const reservation = await prisma.reservation.findUnique({
        where: { id: Number(id) },
        include: { participants: true, conferenceRoom: true }
    });
    res.status(200).json(reservation);
});

/**
 * @swagger
 * /reservations:
 *   post:
 *     summary: Create a new reservation
 *     tags:
 *     - reservations
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               conferenceRoomId:
 *                 type: integer
 *               participantIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *               startTime:
 *                 type: string
 *                 format: date-time
 *               endTime:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Reservation created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 startTime:
 *                   type: string
 *                 endTime:
 *                   type: string
 *                 conferenceRoom:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                 participants:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 */
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

/**
 * @swagger
 * /reservations/{id}:
 *   put:
 *     summary: Update a reservation by ID
 *     tags:
 *     - reservations
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
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
 *     responses:
 *       200:
 *         description: Reservation updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 startTime:
 *                   type: string
 *                 endTime:
 *                   type: string
 *                 conferenceRoom:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                 participants:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 */
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
 *     tags:
 *     - reservations
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