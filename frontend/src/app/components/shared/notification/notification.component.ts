import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="message" class="notification-container">
      <div [class]="'alert alert-' + (type === 'success' ? 'success' : 'danger')">
        {{ message }}
      </div>
    </div>
  `,
  styles: [`
    .notification-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1050;
      animation: slideIn 0.5s ease-out;
    }
    @keyframes slideIn {
      from { transform: translateX(100%); }
      to { transform: translateX(0); }
    }
  `]
})
export class NotificationComponent implements OnInit {
  message: string = '';
  type: 'success' | 'error' = 'success';
  private timeout: any;

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.notificationService.notification$.subscribe(notification => {
      this.message = notification.message;
      this.type = notification.type;

      if (this.timeout) {
        clearTimeout(this.timeout);
      }

      this.timeout = setTimeout(() => {
        this.message = '';
      }, 3000);
    });
  }
} 