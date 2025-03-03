import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, ConferenceRoom, Reservation, APIResponse } from './models';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private API_URL = 'http://localhost:3000/';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.API_URL + 'users');
  }

  addUser(user: User): Observable<User> {
    return this.http.post<User>(this.API_URL + 'users', user);
  }

  editUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.API_URL}users/${user.id}`, user);
  }

  deleteUser(id: number): Observable<APIResponse> {
    return this.http.delete(this.API_URL + 'users/' + id);
  }

  getReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(this.API_URL + 'reservations');
  }

  getReservation(id: number): Observable<Reservation> {
    return this.http.get<Reservation>(`${this.API_URL}reservations/${id}`);
  }

  addReservation(reservation: Reservation): Observable<Reservation> {
    return this.http.post<Reservation>(this.API_URL + 'reservations', reservation);
  }

  editReservation(reservation: Reservation): Observable<Reservation> {
    return this.http.put<Reservation>(`${this.API_URL}reservations/${reservation.id}`, reservation);
  }

  deleteReservation(id: number): Observable<APIResponse> {
    return this.http.delete(this.API_URL + 'reservations/' + id);
  }

  getConferenceRooms(): Observable<ConferenceRoom[]> {
    return this.http.get<ConferenceRoom[]>(this.API_URL + 'conference-rooms');
  }

  addConferenceRoom(conferenceRoom: ConferenceRoom): Observable<ConferenceRoom> {
    return this.http.post<ConferenceRoom>(this.API_URL + 'conference-rooms', conferenceRoom);
  }

  editConferenceRoom(conferenceRoom: ConferenceRoom): Observable<ConferenceRoom> {
    return this.http.put<ConferenceRoom>(`${this.API_URL}conference-rooms/${conferenceRoom.id}`, conferenceRoom);
  }

  deleteConferenceRoom(id: number): Observable<APIResponse> {
    return this.http.delete(this.API_URL + 'conference-rooms/' + id);
  }

  deleteAllData(): Observable<APIResponse> {
    return this.http.delete(this.API_URL + 'admin/clear-data');
  }

  seedData(): Observable<APIResponse> {
    return this.http.post(this.API_URL + 'admin/seed-data', {});
  }
}
