import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, ConferenceRoom, Reservation, APIResponse } from './models';
import { API_ROUTES } from './constants';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
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

  getReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(API_ROUTES.reservations);
  }

  getReservation(id: number): Observable<Reservation> {
    return this.http.get<Reservation>(`${API_ROUTES.reservations}/${id}`);
  }

  addReservation(reservation: Reservation): Observable<Reservation> {
    return this.http.post<Reservation>(API_ROUTES.reservations, reservation);
  }

  editReservation(reservation: Reservation): Observable<Reservation> {
    return this.http.put<Reservation>(`${API_ROUTES.reservations}/${reservation.id}`, reservation);
  }

  deleteReservation(id: number): Observable<APIResponse> {
    return this.http.delete(`${API_ROUTES.reservations}/${id}`);
  }

  getConferenceRooms(): Observable<ConferenceRoom[]> {
    return this.http.get<ConferenceRoom[]>(API_ROUTES.conferenceRooms);
  }

  addConferenceRoom(conferenceRoom: ConferenceRoom): Observable<ConferenceRoom> {
    return this.http.post<ConferenceRoom>(API_ROUTES.conferenceRooms, conferenceRoom);
  }

  editConferenceRoom(conferenceRoom: ConferenceRoom): Observable<ConferenceRoom> {
    return this.http.put<ConferenceRoom>(`${API_ROUTES.conferenceRooms}/${conferenceRoom.id}`, conferenceRoom);
  }

  deleteConferenceRoom(id: number): Observable<APIResponse> {
    return this.http.delete(`${API_ROUTES.conferenceRooms}/${id}`);
  }

  deleteAllData(): Observable<APIResponse> {
    return this.http.delete(API_ROUTES.admin.clearData);
  }

  seedData(): Observable<APIResponse> {
    return this.http.post(API_ROUTES.admin.seedData, {});
  }
}
