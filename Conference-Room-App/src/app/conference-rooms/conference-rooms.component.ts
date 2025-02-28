import { Component } from '@angular/core';
import { DatabaseService } from '../database.service';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
    this.dbService.addConferenceRoom(this.name).subscribe({
      next: () => {
        this.status = 'Conference room added successfully.',
        this.statusClass = 'alert alert-success',
        this.dbService.getConferenceRooms().subscribe(data => this.dataSource = data)
      }, 
      error: (err) => {
        this.status = 'Error adding conference room!',
        this.statusClass = 'alert alert-danger'
      }  
    }
    );
    this.isAdding = false
  }
}
