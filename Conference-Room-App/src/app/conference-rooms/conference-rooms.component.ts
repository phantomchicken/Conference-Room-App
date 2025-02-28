import { Component } from '@angular/core';
import { DatabaseService } from '../database.service';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-conference-rooms',
  imports: [MatTableModule, CommonModule],
  templateUrl: './conference-rooms.component.html',
  styleUrl: './conference-rooms.component.css'
})
export class ConferenceRoomsComponent {
  displayedColumns: string[] = ['id', 'name', 'editDelete'];
  dataSource = [];
  status = '';
  statusClass = '';

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
}
