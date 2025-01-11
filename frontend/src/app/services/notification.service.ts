import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Notification {
  message: string;
  type: 'success' | 'error';
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notification = new Subject<Notification>();
  notification$ = this.notification.asObservable();

  show(message: string, type: 'success' | 'error' = 'success') {
    this.notification.next({ message, type });
  }
} 