import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="card shadow-sm">
            <div class="card-body">
              <h2 class="card-title">Dashboard</h2>
              <div class="row mt-4">
                <div class="col-md-4">
                  <div class="card bg-primary text-white">
                    <div class="card-body">
                      <h5 class="card-title">Total Users</h5>
                      <h2 class="mb-0">{{totalUsers}}</h2>
                    </div>
                  </div>
                </div>
                <!-- Add more stats cards here -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class DashboardComponent implements OnInit {
  totalUsers: number = 0;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.totalUsers = users.length;
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      }
    });
  }
} 