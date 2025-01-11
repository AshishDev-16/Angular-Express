import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user';

interface UserMetrics {
  totalUsers: number;
  newUsersThisMonth: number;
  activeUsers: number;
  averageUsersPerMonth: number;
  usersByDomain: { [key: string]: number };
  growthRate: number;
  previousMonthUsers: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="card shadow-sm">
            <div class="card-body">
              <h2 class="card-title mb-4">Dashboard Overview</h2>
              
              <!-- Primary Stats Cards -->
              <div class="row g-3">
                <div class="col-md-3">
                  <div class="card bg-primary text-white">
                    <div class="card-body">
                      <div class="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 class="card-subtitle mb-2">Total Users</h6>
                          <h2 class="mb-0">{{metrics.totalUsers}}</h2>
                        </div>
                        <i class="bi bi-people fs-1"></i>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="col-md-3">
                  <div class="card bg-success text-white">
                    <div class="card-body">
                      <div class="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 class="card-subtitle mb-2">New Users (This Month)</h6>
                          <h2 class="mb-0">{{metrics.newUsersThisMonth}}</h2>
                          <small class="text-white-50">
                            <i class="bi" [ngClass]="metrics.growthRate >= 0 ? 'bi-arrow-up' : 'bi-arrow-down'"></i>
                            {{metrics.growthRate}}% from last month
                          </small>
                        </div>
                        <i class="bi bi-person-plus fs-1"></i>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="col-md-3">
                  <div class="card bg-info text-white">
                    <div class="card-body">
                      <div class="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 class="card-subtitle mb-2">Active Users</h6>
                          <h2 class="mb-0">{{metrics.activeUsers}}</h2>
                          <small class="text-white-50">
                            {{(metrics.activeUsers / metrics.totalUsers * 100).toFixed(1)}}% of total
                          </small>
                        </div>
                        <i class="bi bi-person-check fs-1"></i>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="col-md-3">
                  <div class="card bg-warning text-white">
                    <div class="card-body">
                      <div class="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 class="card-subtitle mb-2">Avg Users/Month</h6>
                          <h2 class="mb-0">{{metrics.averageUsersPerMonth}}</h2>
                        </div>
                        <i class="bi bi-graph-up fs-1"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Secondary Stats -->
              <div class="row mt-4">
                <div class="col-md-6">
                  <div class="card">
                    <div class="card-header bg-white">
                      <h5 class="mb-0">Email Domains Distribution</h5>
                    </div>
                    <div class="card-body">
                      <div class="list-group">
                        <div class="list-group-item d-flex justify-content-between align-items-center"
                             *ngFor="let domain of getTopDomains()">
                          <span>
                            <i class="bi bi-envelope me-2"></i>
                            {{domain.name}}
                          </span>
                          <span>
                            <span class="badge bg-primary rounded-pill">{{domain.count}}</span>
                            <small class="text-muted ms-2">
                              ({{(domain.count / metrics.totalUsers * 100).toFixed(1)}}%)
                            </small>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="card">
                    <div class="card-header bg-white">
                      <h5 class="mb-0">Growth Metrics</h5>
                    </div>
                    <div class="card-body">
                      <ul class="list-group">
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                          <span>Previous Month Users</span>
                          <span class="badge bg-secondary">{{metrics.previousMonthUsers}}</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                          <span>Current Month Users</span>
                          <span class="badge bg-primary">{{metrics.newUsersThisMonth}}</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                          <span>Monthly Growth Rate</span>
                          <span [class]="'badge ' + (metrics.growthRate >= 0 ? 'bg-success' : 'bg-danger')">
                            {{metrics.growthRate}}%
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Recent Users Table -->
              <div class="row mt-4">
                <div class="col-12">
                  <div class="card">
                    <div class="card-header bg-white">
                      <div class="d-flex justify-content-between align-items-center">
                        <h5 class="mb-0">Recent Users</h5>
                        <a routerLink="/admin/users" class="btn btn-primary btn-sm">
                          View All
                        </a>
                      </div>
                    </div>
                    <div class="card-body">
                      <div class="table-responsive">
                        <table class="table table-hover">
                          <thead>
                            <tr>
                              <th>Name</th>
                              <th>Email</th>
                              <th>Phone</th>
                              <th>Joined</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr *ngFor="let user of recentUsers">
                              <td>
                                <i class="bi bi-person-circle me-2"></i>
                                {{user.name}}
                              </td>
                              <td>{{user.email}}</td>
                              <td>{{user.phone}}</td>
                              <td>{{user.createdAt | date:'medium'}}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      transition: transform 0.2s;
    }
    .card:hover {
      transform: translateY(-5px);
    }
  `]
})
export class DashboardComponent implements OnInit {
  metrics: UserMetrics = {
    totalUsers: 0,
    newUsersThisMonth: 0,
    activeUsers: 0,
    averageUsersPerMonth: 0,
    usersByDomain: {},
    growthRate: 0,
    previousMonthUsers: 0
  };
  recentUsers: User[] = [];

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.calculateMetrics(users);
        this.recentUsers = this.getRecentUsers(users);
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
      }
    });
  }

  private calculateMetrics(users: User[]) {
    const now = new Date();
    const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    
    // Calculate basic metrics
    this.metrics.totalUsers = users.length;
    this.metrics.newUsersThisMonth = users.filter(user => 
      new Date(user.createdAt!) >= firstDayThisMonth
    ).length;
    this.metrics.previousMonthUsers = users.filter(user => 
      new Date(user.createdAt!) >= firstDayLastMonth && 
      new Date(user.createdAt!) < firstDayThisMonth
    ).length;
    
    // Calculate growth rate
    this.metrics.growthRate = this.metrics.previousMonthUsers ? 
      ((this.metrics.newUsersThisMonth - this.metrics.previousMonthUsers) / 
       this.metrics.previousMonthUsers * 100) : 0;
    
    // Calculate average users per month - Fixed calculation
    if (users.length === 0) {
      this.metrics.averageUsersPerMonth = 0;
    } else {
      const oldestUser = users.reduce((oldest, user) => 
        new Date(user.createdAt!) < new Date(oldest.createdAt!) ? user : oldest
      , users[0]);
      
      const oldestDate = new Date(oldestUser.createdAt!);
      const monthDiff = (now.getFullYear() - oldestDate.getFullYear()) * 12 + 
                       (now.getMonth() - oldestDate.getMonth()) + 1; // Add 1 to include current month
      
      this.metrics.averageUsersPerMonth = Math.round(this.metrics.totalUsers / Math.max(1, monthDiff));
    }
    
    // Calculate email domains
    this.metrics.usersByDomain = users.reduce((acc, user) => {
      const domain = user.email.split('@')[1];
      acc[domain] = (acc[domain] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    // Set active users (for demo purposes)
    this.metrics.activeUsers = Math.round(this.metrics.totalUsers * 0.8); // Assuming 80% active
  }

  private getRecentUsers(users: User[]): User[] {
    return users
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
      .slice(0, 5);
  }

  getTopDomains(): { name: string, count: number }[] {
    return Object.entries(this.metrics.usersByDomain)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }
} 