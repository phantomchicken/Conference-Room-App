import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConferenceRoom, APIResponse } from '../models';
import { API_ROUTES } from '../constants';

@Injectable({
  providedIn: 'root',
})
export class ConferenceRoomsService {
  private http = inject(HttpClient);

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
}
