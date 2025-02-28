import { Component } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import { DatabaseService } from '../database.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reservations',
  imports: [MatTableModule, CommonModule],
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.css'
})

export class ReservationsComponent {
  displayedColumns: string[] = ['id', 'conferenceRoom', 'participants', 'editDelete'];
  dataSource = [];
  status = '';
  statusClass = '';

  constructor(private dbService: DatabaseService) {}

  ngOnInit() {
    this.dbService.getReservations().subscribe(data => this.dataSource = data);
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

}
