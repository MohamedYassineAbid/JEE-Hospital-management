import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

export interface UserContext {
  userId: string;
  username: string;
  email: string;
  userType: 'ADMIN' | 'DOCTOR' | 'PATIENT';
  firstName?: string;
  lastName?: string;
  photoUrl?: string;
  hospitalId?: number;
  doctorId?: number;
  patientId?: number;
  roles?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private tokenKey = 'medicore_auth_token';
  private userContextKey = 'medicore_user_context';
  
  private authStatusSubj = new BehaviorSubject<boolean>(this.hasToken());
  public authStatus$ = this.authStatusSubj.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  login(credentials: { email: string, password: string }): Observable<UserContext> {
    return this.http.post<UserContext>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap(res => {
        if (res && res.userId) {
          // Use the userId as a simple session token
          this.setToken(res.userId);
          this.setUserContext(res);
          this.authStatusSubj.next(true);
        }
      })
    );
  }

  register(data: any): Observable<UserContext> {
    return this.http.post<UserContext>(`${this.apiUrl}/auth/register`, data);
  }

  getProfile(): Observable<UserContext> {
    const ctx = this.getUserContext();
    return this.http.get<UserContext>(`${this.apiUrl}/auth/profile`, {
      params: { email: ctx?.email || '' }
    });
  }

  updateProfile(data: { email: string, firstName: string, lastName: string, photoUrl?: string }): Observable<UserContext> {
    return this.http.put<UserContext>(`${this.apiUrl}/auth/profile`, data).pipe(
      tap(res => {
        if (res) {
          this.setUserContext(res);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userContextKey);
    this.authStatusSubj.next(false);
    this.router.navigate(['/login']);
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  hasToken(): boolean {
    return !!this.getToken();
  }

  setUserContext(context: UserContext): void {
    localStorage.setItem(this.userContextKey, JSON.stringify(context));
  }

  getUserContext(): UserContext | null {
    const ctx = localStorage.getItem(this.userContextKey);
    if (ctx) {
      return JSON.parse(ctx) as UserContext;
    }
    return null;
  }

  isLoggedIn(): boolean {
    return this.hasToken() && !!this.getUserContext();
  }
}
