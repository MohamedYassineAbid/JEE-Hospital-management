import { Component } from '@angular/core';
import { RouterOutlet, RouterModule, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { AuthService, UserContext } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  showLayout = false;
  userContext: UserContext | null = null;

  constructor(private router: Router, private authService: AuthService) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // Hide sidebar/header on Home, Login, and Register pages
      const currentRoute = event.urlAfterRedirects;
      this.showLayout = !(['/', '/login', '/register', ''].includes(currentRoute));
      this.userContext = this.authService.getUserContext();
    });
  }

  getDisplayName(): string {
    if (this.userContext?.firstName) {
      return `${this.userContext.firstName} ${this.userContext.lastName || ''}`.trim();
    }
    return this.userContext?.username || 'User';
  }

  getAvatarUrl(): string {
    if (this.userContext?.photoUrl) {
      return this.userContext.photoUrl;
    }
    const name = this.getDisplayName();
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=667eea&color=fff`;
  }

  logout() {
    this.authService.logout();
  }
}
