const { PrismaClient } = require("@prisma/client");
const express = require("express");
const app = express();
const prisma = new PrismaClient();

/**
 * @swagger
 * /admin/clear-data:
 *   delete:
 *     summary: Clear all data from the database
 *     tags:
 *     - database
 *     responses:
 *       200:
 *         description: Database cleared
 */
app.delete("/admin/clear-data", async (req, res) => {
  try {
    console.log("Clearing database...");
    await prisma.user.deleteMany();
    await prisma.reservation.deleteMany();
    await prisma.conferenceRoom.deleteMany();
    res.status(200).send({ message: "Database cleared successfully." });
  } catch (e) {
    console.error(e);
    res.status(500).send({ error: "Error clearing database" });
  }
});

/**
 * @swagger
 * /admin/seed-data:
 *   post:
 *     summary: Seed the database with default data
 *     tags:
 *     - database
 *     responses:
 *       200:
 *         description: Database seeded successfully
 */
app.post("/admin/seed-data", async (req, res) => {
  try {
    console.log("Seeding database...");

    await prisma.user.createMany({
      data: [{ name: "Alice" }, { name: "Bob" }, { name: "Charlie" }],
    });

    await prisma.conferenceRoom.createMany({
      data: [{ name: "Room A" }, { name: "Room B" }, { name: "Room C" }],
    });

    const users = await prisma.user.findMany();
    const rooms = await prisma.conferenceRoom.findMany();

    const startTime1 = new Date("2025-05-01T10:00:00");
    const endTime1 = new Date("2025-05-01T11:00:00");
    const startTime2 = new Date("2025-05-02T11:00:00");
    const endTime2 = new Date("2025-05-02T12:00:00");
    const startTime3 = new Date("2025-05-03T12:00:00");
    const endTime3 = new Date("2025-05-03T13:00:00");

    await prisma.reservation.createMany({
      data: [
        { name: "Reservation 1", conferenceRoomId: rooms[0].id, startTime: startTime1, endTime: endTime1 },
        { name: "Reservation 2", conferenceRoomId: rooms[1].id, startTime: startTime2, endTime: endTime2 },
        { name: "Reservation 3", conferenceRoomId: rooms[2].id, startTime: startTime3, endTime: endTime3 },
      ],
    });

    res.status(200).send({ message: "Database seeded successfully." });
  } catch (e) {
    console.error(e);
    res.status(500).send({ error: "Error seeding database" });
  }
});

module.exports = app;
