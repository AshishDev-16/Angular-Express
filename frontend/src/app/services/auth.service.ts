import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Admin, AdminAuthResponse } from '../models/admin';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/api/auth`;
  private adminSubject = new BehaviorSubject<Admin | null>(null);
  admin$ = this.adminSubject.asObservable();

  constructor(private http: HttpClient) {
    // Check for stored admin data on init
    const storedAdmin = localStorage.getItem('admin');
    if (storedAdmin) {
      this.adminSubject.next(JSON.parse(storedAdmin));
    }
  }

  login(email: string, password: string): Observable<AdminAuthResponse> {
    return this.http.post<AdminAuthResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('admin', JSON.stringify(response.data.admin));
          this.adminSubject.next(response.data.admin);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    this.adminSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getCurrentAdmin(): Admin | null {
    return this.adminSubject.value;
  }
} 