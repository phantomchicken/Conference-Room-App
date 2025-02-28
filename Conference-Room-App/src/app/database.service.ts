import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private API_URL = 'http://localhost:3000/';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any> {
    return this.http.get(this.API_URL + 'users');
  }

  addUser(name: string): Observable<any> {
    return this.http.post(this.API_URL + 'users', { name });
  }

  getReservations(): Observable<any> {
    return this.http.get(this.API_URL + 'reservations');
  }

  addReservation(name: string): Observable<any> {
    return this.http.post(this.API_URL + 'reservations', { name });
  }

  getConferenceRooms(): Observable<any> {
    return this.http.get(this.API_URL + 'conference-rooms');
  }

  addConferenceRoom(name: string): Observable<any> {
    return this.http.post(this.API_URL + 'conference-rooms', { name });
  }
}
