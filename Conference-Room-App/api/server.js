const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(bodyParser.json());

// Get all users
app.get('/users', async (req, res) => {
    const users = await prisma.user.findMany();
    res.json(users);
});

// Add a user
app.post('/users', async (req, res) => {
    const { name } = req.body;
    const user = await prisma.user.create({ data: { name } });
    res.json(user);
});

// Start server
app.listen(3000, () => console.log('Server running on http://localhost:3000'));
