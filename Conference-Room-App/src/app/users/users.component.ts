import { Component } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import { DatabaseService } from '../database.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users',
  imports: [MatTableModule, CommonModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  displayedColumns: string[] = ['id', 'name', 'editDelete'];
  dataSource = [];
  status = '';

  constructor(private dbService: DatabaseService) {}

  ngOnInit() {
    this.dbService.getUsers().subscribe(data => this.dataSource = data);
  }
}
