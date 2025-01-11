import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  isEditMode = false;
  userId: string | null = null;
  loading = false;
  error = '';
  departments = ['IT', 'HR', 'Finance', 'Marketing', 'Sales', 'Operations', 'Management'];
  countries = ['United States', 'Canada', 'United Kingdom', 'Australia', 'India', 'Germany', 'France'];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    public router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService
  ) {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      dateOfBirth: ['', Validators.required],
      gender: ['prefer-not-to-say'],
      department: [''],
      position: [''],
      status: ['active'],
      address: this.fb.group({
        street: [''],
        city: [''],
        state: [''],
        zipCode: ['', Validators.pattern(/^\d{6}$/)],
        country: ['United States']
      }),
      socialLinks: this.fb.group({
        linkedin: ['', Validators.pattern(/^https?:\/\/.*$/)],
        twitter: ['', Validators.pattern(/^https?:\/\/.*$/)],
        facebook: ['', Validators.pattern(/^https?:\/\/.*$/)]
      }),
      profileImage: ['']
    });
  }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
    if (this.userId) {
      this.isEditMode = true;
      this.loadUser(this.userId);
    }
  }

  loadUser(id: string): void {
    this.loading = true;
    this.userService.getUserById(id).subscribe({
      next: (user) => {
        this.userForm.patchValue(user);
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error loading user';
        this.loading = false;
        console.error('Error:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      this.loading = true;
      const userData: User = this.userForm.value;

      const request = this.isEditMode
        ? this.userService.updateUser(this.userId!, userData)
        : this.userService.createUser(userData);

      request.subscribe({
        next: () => {
          this.notificationService.show(
            `User ${this.isEditMode ? 'updated' : 'created'} successfully`
          );
          this.router.navigate(['/admin/users']);
        },
        error: (error) => {
          this.error = 'Error saving user';
          this.notificationService.show('Error saving user', 'error');
          this.loading = false;
          console.error('Error:', error);
        }
      });
    }
  }
}
