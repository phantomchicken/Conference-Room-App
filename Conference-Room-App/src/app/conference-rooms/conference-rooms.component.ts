import { Component, OnInit, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConferenceRoom } from '../models';
import { switchMap } from 'rxjs/operators';
import { ConferenceRoomsService } from '../services/conference-rooms.service';

@Component({
  selector: 'app-conference-rooms',
  imports: [MatTableModule, CommonModule, FormsModule],
  templateUrl: './conference-rooms.component.html',
})
export class ConferenceRoomsComponent implements OnInit {
  private conferenceRoomsService = inject(ConferenceRoomsService);
  
  displayedColumns: string[] = ['id', 'name', 'editDelete'];
  dataSource: ConferenceRoom[] = [];
  status = '';
  statusClass = '';
  isAdding = false;
  name = '';
  isEditing = new Map<number, boolean>();

  ngOnInit() {
    this.conferenceRoomsService.getConferenceRooms().subscribe((data) => (this.dataSource = data));
  }

  deleteConferenceRoom(id: number) {
    this.conferenceRoomsService.deleteConferenceRoom(id).pipe(
      switchMap(() => this.conferenceRoomsService.getConferenceRooms())
    ).subscribe({
      next: (data) => {
        this.dataSource = data;
        this.status = 'Conference room deleted successfully.';
        this.statusClass = 'alert alert-success';
      },
      error: () => {
        this.status = 'Error deleting conference room!';
        this.statusClass = 'alert alert-danger';
      }
    });
  }

  toggleAddConferenceRoomForm() {
    this.isAdding = !this.isAdding;
  }

  addConferenceRoom() {
    const conferenceRoom: ConferenceRoom = {
      name: this.name,
    };

    this.conferenceRoomsService.addConferenceRoom(conferenceRoom).pipe(
      switchMap(() => this.conferenceRoomsService.getConferenceRooms())
    ).subscribe({
      next: (data) => {
        this.dataSource = data;
        this.status = 'Conference room added successfully.';
        this.statusClass = 'alert alert-success';
        this.isAdding = false;
      },
      error: (err) => {
        this.status = err.error?.error || 'Error adding conference room!';
        this.statusClass = 'alert alert-danger';
      }
    });
  }

  toggleEditConferenceRoomForm(id: number) {
    this.isEditing.set(id, !this.isEditing.get(id));
  }

  editConferenceRoom(id: number, name: string) {
    const conferenceRoom: ConferenceRoom = {
      id: id,
      name: name,
    };

    this.conferenceRoomsService.editConferenceRoom(conferenceRoom).pipe(
      switchMap(() => this.conferenceRoomsService.getConferenceRooms())
    ).subscribe({
      next: (data) => {
        this.dataSource = data;
        this.status = 'Conference room edited successfully.';
        this.statusClass = 'alert alert-success';
        this.toggleEditConferenceRoomForm(id);
      },
      error: (err) => {
        this.status = err.error?.error || 'Error editing conference room!';
        this.statusClass = 'alert alert-danger';
      }
    });
  }
}
