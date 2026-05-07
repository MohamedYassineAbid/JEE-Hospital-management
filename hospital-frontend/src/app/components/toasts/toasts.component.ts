import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toasts',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      <div *ngFor="let toast of toastService.toasts$ | async" 
           [class]="'toast-item ' + toast.type">
        <span class="icon">{{ getIcon(toast.type) }}</span>
        <span class="message">{{ toast.message }}</span>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .toast-item {
      min-width: 280px;
      padding: 12px 20px;
      border-radius: 12px;
      color: white;
      display: flex;
      align-items: center;
      gap: 12px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
      animation: slideIn 0.3s ease-out;
      backdrop-filter: blur(5px);
    }
    .success { background: rgba(34, 197, 94, 0.9); }
    .error { background: rgba(239, 68, 68, 0.9); }
    .warning { background: rgba(245, 158, 11, 0.9); }
    .info { background: rgba(59, 130, 246, 0.9); }
    
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    .icon { font-size: 1.2rem; }
    .message { font-weight: 500; font-size: 0.9rem; }
  `]
})
export class ToastsComponent {
  constructor(public toastService: ToastService) {}

  getIcon(type: string): string {
    switch(type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      default: return 'ℹ️';
    }
  }
}
