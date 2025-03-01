import { Component } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import { DatabaseService } from '../database.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../models';

@Component({
  selector: 'app-users',
  imports: [MatTableModule, CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  displayedColumns: string[] = ['id', 'name', 'editDelete'];
  dataSource: User[] = [];
  status = '';
  statusClass = '';
  isAdding = false
  name:string = '';
  isEditing: Map<number, boolean> = new Map();

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
    });
  }

  toggleAddUserForm() {
    this.isAdding = !this.isAdding
  }

  addUser(){
    const user: User = {
      name: this.name,
    };

    this.dbService.addUser(user).subscribe({
      next: () => {
        this.status = 'User added successfully.',
        this.statusClass = 'alert alert-success',
        this.dbService.getUsers().subscribe(data => this.dataSource = data)
        this.isAdding = false
      }, 
      error: (err) => {
        this.status = err.error.error,
        this.statusClass = 'alert alert-danger'
      }  
    });
  }

  toggleEditUserForm(id:number) {
    this.isEditing.set(id, !this.isEditing.get(id))
  }

  editUser(id:number, name:string){
    const user: User = {
      id: id,
      name: name,
    };

    this.dbService.editUser(user).subscribe({
      next: () => {
        this.status = 'User edited successfully.',
        this.statusClass = 'alert alert-success',
        this.dbService.getUsers().subscribe(data => this.dataSource = data)
        this.isAdding = false
        this.toggleEditUserForm(id)
      }, 
      error: (err) => {
        this.status = err.error.error,
        this.statusClass = 'alert alert-danger'
      }  
    });
  }
}
