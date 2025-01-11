import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { NotificationService } from '../../../services/notification.service';

interface LanguageOption {
  code: string;
  name: string;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-lg-8 mx-auto">
          <!-- Appearance Settings -->
          <div class="card shadow-sm mb-4">
            <div class="card-header bg-white py-3">
              <h5 class="mb-0">
                <i class="bi bi-palette me-2"></i>
                Appearance
              </h5>
            </div>
            <div class="card-body">
              <div class="mb-4">
                <h6 class="mb-3">Theme</h6>
                <div class="form-check form-switch">
                  <input 
                    class="form-check-input" 
                    type="checkbox" 
                    id="themeSwitch"
                    [checked]="isDarkMode"
                    (change)="toggleTheme()"
                  >
                  <label class="form-check-label" for="themeSwitch">
                    <i class="bi" [ngClass]="isDarkMode ? 'bi-moon-stars' : 'bi-sun'"></i>
                    {{isDarkMode ? 'Dark' : 'Light'}} Mode
                  </label>
                </div>
              </div>

              <div class="mb-4">
                <h6 class="mb-3">Language</h6>
                <select class="form-select" [(ngModel)]="selectedLanguage" (change)="changeLanguage()">
                  <option *ngFor="let lang of languages" [value]="lang.code">
                    {{lang.name}}
                  </option>
                </select>
              </div>

              <div class="mb-4">
                <h6 class="mb-3">Layout Density</h6>
                <div class="btn-group">
                  <button 
                    *ngFor="let option of densityOptions"
                    class="btn"
                    [class.btn-primary]="selectedDensity === option.value"
                    [class.btn-outline-primary]="selectedDensity !== option.value"
                    (click)="changeDensity(option.value)"
                  >
                    {{option.label}}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Profile Settings -->
          <div class="card shadow-sm mb-4">
            <div class="card-header bg-white py-3">
              <h5 class="mb-0">
                <i class="bi bi-person me-2"></i>
                Profile Settings
              </h5>
            </div>
            <div class="card-body">
              <form [formGroup]="profileForm" (ngSubmit)="updateProfile()">
                <div class="mb-3">
                  <label class="form-label">Username</label>
                  <input 
                    type="text" 
                    class="form-control"
                    formControlName="username"
                    [ngClass]="{'is-invalid': profileForm.get('username')?.invalid && profileForm.get('username')?.touched}"
                  >
                  <div class="invalid-feedback">
                    Username is required (minimum 3 characters)
                  </div>
                </div>
                <button 
                  type="submit" 
                  class="btn btn-primary"
                  [disabled]="profileForm.invalid || profileLoading"
                >
                  <i class="bi bi-check-circle me-2"></i>Update Profile
                </button>
              </form>
            </div>
          </div>

          <!-- Security Settings -->
          <div class="card shadow-sm mb-4">
            <div class="card-header bg-white py-3">
              <h5 class="mb-0">
                <i class="bi bi-shield-lock me-2"></i>
                Security Settings
              </h5>
            </div>
            <div class="card-body">
              <!-- Password Change -->
              <div class="mb-4">
                <h6 class="mb-3">Change Password</h6>
                <form [formGroup]="passwordForm" (ngSubmit)="updatePassword()">
                  <div class="mb-3">
                    <label class="form-label">Current Password</label>
                    <input 
                      type="password" 
                      class="form-control"
                      formControlName="currentPassword"
                    >
                  </div>
                  <div class="mb-3">
                    <label class="form-label">New Password</label>
                    <input 
                      type="password" 
                      class="form-control"
                      formControlName="newPassword"
                    >
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Confirm New Password</label>
                    <input 
                      type="password" 
                      class="form-control"
                      formControlName="confirmPassword"
                    >
                    <div class="invalid-feedback" *ngIf="passwordForm.errors?.['passwordMismatch']">
                      Passwords do not match
                    </div>
                  </div>
                  <button 
                    type="submit" 
                    class="btn btn-primary"
                    [disabled]="passwordForm.invalid || passwordLoading"
                  >
                    <i class="bi bi-lock me-2"></i>Update Password
                  </button>
                </form>
              </div>

              <!-- Two-Factor Authentication -->
              <div class="mb-4">
                <h6 class="mb-3">Two-Factor Authentication</h6>
                <div class="form-check form-switch">
                  <input 
                    class="form-check-input" 
                    type="checkbox" 
                    id="twoFactorSwitch"
                    [(ngModel)]="twoFactorEnabled"
                    (change)="toggleTwoFactor()"
                  >
                  <label class="form-check-label" for="twoFactorSwitch">
                    Enable Two-Factor Authentication
                  </label>
                </div>
                <small class="text-muted d-block mt-2">
                  Enhance your account security by requiring both your password and a verification code.
                </small>
              </div>

              <!-- Session Management -->
              <div class="mb-4">
                <h6 class="mb-3">Active Sessions</h6>
                <div class="list-group">
                  <div class="list-group-item" *ngFor="let session of activeSessions">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <i class="bi" [ngClass]="session.device === 'mobile' ? 'bi-phone' : 'bi-laptop'"></i>
                        <span class="ms-2">{{session.location}}</span>
                        <small class="text-muted ms-2">{{session.lastActive | date:'medium'}}</small>
                      </div>
                      <button class="btn btn-sm btn-outline-danger" (click)="terminateSession(session.id)">
                        Terminate
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Notification Settings -->
          <div class="card shadow-sm mb-4">
            <div class="card-header bg-white py-3">
              <h5 class="mb-0">
                <i class="bi bi-bell me-2"></i>
                Notification Settings
              </h5>
            </div>
            <div class="card-body">
              <form [formGroup]="notificationForm">
                <div class="mb-3">
                  <h6 class="mb-3">Email Notifications</h6>
                  <div class="form-check mb-2">
                    <input 
                      class="form-check-input" 
                      type="checkbox" 
                      id="newUserNotif"
                      formControlName="newUser"
                    >
                    <label class="form-check-label" for="newUserNotif">
                      New User Registrations
                    </label>
                  </div>
                  <div class="form-check mb-2">
                    <input 
                      class="form-check-input" 
                      type="checkbox" 
                      id="userUpdateNotif"
                      formControlName="userUpdate"
                    >
                    <label class="form-check-label" for="userUpdateNotif">
                      User Profile Updates
                    </label>
                  </div>
                  <div class="form-check">
                    <input 
                      class="form-check-input" 
                      type="checkbox" 
                      id="securityNotif"
                      formControlName="security"
                    >
                    <label class="form-check-label" for="securityNotif">
                      Security Alerts
                    </label>
                  </div>
                </div>
                <button 
                  type="button" 
                  class="btn btn-primary"
                  (click)="saveNotificationSettings()"
                >
                  <i class="bi bi-save me-2"></i>Save Notification Settings
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SettingsComponent implements OnInit {
  isDarkMode = false;
  profileForm: FormGroup;
  passwordForm: FormGroup;
  profileLoading = false;
  passwordLoading = false;

  languages: LanguageOption[] = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' }
  ];
  selectedLanguage = 'en';

  densityOptions = [
    { value: 'comfortable', label: 'Comfortable' },
    { value: 'compact', label: 'Compact' },
    { value: 'cozy', label: 'Cozy' }
  ];
  selectedDensity = 'comfortable';

  twoFactorEnabled = false;

  activeSessions = [
    { id: 1, device: 'laptop', location: 'Current Session', lastActive: new Date() },
    { id: 2, device: 'mobile', location: 'Mumbai, India', lastActive: new Date(Date.now() - 86400000) }
  ];

  notificationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {
    this.profileForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });

    this.notificationForm = this.fb.group({
      newUser: [true],
      userUpdate: [false],
      security: [true]
    });
  }

  ngOnInit() {
    // Load current theme
    this.isDarkMode = localStorage.getItem('theme') === 'dark';
    this.applyTheme();

    // Load current user data
    const admin = this.authService.getCurrentAdmin();
    if (admin) {
      this.profileForm.patchValue({
        username: admin.username
      });
    }
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    this.applyTheme();
  }

  applyTheme() {
    document.body.classList.toggle('dark-theme', this.isDarkMode);
  }

  updateProfile() {
    if (this.profileForm.valid) {
      this.profileLoading = true;
      this.authService.updateProfile(this.profileForm.value).subscribe({
        next: () => {
          this.notificationService.show('Profile updated successfully');
          this.profileLoading = false;
        },
        error: (error) => {
          this.notificationService.show('Error updating profile', 'error');
          this.profileLoading = false;
          console.error('Error:', error);
        }
      });
    }
  }

  updatePassword() {
    if (this.passwordForm.valid) {
      this.passwordLoading = true;
      this.authService.updatePassword(this.passwordForm.value).subscribe({
        next: () => {
          this.notificationService.show('Password updated successfully');
          this.passwordForm.reset();
          this.passwordLoading = false;
        },
        error: (error) => {
          this.notificationService.show('Error updating password', 'error');
          this.passwordLoading = false;
          console.error('Error:', error);
        }
      });
    }
  }

  private passwordMatchValidator(group: FormGroup) {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  changeLanguage() {
    // Implement language change logic
    this.notificationService.show(`Language changed to ${
      this.languages.find(l => l.code === this.selectedLanguage)?.name
    }`);
  }

  changeDensity(density: string) {
    this.selectedDensity = density;
    document.body.setAttribute('data-density', density);
    this.notificationService.show(`Layout density changed to ${density}`);
  }

  toggleTwoFactor() {
    // Implement 2FA toggle logic
    this.notificationService.show(
      this.twoFactorEnabled 
        ? 'Two-factor authentication enabled' 
        : 'Two-factor authentication disabled'
    );
  }

  terminateSession(sessionId: number) {
    // Implement session termination logic
    this.activeSessions = this.activeSessions.filter(s => s.id !== sessionId);
    this.notificationService.show('Session terminated successfully');
  }

  saveNotificationSettings() {
    // Implement notification settings save logic
    this.notificationService.show('Notification settings saved successfully');
  }
} 