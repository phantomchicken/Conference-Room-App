import { Component } from '@angular/core';
import {MatTableModule} from '@angular/material/table';

@Component({
  selector: 'app-users',
  imports: [MatTableModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  displayedColumns: string[] = ['id', 'name'];
  dataSource = [];
  
    ngOnInit() {
      fetch('http://localhost:3000/users')
      .then(response => response.json())
      .then(data => {
        this.dataSource = data;
      });
    }
}
