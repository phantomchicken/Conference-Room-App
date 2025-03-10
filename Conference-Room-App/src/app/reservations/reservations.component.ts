import { Component, ViewChild, inject, OnInit, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
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
import { EMPTY, switchMap } from 'rxjs';
import { ReservationsService } from '../services/reservations.service';
import { ConferenceRoomsService } from '../services/conference-rooms.service';
import { UsersService } from '../services/users.service';

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
  private reservationsService = inject(ReservationsService);
  private conferenceRoomsService = inject(ConferenceRoomsService);
  private usersService = inject(UsersService);

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

  ngOnInit() {
    this.reservationsService.getReservations().subscribe((data) => {
      this.dataSource.data = data
      console.log(data)
    });
    this.usersService.getUsers().subscribe((data) => (this.userList = data));
    this.conferenceRoomsService.getConferenceRooms().subscribe((data) => (this.conferenceRoomList = data));
    this._adapter.setLocale('sl-SI');
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  deleteReservation(id: number) {
    this.reservationsService.deleteReservation(id).pipe(
      switchMap(() => this.reservationsService.getReservations())
    ).subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.status = 'Reservation deleted successfully.';
        this.statusClass = 'alert alert-success';
      },
      error: () => {
        this.status = 'Error deleting reservation!';
        this.statusClass = 'alert alert-danger';
      }
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

    this.reservationsService.getReservations().pipe(
      switchMap((data) => {
        const existingReservations = data.filter(
          (reservation) => reservation.conferenceRoomId === this.selectedConferenceRoom!.id
        );
    
        for (const reservation of existingReservations) {
          const existingStart = new Date(reservation.startTime);
          const existingEnd = new Date(reservation.endTime);
    
          if (startDateTime < existingEnd && endDateTime > existingStart) {
            this.status = 'Reservation overlaps with another reservation.';
            this.statusClass = 'alert alert-danger';
            return EMPTY;
          }
        }
    
        const reservation: Reservation = {
          name: this.name,
          conferenceRoomId: this.selectedConferenceRoom!.id!,
          participantIds: this.selectedUsers.map((user) => user.id!),
          startTime: startDateTime,
          endTime: endDateTime,
        };
    
        return this.reservationsService.addReservation(reservation).pipe(
          switchMap(() => this.reservationsService.getReservations())
        );
      })
    ).subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.status = 'Reservation added successfully.';
        this.statusClass = 'alert alert-success';
      },
      error: () => {
        this.status = 'Error adding reservation!';
        this.statusClass = 'alert alert-danger';
      }
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

    this.reservationsService.editReservation(updatedReservation).pipe(
      switchMap(() => this.reservationsService.getReservations())
    ).subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.status = 'Reservation edited successfully.';
        this.statusClass = 'alert alert-success';
        this.isAdding = false;
        this.toggleEditReservationForm(reservation.id!);
      },
      error: (err) => {
        this.status = err.error?.error || 'Error editing reservation!';
        this.statusClass = 'alert alert-danger';
      }
    });
  }
}
