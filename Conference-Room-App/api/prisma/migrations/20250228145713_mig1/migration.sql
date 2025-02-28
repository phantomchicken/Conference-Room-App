-- CreateTable
CREATE TABLE "ConferenceRoom" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Reservation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "conferenceRoomId" INTEGER NOT NULL,
    CONSTRAINT "Reservation_conferenceRoomId_fkey" FOREIGN KEY ("conferenceRoomId") REFERENCES "ConferenceRoom" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_ReservationToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_ReservationToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Reservation" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ReservationToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_ReservationToUser_AB_unique" ON "_ReservationToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ReservationToUser_B_index" ON "_ReservationToUser"("B");
