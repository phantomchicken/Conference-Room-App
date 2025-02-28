import { Component } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import { DatabaseService } from '../database.service';
import { CommonModule } from '@angular/common';
import {MatTimepickerModule} from '@angular/material/timepicker';
import {MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-reservations',
  imports: [MatTableModule, CommonModule, MatTimepickerModule, MatFormFieldModule, MatInputModule, FormsModule, MatDatepickerModule, MatNativeDateModule, MatSelectModule],
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.css'
})

export class ReservationsComponent {
  displayedColumns: string[] = ['id', 'conferenceRoom', 'participants', 'editDelete'];
  dataSource = [];
  status = '';
  statusClass = '';
  formControl: any;
  value: Date = new Date();
  isAdding = false;
  
  userList: any[] = [];
  selectedUsers = [];

  conferenceRoomList: any[] = [];
  selectedConferenceRoom = null;

  constructor(private dbService: DatabaseService) {}

  ngOnInit() {
    this.dbService.getReservations().subscribe(data => this.dataSource = data);
    this.dbService.getUsers().subscribe(data => this.userList = data);
    this.dbService.getConferenceRooms().subscribe(data => this.conferenceRoomList = data);
  }

  deleteReservation(id:number){
    this.dbService.deleteReservation(id).subscribe({
      next: () => {
        this.status = 'Reservation deleted successfully.',
        this.statusClass = 'alert alert-success',
        this.dbService.getReservations().subscribe(data => this.dataSource = data)
      }, 
      error: (err) => this.status = 'Error deleting reservation!'
    }
    );
  }

  addReservation(){
    console.log(this.value);
    console.log(this.selectedConferenceRoom);
    console.log(this.selectedUsers);
  }

  toggleAddReservationForm() {
    this.isAdding = !this.isAdding;
  }

}
