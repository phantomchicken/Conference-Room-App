import { Component, ViewChild, inject, OnInit, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DatabaseService } from '../database.service';
import { CommonModule } from '@angular/common';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { ConferenceRoom, Reservation, User } from '../models';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'app-reservations',
  imports: [
    MatSortModule,
    MatPaginatorModule,
    MatTableModule,
    CommonModule,
    MatTimepickerModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
  ],
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.css',
})
export class ReservationsComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'id',
    'name',
    'conferenceRoom',
    'participants',
    'date',
    'startTime',
    'endTime',
    'editDelete',
  ];
  dataSource = new MatTableDataSource<Reservation>();
  status = '';
  statusClass = '';
  name = '';
  startDate: Date = new Date();
  startTime: Date = new Date();
  endTime: Date = new Date();
  isAdding = false;
  isEditing = new Map<number, boolean>();

  userList: User[] = [];
  selectedUsers: User[] = [];

  conferenceRoomList: ConferenceRoom[] = [];
  selectedConferenceRoom: ConferenceRoom | null = null;

  private readonly _adapter = inject<DateAdapter<unknown, unknown>>(DateAdapter);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dbService: DatabaseService) {}

  ngOnInit() {
    this.dbService.getReservations().subscribe((data) => (this.dataSource.data = data));
    this.dbService.getUsers().subscribe((data) => (this.userList = data));
    this.dbService.getConferenceRooms().subscribe((data) => (this.conferenceRoomList = data));
    this._adapter.setLocale('sl-SI');
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  deleteReservation(id: number) {
    this.dbService.deleteReservation(id).subscribe({
      next: () => {
        this.status = 'Reservation deleted successfully.';
        this.statusClass = 'alert alert-success';
        this.dbService.getReservations().subscribe((data) => (this.dataSource.data = data));
      },
      error: () => (this.status = 'Error deleting reservation!'),
    });
  }

  addReservation() {
    if (
      !this.name ||
      !this.selectedConferenceRoom ||
      this.selectedConferenceRoom.id === null ||
      !this.selectedUsers.length ||
      !this.startDate ||
      !this.startTime ||
      !this.endTime
    ) {
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
    } else if (startDateTime > endDateTime) {
      this.status = 'Start time cannot be after end time.';
      this.statusClass = 'alert alert-danger';
      return;
    }

    this.dbService.getReservations().subscribe((data) => {
      const existingReservations = data.filter(
        (reservation) => reservation.conferenceRoomId === this.selectedConferenceRoom!.id
      );

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
        name: this.name,
        conferenceRoomId: this.selectedConferenceRoom!.id!,
        participantIds: this.selectedUsers.map((user) => user.id!),
        startTime: startDateTime,
        endTime: endDateTime,
      };

      this.dbService.addReservation(reservation).subscribe({
        next: () => {
          this.status = 'Reservation added successfully.';
          this.statusClass = 'alert alert-success';
          this.dbService.getReservations().subscribe((data) => (this.dataSource.data = data));
        },
        error: () => {
          this.status = 'Error adding reservation!';
          this.statusClass = 'alert alert-danger';
        },
      });
    });
  }

  toggleAddReservationForm() {
    this.isAdding = !this.isAdding;
  }

  toggleEditReservationForm(id: number) {
    this.isEditing.set(id, !this.isEditing.get(id));
  }

  editReservation(reservation: Reservation, name: string) {
    const updatedReservation: Reservation = {
      ...reservation,
      name: name,
    };

    this.dbService.editReservation(updatedReservation).subscribe({
      next: () => {
        this.status = 'Reservation edited successfully.';
        this.statusClass = 'alert alert-success';
        this.dbService.getReservations().subscribe((data) => (this.dataSource.data = data));
        this.isAdding = false;
        this.toggleEditReservationForm(reservation.id!);
      },
      error: (err) => {
        this.status = err.error.error;
        this.statusClass = 'alert alert-danger';
      },
    });
  }
}
