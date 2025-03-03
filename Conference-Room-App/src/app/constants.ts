export const API_URL = 'http://localhost:3000/';

export const API_ROUTES = {
  users: `${API_URL}users`,
  reservations: `${API_URL}reservations`,
  conferenceRooms: `${API_URL}conference-rooms`,
  admin: {
    clearData: `${API_URL}admin/clear-data`,
    seedData: `${API_URL}admin/seed-data`,
  },
};
