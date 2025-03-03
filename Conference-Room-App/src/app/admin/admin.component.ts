import { Component } from '@angular/core';
import { DatabaseService } from '../database.service';  // Import the DatabaseService to interact with backend
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-admin',
  imports: [CommonModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})

export class AdminComponent {
  status = '';
  statusClass = '';

  constructor(private dbService: DatabaseService) {}

  deleteData() {
    this.dbService.deleteAllData().subscribe({
      next: () => {
        this.status = 'Database cleared successfully!';
        this.statusClass = 'alert alert-success';
      },
      error: () => {
        this.status = 'Error clearing database!';
        this.statusClass = 'alert alert-danger';
      }
    });
  }

  addData() {
    this.dbService.seedData().subscribe({
      next: () => {
        this.status = 'Database seeded successfully!';
        this.statusClass = 'alert alert-success';
      },
      error: () => {
        this.status = 'Error seeding database!';
        this.statusClass = 'alert alert-danger';
      }
    });
  }

}
