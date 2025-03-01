import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, ConferenceRoom, Reservation } from './models';

@Injectable({
  providedIn: 'root'
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

  deleteUser(id: number): Observable<any> {
    return this.http.delete(this.API_URL + 'users/' + id);
  }

  getReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(this.API_URL + 'reservations');
  }

  addReservation(reservation: Reservation): Observable<Reservation> {
    return this.http.post<Reservation>(this.API_URL + 'reservations', reservation );
  }

  deleteReservation(id: number): Observable<any> {
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

  deleteConferenceRoom(id: number): Observable<any> {
    return this.http.delete(this.API_URL + 'conference-rooms/' + id);
  }
}
