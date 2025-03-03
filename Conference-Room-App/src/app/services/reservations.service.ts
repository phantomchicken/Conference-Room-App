import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APIResponse, Reservation } from '../models';
import { API_ROUTES } from '../constants';

@Injectable({
  providedIn: 'root',
})
export class ReservationsService {
  private http = inject(HttpClient);

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
}
