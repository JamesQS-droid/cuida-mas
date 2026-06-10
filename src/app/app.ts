import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { Sidebar } from './components/sidebar/sidebar';
import { Topbar } from './components/topbar/topbar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Sidebar, Topbar, CommonModule],
  template: `
    <div class="app-layout" [class.no-sidebar]="esLogin">
      @if (!esLogin) {
        <app-sidebar></app-sidebar>
      }
      <div class="main-content">
        @if (!esLogin) {
          <app-topbar></app-topbar>
        }
        <div class="page-content" [class.login-content]="esLogin">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .app-layout {
      display: flex;
      height: 100vh;
      overflow: hidden;
    }
    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .page-content {
      flex: 1;
      overflow-y: auto;
      background: #f5f7fa;
    }
    .login-content {
      background: white;
    }
  `]
})
export class App {
  esLogin = true;

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.esLogin = event.urlAfterRedirects.includes('/login');
      }
    });
  }
}