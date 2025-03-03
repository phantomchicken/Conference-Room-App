import { Routes } from '@angular/router';
import { TemplateComponent } from './template/template.component';
import { ReservationsComponent } from './reservations/reservations.component';
import { UsersComponent } from './users/users.component';
import { ConferenceRoomsComponent } from './conference-rooms/conference-rooms.component';
import { AdminComponent } from './admin/admin.component';

export const routes: Routes = [
  {
    path: '',
    component: TemplateComponent,
    children: [
      { path: '', component: ReservationsComponent, title: 'Reservations' },
      { path: 'users', component: UsersComponent, title: 'Users' },
      { path: 'reservations', component: ReservationsComponent, title: 'Reservations' },
      { path: 'conference-rooms', component: ConferenceRoomsComponent, title: 'Conference Rooms' },
      { path: 'admin', component: AdminComponent, title: 'Admin' },
    ],
  },
];
