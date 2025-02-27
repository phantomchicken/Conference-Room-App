import { Routes } from '@angular/router';
import { TemplateComponent } from './template/template.component';
import { ReservationsComponent } from './reservations/reservations.component';
import { UsersComponent } from './users/users.component';

export const routes: Routes = [
  {
    path: '',
    component: TemplateComponent, // 👈 Wrap all pages inside TemplateComponent
    children: [
      { path: '', component: ReservationsComponent },
      { path: 'users', component: UsersComponent },
    ]
  }
];
