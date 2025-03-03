import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APIResponse } from '../models';
import { API_ROUTES } from '../constants';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private http = inject(HttpClient);

  deleteAllData(): Observable<APIResponse> {
    return this.http.delete(API_ROUTES.admin.clearData);
  }

  seedData(): Observable<APIResponse> {
    return this.http.post(API_ROUTES.admin.seedData, {});
  }
}
