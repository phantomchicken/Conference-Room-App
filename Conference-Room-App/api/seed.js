const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Clearing database...");
  await prisma.user.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.conferenceRoom.deleteMany();

  console.log("Seeding database...");
  // Create Users
  const users = await prisma.user.createMany({
    data: [{ name: "Alice" }, { name: "Bob" }, { name: "Charlie" }],
  });

  // Create Conference Rooms
  const conferenceRooms = await prisma.conferenceRoom.createMany({
    data: [{ name: "Room A" }, { name: "Room B" }, { name: "Room C" }],
  });

  // Fetch users and rooms to use their IDs
  const userList = await prisma.user.findMany();
  const roomList = await prisma.conferenceRoom.findMany();

  const startTime1 = addDays(new Date(), 1);
  const startTime2 = addDays(new Date(), 2);
  const startTime3 = addDays(new Date(), 3);

  const endTime1 = new Date(startTime1);
  endTime1.setHours(endTime1.getHours() + 1);

  const endTime2 = new Date(startTime2);
  endTime2.setHours(endTime2.getHours() + 1);

  const endTime3 = new Date(startTime3);
  endTime3.setHours(endTime3.getHours() + 1);

  // Create Reservations
  await prisma.reservation.createMany({
    data: [
      { name: "Reservation 1", conferenceRoomId: roomList[0].id, startTime: startTime1, endTime: endTime1 },
      { name: "Reservation 2", conferenceRoomId: roomList[1].id, startTime: startTime2, endTime: endTime2 },
      { name: "Reservation 3", conferenceRoomId: roomList[2].id, startTime: startTime3, endTime: endTime3 },
    ],
  });

  // Link Users to Reservations (Participants)
  const reservations = await prisma.reservation.findMany();
  await prisma.reservation.update({
    where: { id: reservations[0].id },
    data: { participants: { connect: [{ id: userList[0].id }, { id: userList[1].id }] } },
  });

  await prisma.reservation.update({
    where: { id: reservations[1].id },
    data: { participants: { connect: [{ id: userList[2].id }] } },
  });

  await prisma.reservation.update({
    where: { id: reservations[2].id },
    data: { participants: { connect: [{ id: userList[1].id }, { id: userList[2].id }] } },
  });

  console.log("Seeding complete.");
}

const addDays = (date, days) => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
};

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
