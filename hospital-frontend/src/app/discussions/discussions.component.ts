import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { ApiService } from '../services/api.service';

interface Message {
  sender: string;
  text: string;
  time: Date;
  isSelf: boolean;
}

@Component({
  selector: 'app-discussions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container-fluid py-4">
      <div class="row justify-content-center">
        <div class="col-md-10 col-lg-8">
          <div class="card shadow-lg border-0 rounded-4 overflow-hidden" style="height: 80vh;">
            <div class="card-header bg-primary text-white p-3 d-flex align-items-center">
              <i class="bi bi-chat-dots-fill fs-4 me-3"></i>
              <div>
                <h5 class="mb-0">Private Discussion</h5>
                <small class="opacity-75">Secure end-to-end messaging</small>
              </div>
            </div>
            
            <div class="card-body p-0 d-flex flex-column bg-light">
              <!-- Chat Messages Area -->
              <div class="flex-grow-1 p-4 overflow-auto" #scrollMe [scrollTop]="scrollMe.scrollHeight">
                <div *ngFor="let msg of messages" [class]="'d-flex mb-4 ' + (msg.isSelf ? 'justify-content-end' : 'justify-content-start')">
                  <div [class]="'max-width-75 p-3 rounded-4 shadow-sm ' + (msg.isSelf ? 'bg-primary text-white rounded-tr-0' : 'bg-white text-dark rounded-tl-0')">
                    <div class="small fw-bold mb-1 opacity-75">{{msg.sender}}</div>
                    <div>{{msg.text}}</div>
                    <div class="tiny text-end mt-2 opacity-50">{{msg.time | date:'shortTime'}}</div>
                  </div>
                </div>
                
                <div *ngIf="messages.length === 0" class="h-100 d-flex align-items-center justify-content-center text-muted flex-column">
                  <i class="bi bi-chat-quote display-1 opacity-25 mb-3"></i>
                  <p>Start a conversation with your medical professional</p>
                </div>
              </div>

              <!-- Input Area -->
              <div class="p-3 bg-white border-top">
                <form (ngSubmit)="sendMessage()" class="d-flex gap-2">
                  <input type="text" class="form-control rounded-pill px-4" placeholder="Type your message here..." [(ngModel)]="newMessage" name="msg">
                  <button type="submit" class="btn btn-primary rounded-circle p-0 d-flex align-items-center justify-content-center" style="width: 45px; height: 45px;">
                    <i class="bi bi-send-fill fs-5"></i>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .max-width-75 { max-width: 75%; }
    .rounded-tr-0 { border-top-right-radius: 0 !important; }
    .rounded-tl-0 { border-top-left-radius: 0 !important; }
    .tiny { font-size: 0.7rem; }
    .overflow-auto { scroll-behavior: smooth; }
  `]
})
export class DiscussionsComponent implements OnInit {
  messages: Message[] = [];
  newMessage = '';
  currentUserContext: any;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.currentUserContext = this.authService.getUserContext();
    
    // Mock initial messages
    if (this.currentUserContext?.userType === 'PATIENT') {
      this.messages = [
        { sender: 'Dr. Sarah Wilson', text: 'Hello! How are you feeling today?', time: new Date(Date.now() - 3600000), isSelf: false },
        { sender: 'You', text: 'I feel a bit better, but the cough persists.', time: new Date(Date.now() - 1800000), isSelf: true }
      ];
    } else if (this.currentUserContext?.userType === 'DOCTOR') {
      this.messages = [
        { sender: 'John Doe', text: 'Doctor, should I continue the medication?', time: new Date(Date.now() - 3600000), isSelf: false }
      ];
    }
  }

  sendMessage(): void {
    if (!this.newMessage.trim()) return;

    this.messages.push({
      sender: 'You',
      text: this.newMessage,
      time: new Date(),
      isSelf: true
    });

    this.newMessage = '';
    
    // Mock auto-reply
    setTimeout(() => {
      if (this.currentUserContext?.userType === 'PATIENT') {
        this.messages.push({
          sender: 'Dr. Sarah Wilson',
          text: 'I see. Please continue the treatment for 2 more days.',
          time: new Date(),
          isSelf: false
        });
      }
    }, 1500);
  }
}
