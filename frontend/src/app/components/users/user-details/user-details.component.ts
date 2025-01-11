import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-lg-8 mx-auto">
          <div class="card shadow-sm">
            <div class="card-header bg-white py-3">
              <div class="d-flex justify-content-between align-items-center">
                <h2 class="mb-0">
                  <i class="bi bi-person-badge me-2"></i>
                  User Details
                </h2>
                <div class="btn-group">
                  <button class="btn btn-warning" (click)="editUser()">
                    <i class="bi bi-pencil me-2"></i>Edit
                  </button>
                  <button class="btn btn-danger" (click)="confirmDelete()">
                    <i class="bi bi-trash me-2"></i>Delete
                  </button>
                </div>
              </div>
            </div>

            <div *ngIf="loading" class="card-body text-center py-5">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>

            <div *ngIf="error" class="alert alert-danger m-3">
              <i class="bi bi-exclamation-triangle me-2"></i>{{error}}
            </div>

            <div class="card-body" *ngIf="user && !loading">
              <!-- Basic Information -->
              <div class="card mb-4">
                <div class="card-header">
                  <h5 class="mb-0">Basic Information</h5>
                </div>
                <div class="card-body">
                  <div class="row">
                    <div class="col-md-6">
                      <p><strong>Name:</strong> {{user.name}}</p>
                      <p><strong>Email:</strong> {{user.email}}</p>
                      <p><strong>Phone:</strong> {{user.phone}}</p>
                      <p><strong>Date of Birth:</strong> {{user.dateOfBirth | date}}</p>
                      <p><strong>Gender:</strong> {{user.gender}}</p>
                    </div>
                    <div class="col-md-6">
                      <p><strong>Department:</strong> {{user.department || 'Not Assigned'}}</p>
                      <p><strong>Position:</strong> {{user.position || 'Not Assigned'}}</p>
                      <p><strong>Status:</strong> 
                        <span class="badge"
                              [ngClass]="{
                                'bg-success': user.status === 'active',
                                'bg-danger': user.status === 'inactive',
                                'bg-warning': user.status === 'pending'
                              }">
                          {{user.status}}
                        </span>
                      </p>
                      <p><strong>Joined:</strong> {{user.createdAt | date:'medium'}}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Address -->
              <div class="card mb-4" *ngIf="user.address">
                <div class="card-header">
                  <h5 class="mb-0">Address</h5>
                </div>
                <div class="card-body">
                  <p>{{user.address.street}}</p>
                  <p>{{user.address.city}}, {{user.address.state}} {{user.address.zipCode}}</p>
                  <p>{{user.address.country}}</p>
                </div>
              </div>

              <!-- Social Links -->
              <div class="card mb-4" *ngIf="user.socialLinks">
                <div class="card-header">
                  <h5 class="mb-0">Social Links</h5>
                </div>
                <div class="card-body">
                  <div class="d-flex gap-2">
                    <a *ngIf="user.socialLinks.linkedin" 
                       [href]="user.socialLinks.linkedin" 
                       target="_blank" 
                       class="btn btn-outline-primary">
                      <i class="bi bi-linkedin"></i>
                    </a>
                    <a *ngIf="user.socialLinks.twitter" 
                       [href]="user.socialLinks.twitter" 
                       target="_blank"
                       class="btn btn-outline-info">
                      <i class="bi bi-twitter"></i>
                    </a>
                    <a *ngIf="user.socialLinks.facebook" 
                       [href]="user.socialLinks.facebook" 
                       target="_blank"
                       class="btn btn-outline-primary">
                      <i class="bi bi-facebook"></i>
                    </a>
                  </div>
                </div>
              </div>

              <div class="d-grid">
                <a routerLink="/admin/users" class="btn btn-outline-secondary">
                  <i class="bi bi-arrow-left me-2"></i>Back to Users List
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class UserDetailsComponent implements OnInit {
  user: User | null = null;
  loading = false;
  error = '';

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadUser(id);
    }
  }

  loadUser(id: string): void {
    this.loading = true;
    this.userService.getUserById(id).subscribe({
      next: (user) => {
        this.user = user;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error loading user details';
        this.loading = false;
        console.error('Error:', error);
      }
    });
  }

  editUser(): void {
    if (this.user?._id) {
      this.router.navigate(['/admin/users/edit', this.user._id]);
    }
  }

  confirmDelete(): void {
    if (this.user?._id && confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(this.user._id).subscribe({
        next: () => {
          this.notificationService.show('User deleted successfully');
          this.router.navigate(['/admin/users']);
        },
        error: (error) => {
          this.error = 'Error deleting user';
          this.notificationService.show('Error deleting user', 'error');
          console.error('Error:', error);
        }
      });
    }
  }
}
