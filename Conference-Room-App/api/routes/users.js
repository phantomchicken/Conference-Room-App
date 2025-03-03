const { PrismaClient } = require("@prisma/client");
const express = require("express");
const app = express();
const prisma = new PrismaClient();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve a list of users
 *     tags:
 *     - users
 *     responses:
 *       200:
 *         description: A list of users
 */
app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags:
 *     - users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *     responses:
 *       201:
 *         description: User created
 *       400:
 *         description: Validation error
 */
app.post("/users", async (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ error: "Missing name!" });
  } else if (req.body.name.length < 3) {
    return res.status(400).json({ error: "Name must be at least 3 characters!" });
  }

  const user = await prisma.user.create({ data: { name: req.body.name } });
  res.status(201).json(user);
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags:
 *     - users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single user
 */
app.get("/users/:id", async (req, res) => {
  const user = await prisma.user.findFirst({ where: { id: Number(req.params.id) } });
  res.status(200).json(user);
});

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user's name
 *     tags:
 *     - users
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
 *                 example: "Updated Name"
 *     responses:
 *       200:
 *         description: User updated
 */
app.put("/users/:id", async (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ error: "Missing name!" });
  } else if (req.body.name.length < 3) {
    return res.status(400).json({ error: "Name must be at least 3 characters!" });
  }

  const user = await prisma.user.update({ where: { id: Number(req.params.id) }, data: { name: req.body.name } });
  res.status(200).json(user);
});

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags:
 *     - users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: User deleted
 */
app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.delete({ where: { id: Number(id) } });
  res.status(204).send();
});

module.exports = app;
