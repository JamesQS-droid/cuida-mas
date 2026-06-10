import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then(m => m.Login)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.Dashboard)
  },
  {
    path: 'registro',
    loadComponent: () => import('./pages/registro/registro').then(m => m.Registro)
  },
  {
    path: 'alertas',
    loadComponent: () => import('./pages/alertas/alertas').then(m => m.Alertas)
  },
  {
    path: 'mapa',
    loadComponent: () => import('./pages/mapa/mapa').then(m => m.Mapa)
  }
];