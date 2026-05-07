import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { Appointment } from '../models/appointment.model';
import { interval, Subscription } from 'rxjs';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="chat-layout">
      <!-- Contacts Sidebar -->
      <aside class="contacts-sidebar">
        <div class="sidebar-p-header">
            <h5 class="m-0"><i class="bi bi-chat-heart-fill text-primary"></i> Chat</h5>
            <p class="small text-muted mb-0">Follow-up with patients</p>
        </div>
        <div class="contacts-list">
          <div *ngFor="let contact of contacts" 
               class="contact-item" 
               [class.active]="selectedContact?.username === contact.username"
               (click)="selectContact(contact)">
            <div class="avatar-mini">{{contact.name.charAt(0)}}</div>
            <div class="contact-info flex-grow-1">
              <p class="name">{{contact.name}}</p>
              <p class="role small text-muted">{{contact.role}}</p>
            </div>
            <div class="unread-dot" *ngIf="hasUnread(contact.username)"></div>
          </div>
          <div *ngIf="contacts.length === 0" class="text-center p-5 text-muted small">
            <i class="bi bi-people fs-1 d-block mb-2"></i>
            No verified contacts found.
          </div>
        </div>
      </aside>

      <!-- Chat Area -->
      <main class="chat-main">
        <header class="chat-header" *ngIf="selectedContact">
          <div class="header-user">
            <div class="avatar-header">{{selectedContact.name.charAt(0)}}</div>
            <div>
              <h6 class="mb-0">{{selectedContact.name}}</h6>
              <span class="status-online"><i class="bi bi-circle-fill" style="font-size: 8px;"></i> Active now</span>
            </div>
          </div>
        </header>

        <div class="messages-container" #scrollContainer>
          <div *ngIf="!selectedContact" class="empty-state">
            <div class="glass-orb-mini"></div>
            <i class="bi bi-chat-dots fs-1 mb-3 text-primary opacity-50"></i>
            <h5>Select a patient to start follow-up</h5>
            <p class="text-muted">Direct clinical messaging is secure and private.</p>
          </div>
          
          <div *ngFor="let msg of messages" 
               class="msg-wrapper" 
               [class.sent]="msg.senderUsername === currentUsername">
            <div class="msg-bubble shadow-sm">
              <div class="msg-content">{{msg.content}}</div>
              <div class="msg-meta">{{msg.timestamp | date:'HH:mm'}}</div>
            </div>
          </div>
        </div>

        <footer class="chat-footer" *ngIf="selectedContact">
          <form (ngSubmit)="send()" class="input-group shadow-sm">
            <input type="text" name="content" [(ngModel)]="newMsg" 
                   class="form-control border-0" placeholder="Type your message here..." autocomplete="off">
            <button type="submit" class="btn btn-primary" [disabled]="!newMsg.trim()">
              <i class="bi bi-send-fill"></i>
            </button>
          </form>
        </footer>
      </main>
    </div>
  `,
  styles: [`
    .chat-layout { display: flex; height: calc(100vh - 120px); background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05); border: 1px solid #f1f5f9; }
    .contacts-sidebar { width: 300px; background: #ffffff; border-right: 1px solid #f1f5f9; display: flex; flex-direction: column; }
    .sidebar-p-header { padding: 25px; border-bottom: 1px solid #f1f5f9; }
    .contacts-list { flex: 1; overflow-y: auto; }
    .contact-item { display: flex; align-items: center; gap: 15px; padding: 18px 25px; cursor: pointer; transition: 0.2s; border-bottom: 1px solid #f8fafc; }
    .contact-item:hover { background: #f8fafc; }
    .contact-item.active { background: #f0f9ff; border-right: 4px solid #0ea5e9; }
    .avatar-mini { width: 42px; height: 42px; background: #e0f2fe; color: #0ea5e9; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: 700; }
    .contact-info .name { font-weight: 600; color: #334155; margin-bottom: 2px; }
    .unread-dot { width: 10px; height: 10px; background: #ef4444; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 5px rgba(239,68,68,0.5); }

    .chat-main { flex: 1; display: flex; flex-direction: column; background: #fdfdfd; }
    .chat-header { padding: 15px 30px; background: white; border-bottom: 1px solid #f1f5f9; }
    .header-user { display: flex; align-items: center; gap: 15px; }
    .avatar-header { width: 42px; height: 42px; background: #0ea5e9; color: white; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: 700; }
    .status-online { font-size: 0.75rem; color: #10b981; font-weight: 500; }

    .messages-container { flex: 1; padding: 30px; overflow-y: auto; background: #f8fafc; display: flex; flex-direction: column; gap: 15px; scroll-behavior: smooth; }
    .empty-state { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; color: #94a3b8; }
    
    .msg-wrapper { display: flex; width: 100%; }
    .msg-wrapper.sent { justify-content: flex-end; }
    .msg-bubble { max-width: 65%; padding: 12px 18px; border-radius: 18px; font-size: 0.95rem; line-height: 1.5; }
    .msg-wrapper.sent .msg-bubble { background: #0ea5e9; color: white; border-bottom-right-radius: 4px; box-shadow: 0 4px 12px rgba(14, 165, 233, 0.2); }
    .msg-wrapper:not(.sent) .msg-bubble { background: white; color: #334155; border-bottom-left-radius: 4px; }
    .msg-meta { font-size: 0.65rem; opacity: 0.7; margin-top: 5px; text-align: right; }

    .chat-footer { padding: 25px 30px; background: white; border-top: 1px solid #f1f5f9; }
    .chat-footer .input-group { background: #f8fafc; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; }
    .chat-footer input { background: transparent; padding: 12px 20px; }
    .chat-footer .btn { padding: 0 25px; border-radius: 0; }
  `]
})
export class MessagesComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  
  contacts: any[] = [];
  selectedContact: any = null;
  messages: any[] = [];
  newMsg = '';
  currentUsername = '';
  unreadMessages: any[] = [];
  
  private pollSub?: Subscription;

  constructor(private apiService: ApiService, private auth: AuthService, private toast: ToastService) {
    this.currentUsername = this.auth.getUsername();
  }

  ngOnInit(): void {
    this.loadContacts();
    this.pollSub = interval(3000).subscribe(() => {
      this.checkNewMessages();
      if (this.selectedContact) {
        this.loadConversation(this.selectedContact.username);
      }
    });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  ngOnDestroy(): void {
    this.pollSub?.unsubscribe();
  }

  loadContacts(): void {
    this.apiService.getAppointments(0, 100).subscribe(data => {
      const uniqueContacts = new Map();
      const isDoctor = this.auth.getRole() === 'DOCTOR';
      
      data.content.forEach((appt: Appointment) => {
        const other = isDoctor ? appt.patient : appt.doctor;
        if (other && other.username) {
          uniqueContacts.set(other.username, {
            username: other.username,
            name: other.name,
            role: isDoctor ? 'Patient' : 'Doctor'
          });
        }
      });
      this.contacts = Array.from(uniqueContacts.values());
    });
  }

  selectContact(contact: any): void {
    this.selectedContact = contact;
    this.loadConversation(contact.username);
  }

  loadConversation(username: string): void {
    this.apiService.getConversation(this.currentUsername, username).subscribe(msgs => {
      this.messages = msgs;
    });
  }

  checkNewMessages(): void {
    this.apiService.getUnreadMessages(this.currentUsername).subscribe(unread => {
      this.unreadMessages = unread;
    });
  }

  hasUnread(username: string): boolean {
    return this.unreadMessages.some(m => m.senderUsername === username);
  }

  send(): void {
    if (!this.newMsg.trim() || !this.selectedContact) return;

    const msg = {
      senderUsername: this.currentUsername,
      receiverUsername: this.selectedContact.username,
      content: this.newMsg,
      timestamp: new Date()
    };

    this.apiService.sendMessage(msg).subscribe({
      next: () => {
        this.newMsg = '';
        this.loadConversation(this.selectedContact.username);
        this.scrollToBottom();
      },
      error: (err) => {
        this.toast.error(err.error?.error || 'Failed to send message');
      }
    });
  }
}
