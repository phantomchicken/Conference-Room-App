import { Component, OnInit, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../models';
import { switchMap } from 'rxjs';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-users',
  imports: [MatTableModule, CommonModule, FormsModule],
  templateUrl: './users.component.html',
})
export class UsersComponent implements OnInit {
  private usersService = inject(UsersService);

  displayedColumns: string[] = ['id', 'name', 'editDelete'];
  dataSource: User[] = [];
  status = '';
  statusClass = '';
  isAdding = false;
  name = '';
  isEditing = new Map<number, boolean>();

  ngOnInit() {
    this.usersService.getUsers().subscribe((data) => (this.dataSource = data));
  }

  deleteUser(id: number) {
    this.usersService.deleteUser(id).pipe(
      switchMap(() => this.usersService.getUsers())
    ).subscribe({
      next: (data) => {
        this.dataSource = data;
        this.status = 'User deleted successfully.';
        this.statusClass = 'alert alert-success';
      },
      error: () => {
        this.status = 'Error deleting user!';
        this.statusClass = 'alert alert-danger';
      }
    });
  }

  toggleAddUserForm() {
    this.isAdding = !this.isAdding;
  }

  addUser() {
    const user: User = {
      name: this.name,
    };

    this.usersService.addUser(user).pipe(
      switchMap(() => this.usersService.getUsers())
    ).subscribe({
      next: (data) => {
        this.dataSource = data;
        this.status = 'User added successfully.';
        this.statusClass = 'alert alert-success';
        this.isAdding = false;
      },
      error: (err) => {
        this.status = err.error?.error || 'Error adding user!';
        this.statusClass = 'alert alert-danger';
      }
    });
  }

  toggleEditUserForm(id: number) {
    this.isEditing.set(id, !this.isEditing.get(id));
  }

  editUser(id: number, name: string) {
    const user: User = {
      id: id,
      name: name,
    };

    this.usersService.editUser(user).pipe(
      switchMap(() => this.usersService.getUsers())
    ).subscribe({
      next: (data) => {
        this.dataSource = data;
        this.status = 'User edited successfully.';
        this.statusClass = 'alert alert-success';
        this.toggleEditUserForm(id);
      },
      error: (err) => {
        this.status = err.error.error || 'Error editing user!';
        this.statusClass = 'alert alert-danger';
      }
    });
  }
}
