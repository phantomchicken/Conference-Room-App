import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../database.service';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConferenceRoom } from '../models';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-conference-rooms',
  imports: [MatTableModule, CommonModule, FormsModule],
  templateUrl: './conference-rooms.component.html',
})
export class ConferenceRoomsComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'editDelete'];
  dataSource: ConferenceRoom[] = [];
  status = '';
  statusClass = '';
  isAdding = false;
  name = '';
  isEditing = new Map<number, boolean>();

  constructor(private dbService: DatabaseService) {}

  ngOnInit() {
    this.dbService.getConferenceRooms().subscribe((data) => (this.dataSource = data));
  }

  deleteConferenceRoom(id: number) {
    this.dbService.deleteConferenceRoom(id).pipe(
      switchMap(() => this.dbService.getConferenceRooms())
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

    this.dbService.addConferenceRoom(conferenceRoom).pipe(
      switchMap(() => this.dbService.getConferenceRooms())
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

    this.dbService.editConferenceRoom(conferenceRoom).pipe(
      switchMap(() => this.dbService.getConferenceRooms())
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
