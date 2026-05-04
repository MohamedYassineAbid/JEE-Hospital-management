import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError } from 'rxjs';

export interface LoginResponse {
  username: string;
  roles: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8086/api/auth';
  private readonly STORAGE_KEY = 'hospital_user';

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { username, password }).pipe(
      tap(response => {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(response));
      }),
      catchError(err => {
        return throwError(() => err);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return localStorage.getItem(this.STORAGE_KEY) !== null;
  }

  getUser(): LoginResponse | null {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  }

  getUsername(): string {
    return this.getUser()?.username || '';
  }

  getRoles(): string[] {
    return this.getUser()?.roles || [];
  }

  getRole(): string {
    const roles = this.getRoles();
    // Return the highest priority role
    if (roles.includes('ADMIN')) return 'ADMIN';
    if (roles.includes('DOCTOR')) return 'DOCTOR';
    if (roles.includes('PATIENT')) return 'PATIENT';
    return '';
  }

  hasRole(role: string): boolean {
    return this.getRoles().includes(role);
  }
}
