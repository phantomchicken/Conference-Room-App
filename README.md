# ConferenceRoomApp

A simple SPA made utilizing:
- Angular for the FE
- Node (Express) for the API
- Prisma for handling DB work
- an SQLite relational DB

Users can add, edit, delete and view users and conference rooms.
Users can create conference room reservations, select the conference room they take place at, select their participants and their time of start and end. Reservations can not be made for the past, and every conference room reservation must not overlap with other reservations in the same conference room.

## Setup

Make sure you have at least Node v18.13.
Make sure you have no apps that occupy ports 3000 (api) or 4200 (Angular). 
Alternatively change the API URL in ```server.js```, and ```database.service.ts```

First terminal:
```bash
git clone https://github.com/phantomchicken/Conference-Room-App/
cd Conference-Room-App
cd Conference-Room-App
npm install
cd api
npm install

# Either manually create an .env file with DATABASE_URL="file:./prisma/prisma/dev.db" and save it as UTF-8 or run these two commands
echo DATABASE_URL="'file:./prisma/prisma/dev.db'" > .env
Set-Content .env 'DATABASE_URL="file:./prisma/dev.db"' -Encoding UTF8

npx prisma generate
npx prisma migrate dev
node seed.js
node server.js
```

Second terminal:
```bash
cd Conference-Room-App
cd Conference-Room-App
ng serve --open
```