import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <a routerLink="/" class="flex-shrink-0 flex items-center gap-2">
              <svg class="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span class="font-bold text-xl text-gray-900 tracking-tight">LibraFlow</span>
            </a>
            <div class="hidden sm:ml-8 sm:flex sm:space-x-8">
              <a routerLink="/" routerLinkActive="border-primary-500 text-gray-900" [routerLinkActiveOptions]="{exact: true}" class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Catalog
              </a>
              @if (auth.isMember()) {
                <a routerLink="/dashboard" routerLinkActive="border-primary-500 text-gray-900" class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  My Books
                </a>
              }
              @if (auth.isAdmin()) {
                <a routerLink="/admin" routerLinkActive="border-primary-500 text-gray-900" class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Admin Dashboard
                </a>
              }
            </div>
          </div>
          <div class="flex items-center space-x-4">
            @if (auth.isLoggedIn()) {
              <div class="flex items-center gap-3">
                <span class="text-sm text-gray-700 bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
                  {{ auth.currentUser()?.name }} <span class="text-xs text-gray-500 ml-1">({{ auth.currentUser()?.role }})</span>
                </span>
                <button (click)="auth.logout()" class="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Logout
                </button>
              </div>
            } @else {
              <a routerLink="/login" class="bg-primary-600 text-white hover:bg-primary-700 px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm">
                Login
              </a>
            }
          </div>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  auth = inject(AuthService);
}
