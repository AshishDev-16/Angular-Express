import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {
  user: User | null = null;
  loading = false;
  error = '';

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

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

  deleteUser(): void {
    if (this.user && confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(this.user._id!).subscribe({
        next: () => {
          this.router.navigate(['/users']);
        },
        error: (error) => {
          this.error = 'Error deleting user';
          console.error('Error:', error);
        }
      });
    }
  }
}
