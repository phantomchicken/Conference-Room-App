
const { PrismaClient } = require('@prisma/client');
const express = require('express');
const app = express();
const prisma = new PrismaClient();

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

module.exports = app;