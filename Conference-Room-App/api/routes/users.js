
const { PrismaClient } = require('@prisma/client');
const express = require('express');
const app = express();
const prisma = new PrismaClient();

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

module.exports = app;