import { Component, HostListener } from '@angular/core';
import { RouterOutlet, RouterModule, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { ApiService } from './services/api.service';
import { ToastsComponent } from './components/toasts/toasts.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule, ToastsComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Dar Ettabib';
  isAuthPage = false;
  notifications: any[] = [];
  notificationCount = 0;
  showNotifDropdown = false;
  private pollInterval: any;
  private seenAppointmentIds: number[] = [];

  constructor(public auth: AuthService, private router: Router, private api: ApiService) {
    // Load seen appointments from local storage
    const saved = localStorage.getItem('seen_appointments');
    if (saved) this.seenAppointmentIds = JSON.parse(saved);

    // Close dropdown on navigation
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.showNotifDropdown = false;
      const url = event.urlAfterRedirects;
      this.isAuthPage = url.includes('/home') || url.includes('/login') || url === '/';
      
      if (this.isAuthPage && this.auth.isLoggedIn()) {
        const target = this.role === 'PATIENT' ? '/appointments' : '/dashboard';
        this.router.navigate([target]);
      }

      if (this.auth.isLoggedIn()) {
        this.startNotificationPolling();
      } else {
        this.stopNotificationPolling();
      }
    });
  }

  startNotificationPolling() {
    if (this.pollInterval) return;
    this.updateNotifications();
    this.pollInterval = setInterval(() => this.updateNotifications(), 10000);
  }

  stopNotificationPolling() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
  }

  toggleNotifDropdown(event: Event) {
    event.stopPropagation();
    this.showNotifDropdown = !this.showNotifDropdown;
    if (this.showNotifDropdown) {
      this.updateNotifications();
    }
  }

  @HostListener('document:click')
  closeDropdown() {
    this.showNotifDropdown = false;
  }

  updateNotifications() {
    if (!this.auth.isLoggedIn()) return;
    const username = this.auth.getUsername();
    const role = this.auth.getRole();
    const newNotifications: any[] = [];

    // 1. Fetch unread messages
    this.api.getUnreadMessages(username).subscribe(messages => {
      messages.forEach(m => {
        newNotifications.push({
          id: m.id,
          type: 'message',
          title: `New message from ${m.senderUsername}`,
          description: m.content,
          sender: m.senderUsername,
          target: '/messages'
        });
      });

      // 2. Fetch stats and find pending appointments
      const statsObs = role === 'DOCTOR' ? this.api.getDoctorStats(username) : this.api.getPatientStats(username);
      
      statsObs.subscribe(stats => {
        if (stats.recentActivities) {
          stats.recentActivities.forEach((act: any) => {
            if (act.status === 'PENDING' && !this.seenAppointmentIds.includes(act.id)) {
              newNotifications.push({
                id: act.id,
                type: 'appointment',
                title: 'New Appointment Request',
                description: `Appointment #${act.id} on ${new Date(act.date).toLocaleDateString()}`,
                target: '/appointments'
              });
            }
          });
        }
        this.notifications = newNotifications;
        this.notificationCount = newNotifications.length;
      });
    });
  }

  handleNotificationClick(notif: any) {
    if (notif.type === 'message') {
      this.api.markMessagesRead(notif.sender, this.auth.getUsername()).subscribe(() => {
        this.updateNotifications();
        this.router.navigate([notif.target]);
      });
    } else {
      this.seenAppointmentIds.push(notif.id);
      localStorage.setItem('seen_appointments', JSON.stringify(this.seenAppointmentIds));
      this.updateNotifications();
      this.router.navigate([notif.target]);
    }
  }

  clearAllNotifications() {
    this.notifications.forEach(n => {
      if (n.type === 'message') {
        this.api.markMessagesRead(n.sender, this.auth.getUsername()).subscribe();
      } else {
        this.seenAppointmentIds.push(n.id);
      }
    });
    localStorage.setItem('seen_appointments', JSON.stringify(this.seenAppointmentIds));
    this.updateNotifications();
  }

  get isLoggedIn(): boolean {
    return this.auth.isLoggedIn() && !this.isAuthPage;
  }

  get username(): string {
    return this.auth.getUsername();
  }

  get role(): string {
    return this.auth.getRole();
  }

  get roleBadgeClass(): string {
    switch (this.role) {
      case 'DOCTOR': return 'badge-doctor';
      case 'PATIENT': return 'badge-patient';
      default: return 'badge-admin';
    }
  }

  get roleLabel(): string {
    switch (this.role) {
      case 'DOCTOR': return 'Doctor';
      case 'PATIENT': return 'Patient';
      case 'ADMIN': return 'Administrator';
      default: return 'User';
    }
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/home']);
  }

  canSee(item: string): boolean {
    if (!this.auth.isLoggedIn()) return false;
    
    switch (item) {
      case 'dashboard':
        return this.role !== 'PATIENT'; // Patients don't see dashboard
      case 'patients':
        return this.role === 'ADMIN' || this.role === 'DOCTOR';
      case 'doctors':
        return true; // Patients see doctors to book, Admins manage them
      case 'consultations':
        return true; 
      case 'appointments':
        return true;
      default:
        return false;
    }
  }
}
