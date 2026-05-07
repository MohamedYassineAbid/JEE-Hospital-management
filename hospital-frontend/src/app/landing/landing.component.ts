import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="landing-container">
      <nav class="glass-nav">
        <div class="logo-wrapper">
          <div class="pulse-container">
            <svg viewBox="0 0 24 24" class="pulse-svg">
              <path d="M2 12h3l2-5 4 10 2-5h3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <span class="logo-text">Dar Ettabib</span>
        </div>
        <div class="nav-links">
          <a routerLink="/login" class="login-btn">Sign In</a>
        </div>
      </nav>

      <main class="hero">
        <div class="hero-content">
          <h1 class="gradient-text">Your Trusted Healing Center</h1>
          <p class="hero-subtitle">Dar Ettabib — A modern platform connecting patients with top doctors. Book appointments, manage consultations, and receive follow-up care seamlessly.</p>
          <div class="cta-group">
            <a [routerLink]="['/login']" [queryParams]="{mode: 'signup'}" class="cta-primary">Get Started</a>
            <a [routerLink]="['/login']" class="cta-secondary">Explore Features</a>
          </div>
        </div>
        <div class="hero-visual">
          <div class="floating-card c1">
            <div class="card-icon">👥</div>
            <div class="card-text">
              <h3>500+</h3>
              <p>Active Patients</p>
            </div>
          </div>
          <div class="floating-card c2">
            <div class="card-icon">📅</div>
            <div class="card-text">
              <h3>98%</h3>
              <p>Appointment Efficiency</p>
            </div>
          </div>
          <div class="main-visual">
             <div class="glass-orb"></div>
          </div>
        </div>
      </main>

      <section id="features" class="features">
        <div class="feature-card">
          <div class="feat-icon">🔐</div>
          <h3>Verified Doctors</h3>
          <p>Only verified medical professionals with secret keys can join our network.</p>
        </div>
        <div class="feature-card">
          <div class="feat-icon">📊</div>
          <h3>Smart Scheduling</h3>
          <p>Session-based booking with automatic capacity management and day-off detection.</p>
        </div>
        <div class="feature-card">
          <div class="feat-icon">⚡</div>
          <h3>Secure Follow-up</h3>
          <p>Private messaging between doctors and their patients for continuous care.</p>
        </div>
      </section>

      <footer>
        <p>&copy; 2026 Dar Ettabib. Your Health, Our Priority.</p>
      </footer>
    </div>
  `,
  styles: [`
    .landing-container {
      min-height: 100vh;
      background: #0f172a;
      color: white;
      font-family: 'Outfit', sans-serif;
      overflow-x: hidden;
      padding: 0 5%;
    }

    .glass-nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 2rem 0;
      backdrop-filter: blur(10px);
    }

    .logo-wrapper {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .pulse-container {
      width: 42px;
      height: 42px;
      background: linear-gradient(135deg, #38bdf8, #818cf8);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      box-shadow: 0 4px 12px rgba(56, 189, 248, 0.3);
    }

    .pulse-svg {
      width: 24px;
      height: 24px;
      stroke-dasharray: 100;
      animation: dash 2.5s linear infinite;
    }

    @keyframes dash {
      from { stroke-dashoffset: 100; }
      to { stroke-dashoffset: 0; }
    }

    .logo-text {
      font-size: 1.5rem;
      font-weight: 800;
      color: white;
      letter-spacing: -0.5px;
    }

    .login-btn {
      padding: 0.5rem 1.5rem;
      border-radius: 50px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: white;
      text-decoration: none;
      transition: all 0.3s;
    }

    .login-btn:hover {
      background: white;
      color: #0f172a;
    }

    .hero {
      display: grid;
      grid-template-columns: 1fr 1fr;
      align-items: center;
      padding: 5rem 0;
      gap: 4rem;
    }

    .gradient-text {
      font-size: 4rem;
      line-height: 1.1;
      background: linear-gradient(to right, #38bdf8, #818cf8);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 1.5rem;
    }

    .hero-subtitle {
      font-size: 1.25rem;
      color: #94a3b8;
      margin-bottom: 2.5rem;
      max-width: 500px;
    }

    .cta-group {
      display: flex;
      gap: 1.5rem;
    }

    .cta-primary {
      padding: 1rem 2rem;
      background: #38bdf8;
      color: white;
      border-radius: 12px;
      text-decoration: none;
      font-weight: 600;
      transition: transform 0.3s;
    }

    .cta-primary:hover { transform: translateY(-3px); }

    .cta-secondary {
      padding: 1rem 2rem;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      color: white;
      text-decoration: none;
      transition: background 0.3s;
    }

    .cta-secondary:hover { background: rgba(255, 255, 255, 0.05); }

    .hero-visual {
      position: relative;
      height: 400px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .glass-orb {
      width: 300px;
      height: 300px;
      background: linear-gradient(135deg, rgba(56, 189, 248, 0.4), rgba(129, 140, 248, 0.4));
      border-radius: 50%;
      filter: blur(40px);
      animation: morph 8s infinite alternate;
    }

    @keyframes morph {
      0% { border-radius: 50%; }
      100% { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; }
    }

    .floating-card {
      position: absolute;
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 1.5rem;
      border-radius: 20px;
      display: flex;
      align-items: center;
      gap: 1rem;
      animation: float 6s infinite ease-in-out;
    }

    .c1 { top: 10%; right: 0; animation-delay: 0s; }
    .c2 { bottom: 10%; left: 0; animation-delay: -3s; }

    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-20px); }
    }

    .card-icon {
      font-size: 2rem;
      background: rgba(255, 255, 255, 0.05);
      width: 50px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
    }

    .features {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
      padding: 5rem 0;
    }

    .feature-card {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.05);
      padding: 2.5rem;
      border-radius: 24px;
      transition: all 0.3s;
    }

    .feature-card:hover {
      background: rgba(255, 255, 255, 0.04);
      transform: translateY(-5px);
    }

    .feat-icon { font-size: 2.5rem; margin-bottom: 1.5rem; }

    footer {
      padding: 3rem 0;
      text-align: center;
      color: #64748b;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
    }
  `]
})
export class LandingComponent {}
