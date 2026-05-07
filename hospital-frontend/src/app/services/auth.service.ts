import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

export interface LoginResponse {
  username: string;
  roles: string[];
  accessToken: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private readonly STORAGE_KEY = 'hospital_user';
  private userSubject = new BehaviorSubject<LoginResponse | null>(this.getUser());
  public user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  public login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { username, password }).pipe(
      tap(response => {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(response));
        this.userSubject.next(response);
      }),
      catchError(err => {
        return throwError(() => err);
      })
    );
  }

  public register(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, data);
  }

  public logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  public isLoggedIn(): boolean {
    return localStorage.getItem(this.STORAGE_KEY) !== null;
  }

  public getUser(): LoginResponse | null {
    const data = localStorage.getItem(this.STORAGE_KEY);
    try {
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  public getToken(): string | null {
    const user = this.getUser();
    return user ? user.accessToken : null;
  }

  public getUsername(): string {
    return this.getUser()?.username || '';
  }

  public getRoles(): string[] {
    return this.getUser()?.roles || [];
  }

  public getRole(): string {
    const roles = this.getRoles();
    if (roles.includes('DOCTOR')) return 'DOCTOR';
    if (roles.includes('PATIENT')) return 'PATIENT';
    return '';
  }

  public hasRole(role: string): boolean {
    return this.getRoles().includes(role);
  }
}
