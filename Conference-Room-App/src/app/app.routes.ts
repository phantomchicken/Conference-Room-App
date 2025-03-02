import { Routes } from '@angular/router';
import { TemplateComponent } from './template/template.component';
import { ReservationsComponent } from './reservations/reservations.component';
import { UsersComponent } from './users/users.component';
import { ConferenceRoomsComponent } from './conference-rooms/conference-rooms.component';
import { AdminComponent } from './admin/admin.component';

export const routes: Routes = [
  {
    path: '',
    component: TemplateComponent, // 👈 Wrap all pages inside TemplateComponent
    children: [
      { path: '', component: ReservationsComponent },
      { path: 'users', component: UsersComponent },
      { path: 'reservations', component: ReservationsComponent},
      { path: 'conference-rooms', component: ConferenceRoomsComponent},
      { path: 'admin', component: AdminComponent}
    ]
  }
];
