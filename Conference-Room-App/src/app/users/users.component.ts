import { Component } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import { DatabaseService } from '../database.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-users',
  imports: [MatTableModule, CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  displayedColumns: string[] = ['id', 'name', 'editDelete'];
  dataSource = [];
  status = '';
  statusClass = '';
  isAdding = false
  name:string = '';

  constructor(private dbService: DatabaseService) {}

  ngOnInit() {
    this.dbService.getUsers().subscribe(data => this.dataSource = data);
  }

  deleteUser(id:number){
    this.dbService.deleteUser(id).subscribe({
      next: () => {
        this.status = 'User deleted successfully.',
        this.statusClass = 'alert alert-success',
        this.dbService.getUsers().subscribe(data => this.dataSource = data)
      }, 
      error: (err) => this.status = 'Error deleting user!'
    }
    );
  }

  showAddUserForm() {
    this.isAdding = true;
  }

  addUser(){
    this.dbService.addUser(this.name).subscribe({
      next: () => {
        this.status = 'User added successfully.',
        this.statusClass = 'alert alert-success',
        this.dbService.getUsers().subscribe(data => this.dataSource = data)
      }, 
      error: (err) => {
        this.status = 'Error adding user!',
        this.statusClass = 'alert alert-danger'
      }  
    }
    );
    this.isAdding = false
  }
}
