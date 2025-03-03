const { PrismaClient } = require("@prisma/client");
const express = require("express");
const app = express();
const prisma = new PrismaClient();

/**
 * @swagger
 * /conference-rooms:
 *   get:
 *     summary: Retrieve a list of conference rooms
 *     tags:
 *     - conference-rooms
 *     responses:
 *       200:
 *         description: A list of conference rooms
 */
app.get("/conference-rooms", async (req, res) => {
  const conferenceRooms = await prisma.conferenceRoom.findMany();
  res.json(conferenceRooms);
});

/**
 * @swagger
 * /conference-rooms/{id}:
 *   get:
 *     summary: Get a conference room by ID
 *     tags:
 *     - conference-rooms
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single conference room
 */
app.get("/conference-rooms/:id", async (req, res) => {
  const conferenceRoom = await prisma.conferenceRoom.findFirst({ where: { id: Number(req.params.id) } });
  res.status(200).json(conferenceRoom);
});

/**
 * @swagger
 * /conference-rooms/{id}:
 *   put:
 *     summary: Update a conference-room's name
 *     tags:
 *     - conference-rooms
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
 *         description: Conference room updated
 */
app.put("/conference-rooms/:id", async (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ error: "Missing name!" });
  }

  const conferenceRoom = await prisma.conferenceRoom.update({
    where: { id: Number(req.body.id) },
    data: { name: req.body.name },
  });
  res.status(200).json(conferenceRoom);
});

/**
 * @swagger
 * /conference-rooms:
 *   post:
 *     summary: Create a new conference room
 *     tags:
 *     - conference-rooms
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Room A"
 *     responses:
 *       201:
 *         description: Conference room created
 *       400:
 *         description: Validation error
 */
app.post("/conference-rooms", async (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ error: "Missing name!" });
  }

  const conferenceRoom = await prisma.conferenceRoom.create({ data: { name: req.body.name } });
  res.status(201).json(conferenceRoom);
});

/**
 * @swagger
 * /conference-rooms/{id}:
 *   delete:
 *     summary: Delete a conference room by ID
 *     tags:
 *     - conference-rooms
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Conference room deleted
 */
app.delete("/conference-rooms/:id", async (req, res) => {
  const { id } = req.params;
  const conferenceRoom = await prisma.conferenceRoom.delete({ where: { id: Number(id) } });
  res.status(204).send();
});

module.exports = app;
