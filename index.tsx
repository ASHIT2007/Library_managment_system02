import '@angular/compiler';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation, Routes } from '@angular/router';
import { AppComponent } from './src/app.component';
import { HomeComponent } from './src/pages/home/home.component';
import { BookDetailsComponent } from './src/pages/book-details/book-details.component';
import { LoginComponent } from './src/pages/login/login.component';
import { MemberDashboardComponent } from './src/pages/dashboard-member/dashboard-member.component';
import { AdminDashboardComponent } from './src/pages/dashboard-admin/dashboard-admin.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'book/:id', component: BookDetailsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: MemberDashboardComponent },
  { path: 'admin', component: AdminDashboardComponent },
  { path: '**', redirectTo: '' }
];

bootstrapApplication(AppComponent, {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideRouter(routes, withHashLocation())
  ]
}).catch(err => console.error(err));

// AI Studio always uses an `index.tsx` file for all project types.