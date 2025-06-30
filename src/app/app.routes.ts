import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', loadComponent: () => import('./auth/login.component').then(m => m.LoginComponent) },
    { path: 'register', loadComponent: () => import('./auth/register.component').then(m => m.RegisterComponent) },
    { path: 'home', canActivate: [authGuard], loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
        children: [
            { path: 'database', canActivate: [authGuard], loadComponent: () => import('./pages/database.component').then(m => m.DatabaseComponent) },        
            { path: 'analysys', canActivate: [authGuard], loadComponent: () => import('./pages/analytics.component').then(m => m.AnalyticsComponent) },
            { path: 'user-manager', canActivate: [authGuard], loadComponent: () => import('./pages/user-manager.component').then(m => m.UserManagerComponent) },
        ]
    },

];
