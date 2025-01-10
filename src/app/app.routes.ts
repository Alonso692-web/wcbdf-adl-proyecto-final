// src/app/app.routes.ts

import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LogComponent } from './components/log/log.component';
import { authGuard } from './guard/auth.guard';
import { CreditosComponent } from './components/creditos/creditos.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: DashboardComponent,
    canActivate: [authGuard],
    children: [
      { path: 'expenses', component: LogComponent },  // <-- Cambio aquí
      { path: 'creditos', component: CreditosComponent },
      { path: '', redirectTo: 'expenses', pathMatch: 'full' } // <-- Y aquí
    ]
  },
  { path: '**', redirectTo: '' }
];