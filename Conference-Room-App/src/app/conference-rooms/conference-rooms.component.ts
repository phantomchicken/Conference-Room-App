import { Component } from '@angular/core';
import { DatabaseService } from '../database.service';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConferenceRoom } from '../models';

@Component({
  selector: 'app-conference-rooms',
  imports: [MatTableModule, CommonModule, FormsModule],
  templateUrl: './conference-rooms.component.html',
  styleUrl: './conference-rooms.component.css'
})
export class ConferenceRoomsComponent {
  displayedColumns: string[] = ['id', 'name', 'editDelete'];
  dataSource = [];
  status = '';
  statusClass = '';
  isAdding = false;
  name:string = '';

  constructor(private dbService: DatabaseService) {}

  ngOnInit() {
    this.dbService.getConferenceRooms().subscribe(data => this.dataSource = data);
  }

  deleteConferenceRoom(id:number){
    this.dbService.deleteConferenceRoom(id).subscribe({
      next: () => {
        this.status = 'Conference room deleted successfully.',
        this.statusClass = 'alert alert-success',
        this.dbService.getConferenceRooms().subscribe(data => this.dataSource = data)
      }, 
      error: (err) => this.status = 'Error deleting conference room!'
    }
    );
  }

  toggleAddReservationForm() {
    this.isAdding = !this.isAdding;
  }

  addConferenceRoom(){
    const conferenceRoom: ConferenceRoom = {
      name: this.name,
    };
    this.dbService.addConferenceRoom(conferenceRoom).subscribe({
      next: () => {
        this.status = 'Conference room added successfully.',
        this.statusClass = 'alert alert-success',
        this.dbService.getConferenceRooms().subscribe(data => this.dataSource = data)
        this.isAdding = false
      }, 
      error: (err) => {
        this.status = err.error.error,
        this.statusClass = 'alert alert-danger'
      }  
    }
    );
  }
}
