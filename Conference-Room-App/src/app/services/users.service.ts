import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, APIResponse } from '../models';
import { API_ROUTES } from '../constants';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private http = inject(HttpClient);

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(API_ROUTES.users);
  }

  addUser(user: User): Observable<User> {
    return this.http.post<User>(API_ROUTES.users, user);
  }

  editUser(user: User): Observable<User> {
    return this.http.put<User>(`${API_ROUTES.users}/${user.id}`, user);
  }

  deleteUser(id: number): Observable<APIResponse> {
    return this.http.delete(`${API_ROUTES.users}/${id}`);
  }
}
