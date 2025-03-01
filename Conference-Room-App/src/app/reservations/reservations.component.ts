import { Component, inject } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import { DatabaseService } from '../database.service';
import { CommonModule } from '@angular/common';
import {MatTimepickerModule} from '@angular/material/timepicker';
import {MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {DateAdapter, MatNativeDateModule} from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { ConferenceRoom, Reservation, User } from '../models';

@Component({
  selector: 'app-reservations',
  imports: [MatTableModule, CommonModule, MatTimepickerModule, MatFormFieldModule, MatInputModule, FormsModule, MatDatepickerModule, MatNativeDateModule, MatSelectModule],
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.css'
})

export class ReservationsComponent {
  displayedColumns: string[] = ['id', 'conferenceRoom', 'participants', 'editDelete', 'date', 'startTime', 'endTime'];
  dataSource: Reservation[] = [];
  status = '';
  statusClass = '';
  formControl: any;
  startDate: Date = new Date();
  startTime: Date = new Date();
  endTime: Date = new Date();
  isAdding = false;
  
  userList: any[] = [];
  selectedUsers: User[] = [];

  conferenceRoomList: any[] = [];
  selectedConferenceRoom: ConferenceRoom | null = null;

  private readonly _adapter = inject<DateAdapter<unknown, unknown>>(DateAdapter);

  constructor(private dbService: DatabaseService) {}

  ngOnInit() {
    this.dbService.getReservations().subscribe(data => this.dataSource = data);
    this.dbService.getUsers().subscribe(data => this.userList = data);
    this.dbService.getConferenceRooms().subscribe(data => this.conferenceRoomList = data);
    this._adapter.setLocale('sl-SI');
  }

  deleteReservation(id:number){
    this.dbService.deleteReservation(id).subscribe({
      next: () => {
        this.status = 'Reservation deleted successfully.',
        this.statusClass = 'alert alert-success',
        this.dbService.getReservations().subscribe(data => this.dataSource = data)
      }, 
      error: (err) => this.status = 'Error deleting reservation!'
    });
  }

  addReservation() {
    if (!this.selectedConferenceRoom || this.selectedConferenceRoom.id === null || !this.selectedUsers.length || !this.startDate || !this.startTime || !this.endTime) {
      this.status = 'Please fill in all fields.';
      this.statusClass = 'alert alert-danger';
      return;
    }

    const startDateTime = new Date(this.startDate);
    startDateTime.setHours(this.startTime.getHours(), this.startTime.getMinutes());

    const endDateTime = new Date(this.startDate);
    endDateTime.setHours(this.endTime.getHours(), this.endTime.getMinutes());

    const now = new Date();
    if (startDateTime < now || endDateTime < now) {
      this.status = 'Reservation cannot be in the past.';
      this.statusClass = 'alert alert-danger';
      return;
    }

    this.dbService.getReservations().subscribe(data => {
      const existingReservations = data.filter(reservation => reservation.conferenceRoomId === this.selectedConferenceRoom!.id);

      for (const reservation of existingReservations) {
        const existingStart = new Date(reservation.startTime);
        const existingEnd = new Date(reservation.endTime);
      
        if (startDateTime < existingEnd && endDateTime > existingStart) {
          this.status = 'Reservation overlaps with another reservation.';
          this.statusClass = 'alert alert-danger';
          return;
        }
      }   

      const reservation: Reservation = {
        conferenceRoomId: this.selectedConferenceRoom!.id!,
        participantIds: this.selectedUsers.map(user => user.id!),
        startTime: startDateTime,
        endTime: endDateTime
      };
    
      this.dbService.addReservation(reservation).subscribe({
        next: () => {
          this.status = 'Reservation added successfully.',
          this.statusClass = 'alert alert-success',
          this.dbService.getReservations().subscribe(data => this.dataSource = data)
        },
        error: (err) => {
          this.status = 'Error adding reservation!',
          this.statusClass = 'alert alert-danger'
        }
      });
    });
  }

  toggleAddReservationForm() {
    this.isAdding = !this.isAdding;
  }

}
