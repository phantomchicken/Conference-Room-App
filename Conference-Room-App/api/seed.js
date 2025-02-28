const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create Users
  const users = await prisma.user.createMany({
    data: [
      { name: 'Alice' },
      { name: 'Bob' },
      { name: 'Charlie' }
    ]
  });

  // Create Conference Rooms
  const conferenceRooms = await prisma.conferenceRoom.createMany({
    data: [
      { name: 'Room A' },
      { name: 'Room B' },
      { name: 'Room C' }
    ]
  });

  // Fetch users and rooms to use their IDs
  const userList = await prisma.user.findMany();
  const roomList = await prisma.conferenceRoom.findMany();

  // Create Reservations
  await prisma.reservation.createMany({
    data: [
      { conferenceRoomId: roomList[0].id },
      { conferenceRoomId: roomList[1].id }
    ]
  });

  // Link Users to Reservations (Participants)
  const reservations = await prisma.reservation.findMany();
  await prisma.reservation.update({
    where: { id: reservations[0].id },
    data: { participants: { connect: [{ id: userList[0].id }, { id: userList[1].id }] } }
  });

  await prisma.reservation.update({
    where: { id: reservations[1].id },
    data: { participants: { connect: [{ id: userList[2].id }] } }
  });

  console.log('Seeding complete.');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
